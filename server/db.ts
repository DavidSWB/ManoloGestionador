import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not configured in environment variables");
  throw new Error("MONGO_URI not configured");
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB() {
  try {
    if (!db) {
      console.log("Attempting to connect to MongoDB with URI:", uri.split('@')[1]); // Log only the host part for security
      client = new MongoClient(uri);
      await client.connect();
      db = client.db(process.env.DB_NAME || "manolos_gestion");
      console.log("Successfully connected to MongoDB database:", db.databaseName);
    }
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export function getDb() {
  if (!db) throw new Error("Database not connected. Call connectDB first.");
  return db;
}

export async function closeDB() {
  await client.close();
  db = null;
}
