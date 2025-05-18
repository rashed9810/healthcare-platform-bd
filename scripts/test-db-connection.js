// Test MongoDB connection
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform";

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log(`Connection string: ${MONGODB_URI}`);
  
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    // List all databases
    const dbs = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Get the default database
    const db = client.db();
    console.log(`Current database: ${db.databaseName}`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check if users collection exists
    const usersCollection = collections.find(c => c.name === 'users');
    if (usersCollection) {
      console.log('Users collection exists!');
      
      // Count users
      const userCount = await db.collection('users').countDocuments();
      console.log(`Number of users: ${userCount}`);
      
      // List first 5 users (without passwords)
      if (userCount > 0) {
        const users = await db.collection('users').find({}, { projection: { password: 0 } }).limit(5).toArray();
        console.log('Sample users:');
        users.forEach(user => {
          console.log(`- ${user.name} (${user.email})`);
        });
      }
    } else {
      console.log('Users collection does not exist yet.');
    }
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

testConnection().catch(console.error);
