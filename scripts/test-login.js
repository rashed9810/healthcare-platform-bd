// Test login functionality directly
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform";

// JWT secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Test credentials
const testCredentials = {
  email: "test@example.com",
  password: "password123"
};

async function testLogin() {
  console.log('Testing login functionality...');
  console.log(`Attempting to login with email: ${testCredentials.email}`);
  
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Find user
    const user = await usersCollection.findOne({ email: testCredentials.email });
    if (!user) {
      console.error('User not found!');
      return;
    }
    
    console.log('User found in database');
    console.log(`User ID: ${user._id}`);
    console.log(`User name: ${user.name}`);
    console.log(`User role: ${user.role}`);
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(testCredentials.password, user.password);
    if (!isPasswordValid) {
      console.error('Password is invalid!');
      return;
    }
    
    console.log('Password is valid!');
    
    // Create JWT token
    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    
    console.log('JWT token created successfully');
    console.log(`Token: ${token}`);
    
    // Login successful
    console.log('Login test successful!');
    
  } catch (error) {
    console.error('Login test failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

testLogin().catch(console.error);
