const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

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
    
    // GET /users/{userId} - Get user profile
    if (httpMethod === 'GET' && pathParameters?.userId) {
      const result = await ddb.send(new GetCommand({
        TableName: process.env.USERS_TABLE,
        Key: { id: pathParameters.userId }
      }));
      
      if (!result.Item) {
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'User not found' })
        };
      }
      
      response = result.Item;
    }
    
    // POST /users - Create user profile
    else if (httpMethod === 'POST') {
      const userData = JSON.parse(body);
      
      const user = {
        id: userId,
        email: requestContext.authorizer?.claims?.email,
        createdAt: new Date().toISOString(),
        ...userData
      };
      
      await ddb.send(new PutCommand({
        TableName: process.env.USERS_TABLE,
        Item: user
      }));
      
      // Also create profile entry
      await ddb.send(new PutCommand({
        TableName: process.env.PROFILES_TABLE,
        Item: {
          userId: userId,
          ...userData,
          createdAt: new Date().toISOString()
        }
      }));
      
      response = user;
    }
    
    // PUT /users/{userId} - Update user profile
    else if (httpMethod === 'PUT' && pathParameters?.userId) {
      if (pathParameters.userId !== userId) {
        return {
          statusCode: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Forbidden' })
        };
      }
      
      const updates = JSON.parse(body);
      
      await ddb.send(new UpdateCommand({
        TableName: process.env.USERS_TABLE,
        Key: { id: userId },
        UpdateExpression: 'SET #name = :name, #location = :location, #stepGoal = :stepGoal, #pace = :pace, #availability = :availability, #bio = :bio, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#location': 'location',
          '#stepGoal': 'stepGoal',
          '#pace': 'pace',
          '#availability': 'availability',
          '#bio': 'bio'
        },
        ExpressionAttributeValues: {
          ':name': updates.name,
          ':location': updates.location,
          ':stepGoal': updates.stepGoal,
          ':pace': updates.pace,
          ':availability': updates.availability,
          ':bio': updates.bio,
          ':updatedAt': new Date().toISOString()
        }
      }));
      
      response = { success: true };
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
