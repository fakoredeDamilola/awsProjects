import mongoose from 'mongoose';



declare global {
  // allow global caching in dev/hot reload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __mongoClientPromise: Promise<typeof mongoose> | undefined;
}

const mongoURI = process.env.mongoURI || "";

if (!mongoURI) {
  console.error("mongoURI environment variable is not set");
  console.error("Available env vars:", Object.keys(process.env));
  throw new Error("Please set mongoURI environment variable");
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    // already connected
    return mongoose;
  }

  if (global.__mongoClientPromise) {
    // connection in progress — reuse
    await global.__mongoClientPromise;
    return mongoose;
  }
  console.log("we are here")
  // create connection promise and stash globally
  global.__mongoClientPromise = mongoose.connect(mongoURI, {
    // Optional mongoose options
    // useNewUrlParser: true, useUnifiedTopology: true
  }).then(() => mongoose);

  console.log(`MongoDB Connected: ${mongoose.connection.host}`);

  await global.__mongoClientPromise;
  return mongoose;
}

