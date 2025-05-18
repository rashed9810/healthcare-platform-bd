// Create a test user in MongoDB
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform";

// Test user data
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123", // This will be hashed
  phone: "1234567890",
  language: "en",
  role: "patient",
  createdAt: new Date().toISOString()
};

async function createTestUser() {
  console.log('Creating test user...');
  
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: testUser.email });
    if (existingUser) {
      console.log(`User with email ${testUser.email} already exists.`);
      return;
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testUser.password, saltRounds);
    
    // Create user with hashed password
    const userToInsert = {
      ...testUser,
      password: hashedPassword
    };
    
    const result = await usersCollection.insertOne(userToInsert);
    console.log(`Test user created with ID: ${result.insertedId}`);
    console.log('User credentials:');
    console.log(`- Email: ${testUser.email}`);
    console.log(`- Password: ${testUser.password} (unhashed)`);
    
  } catch (error) {
    console.error('Failed to create test user:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

createTestUser().catch(console.error);
