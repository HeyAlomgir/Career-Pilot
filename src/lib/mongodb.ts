import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

if (!uri && process.env.NODE_ENV !== "production") {
  console.warn("Warning: MONGODB_URI is not set. Please configure it in your .env.local file.");
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // Prevent multiple connections during hot reloading
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri || "mongodb://localhost:27017/careerpilot");
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri || "mongodb://localhost:27017/careerpilot");
}

const db = client.db();

export { client, db };
