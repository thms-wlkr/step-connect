const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

/**
 * Calculate compatibility score between two users
 * Based on step goals, pace, availability, and location
 */
function compatibilityScore(userA, userB) {
  let score = 0;
  
  // Step goal similarity (max 40 points)
  const stepDiff = Math.abs(userA.stepGoal - userB.stepGoal);
  score += Math.max(0, 40 - (stepDiff / 500));
  
  // Pace match (30 points for exact match, 15 for compatible)
  if (userA.pace === userB.pace) {
    score += 30;
  } else if (
    (userA.pace === 'moderate' && (userB.pace === 'slow' || userB.pace === 'brisk')) ||
    (userB.pace === 'moderate' && (userA.pace === 'slow' || userA.pace === 'brisk'))
  ) {
    score += 15;
  }
  
  // Availability overlap (5 points per shared time slot)
  const availabilityOverlap = userA.availability.filter(time => 
    userB.availability.includes(time)
  ).length;
  score += availabilityOverlap * 10;
  
  // Location proximity (20 points if same area)
  if (userA.location === userB.location) {
    score += 20;
  }
  
  return Math.min(100, score);
}

/**
 * Get potential matches for a user
 */
async function getPotentialMatches(userId) {
  try {
    // Get user's profile
    const userProfile = await ddb.send(new QueryCommand({
      TableName: process.env.PROFILES_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }));
    
    if (!userProfile.Items || userProfile.Items.length === 0) {
      throw new Error('User profile not found');
    }
    
    const currentUser = userProfile.Items[0];
    
    // Get existing swipes to exclude
    const swipes = await ddb.send(new QueryCommand({
      TableName: process.env.SWIPES_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }));
    
    const swipedUserIds = new Set(swipes.Items?.map(s => s.targetUserId) || []);
    
    // Get all profiles (in production, use location-based filtering)
    const allProfiles = await ddb.send(new ScanCommand({
      TableName: process.env.PROFILES_TABLE,
      FilterExpression: 'userId <> :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }));
    
    // Filter and score potential matches
    const potentialMatches = allProfiles.Items
      .filter(profile => !swipedUserIds.has(profile.userId))
      .map(profile => ({
        ...profile,
        compatibilityScore: compatibilityScore(currentUser, profile)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 20); // Return top 20 matches
    
    return potentialMatches;
  } catch (error) {
    console.error('Error getting potential matches:', error);
    throw error;
  }
}

/**
 * Record a swipe action and check for match
 */
async function recordSwipe(userId, targetUserId, direction) {
  try {
    // Record the swipe
    await ddb.send(new PutCommand({
      TableName: process.env.SWIPES_TABLE,
      Item: {
        userId,
        targetUserId,
        direction,
        swipedAt: new Date().toISOString()
      }
    }));
    
    // If swipe was right, check if it's a mutual match
    if (direction === 'right') {
      const reciprocalSwipe = await ddb.send(new QueryCommand({
        TableName: process.env.SWIPES_TABLE,
        KeyConditionExpression: 'userId = :targetUserId AND targetUserId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':targetUserId': targetUserId
        }
      }));
      
      // Check if other user also swiped right
      const isMatch = reciprocalSwipe.Items?.some(s => s.direction === 'right');
      
      if (isMatch) {
        // Create match record
        const matchId = `${[userId, targetUserId].sort().join('-')}`;
        await ddb.send(new PutCommand({
          TableName: process.env.MATCHES_TABLE,
          Item: {
            id: matchId,
            userA: userId < targetUserId ? userId : targetUserId,
            userB: userId < targetUserId ? targetUserId : userId,
            matchedAt: new Date().toISOString()
          }
        }));
        
        return { match: true, matchId };
      }
    }
    
    return { match: false };
  } catch (error) {
    console.error('Error recording swipe:', error);
    throw error;
  }
}

/**
 * Get user's matches
 */
async function getUserMatches(userId) {
  try {
    // Query both indexes
    const [matchesAsUserA, matchesAsUserB] = await Promise.all([
      ddb.send(new QueryCommand({
        TableName: process.env.MATCHES_TABLE,
        IndexName: 'UserAIndex',
        KeyConditionExpression: 'userA = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })),
      ddb.send(new QueryCommand({
        TableName: process.env.MATCHES_TABLE,
        IndexName: 'UserBIndex',
        KeyConditionExpression: 'userB = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }))
    ]);
    
    const allMatches = [
      ...(matchesAsUserA.Items || []),
      ...(matchesAsUserB.Items || [])
    ].sort((a, b) => new Date(b.matchedAt) - new Date(a.matchedAt));
    
    // Get profile details for each match
    const matchedUserIds = allMatches.map(match => 
      match.userA === userId ? match.userB : match.userA
    );
    
    const profiles = await Promise.all(
      matchedUserIds.map(id => 
        ddb.send(new QueryCommand({
          TableName: process.env.PROFILES_TABLE,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': id
          }
        }))
      )
    );
    
    return allMatches.map((match, index) => ({
      ...match,
      profile: profiles[index].Items?.[0]
    }));
  } catch (error) {
    console.error('Error getting user matches:', error);
    throw error;
  }
}

/**
 * Lambda handler
 */
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const { httpMethod, pathParameters, body, requestContext } = event;
    const userId = requestContext.authorizer?.claims?.sub;
    
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }
    
    let response;
    
    // GET /profiles - Get potential matches
    if (httpMethod === 'GET' && event.resource === '/profiles') {
      const matches = await getPotentialMatches(userId);
      response = { matches };
    }
    
    // POST /swipe - Record swipe
    else if (httpMethod === 'POST' && event.resource === '/swipe') {
      const { targetUserId, direction } = JSON.parse(body);
      const result = await recordSwipe(userId, targetUserId, direction);
      response = result;
    }
    
    // GET /matches - Get user matches
    else if (httpMethod === 'GET' && event.resource === '/matches') {
      const matches = await getUserMatches(userId);
      response = { matches };
    }
    
    else {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Not found' })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: error.message,
        type: error.name
      })
    };
  }
};
