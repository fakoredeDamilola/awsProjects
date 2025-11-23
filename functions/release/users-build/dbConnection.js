"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = process.env.mongoURI || "";
console.log({ mongoURI });
if (!mongoURI) {
    console.error("mongoURI environment variable is not set");
    console.error("Available env vars:", Object.keys(process.env));
    throw new Error("Please set mongoURI environment variable");
}
async function connectDB() {
    if (mongoose_1.default.connection.readyState === 1) {
        // already connected
        return mongoose_1.default;
    }
    if (global.__mongoClientPromise) {
        // connection in progress — reuse
        await global.__mongoClientPromise;
        return mongoose_1.default;
    }
    console.log("we are here");
    // create connection promise and stash globally
    global.__mongoClientPromise = mongoose_1.default.connect(mongoURI, {
    // Optional mongoose options
    // useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => mongoose_1.default);
    console.log(`MongoDB Connected: ${mongoose_1.default.connection.host}`);
    await global.__mongoClientPromise;
    return mongoose_1.default;
}
//# sourceMappingURL=dbConnection.js.map