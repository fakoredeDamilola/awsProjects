import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {  APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import * as bcrypt from 'bcrypt';
import * as dotenv from "dotenv";
dotenv.config();

import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ 
  // region: "us-east-1"
    region: "local",
    endpoint: "http://localhost:8000",
 });
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;
const userId = randomUUID();

export const putUserhandler = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
   let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
      console.log({http:event.requestContext.http.method,body:event.body})
 
        if(event.body){
            const {email,password,name} = JSON.parse(event.body || "")

            const hashedPassword = await hashPassword(password)
            body= await docClient.send(
                new PutCommand({
                    TableName: tableName,
                Item: {userId,email,password:hashedPassword,name},
            })
        )
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

const saltRounds = 10; // 10–12 is common

async function hashPassword(plainPassword:string) {
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}
