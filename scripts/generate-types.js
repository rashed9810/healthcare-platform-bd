/**
 * Type generation script
 *
 * This script generates TypeScript type definitions from MongoDB schema.
 *
 * Usage:
 * node scripts/generate-types.js
 */

const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform"

// Output file path
const OUTPUT_FILE = path.join(__dirname, "..", "types", "generated.ts")

// MongoDB to TypeScript type mapping
const mongoToTsType = (value) => {
  if (value === null || value === undefined) return "any"

  switch (typeof value) {
    case "string":
      return "string"
    case "number":
      return Number.isInteger(value) ? "number" : "number"
    case "boolean":
      return "boolean"
    case "object":
      if (Array.isArray(value)) {
        if (value.length === 0) return "any[]"
        return `${mongoToTsType(value[0])}[]`
      }
      if (value instanceof Date) return "Date"
      if (value._bsontype === "ObjectID") return "ObjectId"
      return "Record<string, any>"
    default:
      return "any"
  }
}

// Generate TypeScript interface from MongoDB document
const generateInterface = (name, document) => {
  let interfaceStr = `export interface ${name} {\n`

  for (const [key, value] of Object.entries(document)) {
    if (key === "_id") {
      interfaceStr += `  _id: ObjectId\n`
      continue
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
      // Nested object
      const nestedName = `${name}${key.charAt(0).toUpperCase() + key.slice(1)}`
      const nestedInterface = generateInterface(nestedName, value)
      interfaceStr += `  ${key}: ${nestedName}\n`
      continue
    }

    interfaceStr += `  ${key}: ${mongoToTsType(value)}\n`
  }

  interfaceStr += "}\n\n"
  return interfaceStr
}

// Generate TypeScript types from MongoDB collections
async function generateTypes() {
  let client

  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Get all collections
    const collections = await db.listCollections().toArray()

    let typesContent = `import { ObjectId } from 'mongodb'\n\n`

    // Generate types for each collection
    for (const collection of collections) {
      const collectionName = collection.name

      // Skip system collections
      if (collectionName.startsWith("system.")) continue

      // Get a sample document
      const sampleDocument = await db.collection(collectionName).findOne({})

      if (sampleDocument) {
        // Generate interface name (singular, PascalCase)
        const interfaceName = collectionName
          .replace(/s$/, "") // Remove trailing 's'
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("")

        // Generate interface
        typesContent += generateInterface(interfaceName, sampleDocument)
      }
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, typesContent)
    console.log(`TypeScript types generated at ${OUTPUT_FILE}`)
  } catch (error) {
    console.error("Error generating types:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("MongoDB connection closed")
    }
  }
}

// Run the type generation function
generateTypes()
