// Test the login API endpoint
const fetch = require('node-fetch');

// Test credentials
const testCredentials = {
  email: "test@example.com",
  password: "password123"
};

async function testLoginAPI() {
  console.log('Testing login API endpoint...');
  console.log(`Attempting to login with email: ${testCredentials.email}`);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials),
    });
    
    console.log(`Response status: ${response.status}`);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('Login API test successful!');
    } else {
      console.error('Login API test failed!');
    }
    
  } catch (error) {
    console.error('Login API test error:', error);
  }
}

testLoginAPI().catch(console.error);
