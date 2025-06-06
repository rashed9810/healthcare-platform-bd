import { MongoClient, type Db } from "mongodb"

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform"

// MongoDB client
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export async function connectToDatabase(): Promise<Db> {
  const client = await clientPromise
  const db = client.db()
  return db
}

// Export collections for easy access
export async function getCollection(collectionName: string) {
  const db = await connectToDatabase()
  return db.collection(collectionName)
}

// Export specific collections
export async function getUsersCollection() {
  return getCollection("users")
}

export async function getDoctorsCollection() {
  return getCollection("doctors")
}

export async function getAppointmentsCollection() {
  return getCollection("appointments")
}

export async function getMedicalRecordsCollection() {
  return getCollection("medicalRecords")
}
