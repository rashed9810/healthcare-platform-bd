// Verify that the test user exists and can be authenticated
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform";

// Test credentials
const testCredentials = {
  email: "test@example.com",
  password: "password123"
};

async function verifyTestUser() {
  console.log('Verifying test user...');
  console.log(`Email: ${testCredentials.email}`);
  
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
      console.error('ERROR: User not found in database!');
      console.log('Creating a new test user...');
      
      // Create a new test user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(testCredentials.password, saltRounds);
      
      const newUser = {
        name: "Test User",
        email: testCredentials.email,
        password: hashedPassword,
        phone: "1234567890",
        language: "en",
        role: "patient",
        createdAt: new Date().toISOString()
      };
      
      const result = await usersCollection.insertOne(newUser);
      console.log(`New test user created with ID: ${result.insertedId}`);
      
      // Retrieve the newly created user
      const createdUser = await usersCollection.findOne({ _id: result.insertedId });
      console.log('User details:');
      console.log(`- ID: ${createdUser._id}`);
      console.log(`- Name: ${createdUser.name}`);
      console.log(`- Email: ${createdUser.email}`);
      console.log(`- Role: ${createdUser.role}`);
      console.log(`- Password hash: ${createdUser.password.substring(0, 20)}...`);
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(testCredentials.password, createdUser.password);
      console.log(`Password verification: ${isPasswordValid ? 'SUCCESSFUL' : 'FAILED'}`);
      
      return;
    }
    
    console.log('User found in database!');
    console.log('User details:');
    console.log(`- ID: ${user._id}`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Password hash: ${user.password.substring(0, 20)}...`);
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(testCredentials.password, user.password);
    console.log(`Password verification: ${isPasswordValid ? 'SUCCESSFUL' : 'FAILED'}`);
    
    if (!isPasswordValid) {
      console.log('Updating password for test user...');
      
      // Update password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(testCredentials.password, saltRounds);
      
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log('Password updated successfully!');
      
      // Verify new password
      const updatedUser = await usersCollection.findOne({ _id: user._id });
      const isNewPasswordValid = await bcrypt.compare(testCredentials.password, updatedUser.password);
      console.log(`New password verification: ${isNewPasswordValid ? 'SUCCESSFUL' : 'FAILED'}`);
    }
    
  } catch (error) {
    console.error('Error verifying test user:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

verifyTestUser().catch(console.error);
