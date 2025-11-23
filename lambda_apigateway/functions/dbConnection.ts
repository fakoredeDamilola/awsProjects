import mongoose from 'mongoose';

// const connectDB = async (): Promise<void> => {
//   try {
//     const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dfako:kolawole@nodejspassport.nahp0.mongodb.net/createevent';
    
//     const conn = await mongoose.connect(mongoURI);
    
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
    
//     mongoose.connection.on('error', (err) => {
//       console.error(`MongoDB connection error: ${err}`);
//     });
    
//     mongoose.connection.on('disconnected', () => {
//       console.log('MongoDB disconnected');
//     });
    
//     process.on('SIGINT', async () => {
//       await mongoose.connection.close();
//       console.log('MongoDB connection closed through app termination');
//       process.exit(0);
//     });
    
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error}`);
//     process.exit(1);
//   }
// };

declare global {
  // allow global caching in dev/hot reload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __mongoClientPromise: Promise<typeof mongoose> | undefined;
}

const mongoURI = process.env.mongoURI || "";
console.log({mongoURI})

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

