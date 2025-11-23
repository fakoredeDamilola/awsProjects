import mongoose from 'mongoose';
declare global {
    var __mongoClientPromise: Promise<typeof mongoose> | undefined;
}
export declare function connectDB(): Promise<typeof mongoose>;
//# sourceMappingURL=dbConnection.d.ts.map