// Test the login API endpoint directly with node-fetch
const fetch = require("node-fetch");

// Test credentials
const testCredentials = {
  email: "test@example.com",
  password: "password123",
};

async function testLoginAPI() {
  console.log("Testing login API endpoint directly with fetch...");
  console.log(`Attempting to login with email: ${testCredentials.email}`);

  try {
    console.log("Sending request to login API...");
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testCredentials),
    });

    console.log(`Response status: ${response.status}`);

    // Try to parse the response as JSON
    let data;
    try {
      data = await response.json();
      console.log("Response data:", data);
    } catch (jsonError) {
      console.error("Failed to parse response as JSON:", jsonError);
      console.log("Response text:", await response.text());
      return;
    }

    if (response.ok) {
      console.log("Login API test successful!");
      console.log("User ID:", data.user.id);
      console.log("User role:", data.user.role);
      console.log("Token exists:", !!data.token);
    } else {
      console.error("Login API test failed!");
      console.error("Error message:", data.message);
    }
  } catch (error) {
    console.error("Login API test error:", error);
  }
}

testLoginAPI().catch(console.error);
