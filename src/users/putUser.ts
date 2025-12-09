import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {  APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import bcrypt from 'bcrypt';

import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ 
  // region: "us-east-1"
  region: "local",
  endpoint: "http://localhost:8000",
 });
const docClient = DynamoDBDocumentClient.from(client);

const tableName = "events-user-creation"

export const handler = async(event:APIGatewayProxyEvent,context:Context): Promise<APIGatewayProxyResult> => {
   let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
      console.log({http:event.httpMethod,body:event.body})
    switch (event.httpMethod) {
    case "POST /users":
        const {email,password,name} = JSON.parse(event.body)
        // body= await docClient.send(
        //     new PutCommand({
        //         TableName: tableName,
        //         Item: JSON.parse(event.body),
        //     })
        // )

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