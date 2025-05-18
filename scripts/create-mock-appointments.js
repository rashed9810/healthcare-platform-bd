// Create mock appointments for testing
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

console.log("Starting script...");
console.log(
  "MongoDB URI:",
  process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform"
);

// MongoDB connection string from environment variables
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform";

async function createMockAppointments() {
  console.log("Creating mock appointments...");

  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const appointmentsCollection = db.collection("appointments");
    const usersCollection = db.collection("users");

    // Find test user
    const testUser = await usersCollection.findOne({
      email: "test@example.com",
    });

    if (!testUser) {
      console.error(
        "Test user not found! Please run create-test-user.js first."
      );
      return;
    }

    console.log(`Found test user with ID: ${testUser._id}`);

    // Create mock appointments
    const mockAppointments = [
      {
        patientId: testUser._id.toString(),
        doctorId: "Dr. Sarah Johnson",
        date: "2025-06-15",
        time: "10:00 AM",
        type: "video",
        status: "scheduled",
        symptoms: "Regular checkup",
        createdAt: new Date().toISOString(),
      },
      {
        patientId: testUser._id.toString(),
        doctorId: "Dr. Michael Chen",
        date: "2025-06-22",
        time: "2:30 PM",
        type: "in-person",
        status: "scheduled",
        symptoms: "Follow-up appointment",
        createdAt: new Date().toISOString(),
      },
      {
        patientId: testUser._id.toString(),
        doctorId: "Dr. Anika Rahman",
        date: "2025-05-10",
        time: "1:00 PM",
        type: "video",
        status: "completed",
        symptoms: "Fever and headache",
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        patientId: testUser._id.toString(),
        doctorId: "Dr. Kamal Hossain",
        date: "2025-04-05",
        time: "11:30 AM",
        type: "in-person",
        status: "cancelled",
        symptoms: "Skin rash",
        createdAt: new Date(
          Date.now() - 60 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ];

    // Check if appointments already exist
    const existingAppointments = await appointmentsCollection
      .find({
        patientId: testUser._id.toString(),
      })
      .toArray();

    if (existingAppointments.length > 0) {
      console.log(
        `Found ${existingAppointments.length} existing appointments for test user.`
      );
      console.log("Deleting existing appointments...");

      await appointmentsCollection.deleteMany({
        patientId: testUser._id.toString(),
      });

      console.log("Existing appointments deleted.");
    }

    // Insert mock appointments
    const result = await appointmentsCollection.insertMany(mockAppointments);
    console.log(
      `${result.insertedCount} mock appointments created successfully!`
    );

    // Retrieve and display the created appointments
    const createdAppointments = await appointmentsCollection
      .find({
        patientId: testUser._id.toString(),
      })
      .toArray();

    console.log("\nCreated appointments:");
    createdAppointments.forEach((appointment, index) => {
      console.log(`\nAppointment ${index + 1}:`);
      console.log(`- ID: ${appointment._id}`);
      console.log(`- Doctor: ${appointment.doctorId}`);
      console.log(`- Date: ${appointment.date}`);
      console.log(`- Time: ${appointment.time}`);
      console.log(`- Type: ${appointment.type}`);
      console.log(`- Status: ${appointment.status}`);
      console.log(`- Symptoms: ${appointment.symptoms}`);
    });
  } catch (error) {
    console.error("Error creating mock appointments:", error);
  } finally {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed.");
    }
  }
}

createMockAppointments().catch(console.error);
