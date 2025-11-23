import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createEvent } from "./routes/events/createEventHandler";
import { seeAllEvents } from "./routes/events/seeAllEventsHandler";
import { connectDB } from "./dbConnection";

export const handlerEvents = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  await connectDB();
  const path = event.path || "";
  const method = event.httpMethod || "GET";
  const body = event.body ? JSON.parse(event.body) : {};
  const token = event.headers.authorization?.split(' ')[1];

  // Normalize path under /users
  // e.g., API Gatewpay invokes /users/register or /users/login
  console.log({path,method,body,token})
  if (path.match(/\/events\/create$/) && method === "POST") {
    const res = await createEvent(body);
    return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
  }

  if (path.match(/\/events\/all$/) && method === "GET") {
    const res = await seeAllEvents(body);
    return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
  }

  return { statusCode: 404, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Not found" }) };
};