import { handler } from './handler';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// Mock API Gateway event
const createMockEvent = (
  method: string,
  path: string,
  body?: any,
  headers?: Record<string, string>
): APIGatewayProxyEvent => {
  return {
    httpMethod: method,
    path: path,
    resource: path,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      accountId: 'local',
      apiId: 'local',
      protocol: 'HTTP/1.1',
      httpMethod: method,
      path: path,
      stage: 'local',
      requestId: 'local-request-id',
      requestTimeEpoch: Date.now(),
      resourceId: 'local',
      resourcePath: path,
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: 'local-test',
        userArn: null,
      },
      authorizer: null,
    },
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    body: body ? JSON.stringify(body) : null,
    isBase64Encoded: false,
  } as APIGatewayProxyEvent;
};

// Mock Lambda context
const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'local-test',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:local:000000000000:function:local-test',
  memoryLimitInMB: '1024',
  awsRequestId: 'local-request-id',
  logGroupName: '/aws/lambda/local-test',
  logStreamName: 'local-stream',
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

// Test function
async function testLambda() {
  console.log('🧪 Testing Lambda handler locally...\n');

  // Test 1: Root endpoint
  console.log('Test 1: GET /');
  const event1 = createMockEvent('GET', '/');
  const result1 = await handler(event1, mockContext);
  console.log('Response:', JSON.stringify(result1, null, 2));
  console.log('\n---\n');

  // Test 2: Health check
  console.log('Test 2: GET /health');
  const event2 = createMockEvent('GET', '/health');
  const result2 = await handler(event2, mockContext);
  console.log('Response:', JSON.stringify(result2, null, 2));
  console.log('\n---\n');

  // Test 3: API endpoint
  console.log('Test 3: GET /api/events');
  const event3 = createMockEvent('GET', '/api/events');
  const result3 = await handler(event3, mockContext);
  console.log('Response:', JSON.stringify(result3, null, 2));
  console.log('\n---\n');

  console.log('✅ Lambda tests complete!');
  process.exit(0);
}

// Run tests
testLambda().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
