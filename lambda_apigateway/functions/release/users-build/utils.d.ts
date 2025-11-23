import { APIGatewayProxyResult } from 'aws-lambda';
export declare const authenticateUser: (token: string | undefined) => Promise<(import("mongoose").Document<unknown, {}, import("./schemas/User").IUser, {}, {}> & import("./schemas/User").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const jsonResponse: (statusCode: number, body: object) => APIGatewayProxyResult;
//# sourceMappingURL=utils.d.ts.map