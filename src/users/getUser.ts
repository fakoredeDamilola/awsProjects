import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const tableName = "events-user-creation"

export const handler = async(event:APIGatewayProxyEvent,context:Context): Promise<APIGatewayProxyResult> => {
   let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.httpMethod) {
    case "GET /users":
        body= await docClient.send(
            new ScanCommand({
                TableName: tableName,
            })
        )
body = body.Items;
break;
default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
  }
  }catch(err:any) {
      statusCode = 400;
    body = err.message;
  }  finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  }
  
}