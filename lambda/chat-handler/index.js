const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { requestContext, body } = event;
  const connectionId = requestContext.connectionId;
  const routeKey = requestContext.routeKey;
  
  try {
    // Handle WebSocket connection
    if (routeKey === '$connect') {
      console.log('Client connected:', connectionId);
      return { statusCode: 200 };
    }
    
    // Handle WebSocket disconnection
    if (routeKey === '$disconnect') {
      console.log('Client disconnected:', connectionId);
      return { statusCode: 200 };
    }
    
    // Handle sendMessage route
    if (routeKey === 'sendMessage') {
      const data = JSON.parse(body);
      const { toUserId, content, conversationId } = data;
      const fromUserId = requestContext.authorizer?.principalId || 'anonymous';
      
      // Save message to DynamoDB
      const message = {
        conversationId: conversationId || `${[fromUserId, toUserId].sort().join('-')}`,
        timestamp: new Date().toISOString(),
        fromUserId,
        toUserId,
        content,
        messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      await ddb.send(new PutCommand({
        TableName: process.env.MESSAGES_TABLE,
        Item: message
      }));
      
      console.log('Message saved:', message);
      
      // TODO: Send message to recipient via WebSocket if they're connected
      // This requires tracking connectionId -> userId mapping
      
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message })
      };
    }
    
    // Handle getMessages route
    if (routeKey === 'getMessages') {
      const data = JSON.parse(body);
      const { conversationId } = data;
      
      const result = await ddb.send(new QueryCommand({
        TableName: process.env.MESSAGES_TABLE,
        KeyConditionExpression: 'conversationId = :conversationId',
        ExpressionAttributeValues: {
          ':conversationId': conversationId
        },
        ScanIndexForward: true,
        Limit: 50
      }));
      
      return {
        statusCode: 200,
        body: JSON.stringify({ messages: result.Items || [] })
      };
    }
    
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown route' })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        type: error.name
      })
    };
  }
};
