/**
 * Database seeding script
 *
 * This script seeds the database with initial data for development and testing.
 *
 * Usage:
 * node scripts/seed-db.js
 */

const { MongoClient } = require("mongodb")
const bcrypt = require("bcrypt")

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-platform"

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // Will be hashed
    phone: "+8801712345678",
    role: "admin",
    language: "en",
    createdAt: new Date(),
  },
  {
    name: "Doctor User",
    email: "doctor@example.com",
    password: "doctor123", // Will be hashed
    phone: "+8801712345679",
    role: "doctor",
    language: "en",
    createdAt: new Date(),
  },
  {
    name: "Patient User",
    email: "patient@example.com",
    password: "patient123", // Will be hashed
    phone: "+8801712345670",
    role: "patient",
    language: "en",
    createdAt: new Date(),
  },
]

const doctors = [
  {
    specialty: "General Physician",
    qualifications: ["MBBS, Dhaka Medical College", "FCPS (Medicine), Bangladesh College of Physicians and Surgeons"],
    experience: 10,
    languages: ["Bengali", "English"],
    availableSlots: [
      { day: "Monday", startTime: "09:00", endTime: "17:00", available: true },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00", available: true },
      { day: "Friday", startTime: "09:00", endTime: "13:00", available: true },
    ],
    location: {
      address: "Dhaka Medical College Hospital",
      city: "Dhaka",
      coordinates: {
        latitude: 23.7276,
        longitude: 90.3973,
      },
    },
    rating: 4.8,
    reviewCount: 124,
    consultationFee: 800,
    bio: "Dr. Anika Rahman is a highly experienced general physician with over 10 years of practice. She specializes in preventive care, chronic disease management, and women's health issues.",
  },
  {
    specialty: "Cardiologist",
    qualifications: ["MBBS, Dhaka Medical College", "MD (Cardiology), BSMMU"],
    experience: 15,
    languages: ["Bengali", "English"],
    availableSlots: [
      { day: "Tuesday", startTime: "10:00", endTime: "18:00", available: true },
      { day: "Thursday", startTime: "10:00", endTime: "18:00", available: true },
      { day: "Saturday", startTime: "09:00", endTime: "14:00", available: true },
    ],
    location: {
      address: "Bangabandhu Sheikh Mujib Medical University",
      city: "Dhaka",
      coordinates: {
        latitude: 23.7398,
        longitude: 90.3721,
      },
    },
    rating: 4.9,
    reviewCount: 215,
    consultationFee: 1200,
    bio: "Dr. Kamal Hossain is a renowned cardiologist with expertise in interventional cardiology and heart failure management. He has performed over 1000 cardiac procedures and is dedicated to providing comprehensive cardiac care.",
  },
]

// Seed the database
async function seedDatabase() {
  let client

  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("doctors").deleteMany({})
    await db.collection("appointments").deleteMany({})
    await db.collection("medicalRecords").deleteMany({})

    console.log("Cleared existing data")

    // Insert users with hashed passwords
    const saltRounds = 10
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds)
        return { ...user, password: hashedPassword }
      }),
    )

    const insertedUsers = await db.collection("users").insertMany(usersWithHashedPasswords)
    console.log(`Inserted ${insertedUsers.insertedCount} users`)

    // Get the doctor user ID
    const doctorUser = await db.collection("users").findOne({ role: "doctor" })

    // Insert doctors
    const doctorsWithUserId = doctors.map((doctor) => ({
      ...doctor,
      userId: doctorUser._id,
    }))

    const insertedDoctors = await db.collection("doctors").insertMany(doctorsWithUserId)
    console.log(`Inserted ${insertedDoctors.insertedCount} doctors`)

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("MongoDB connection closed")
    }
  }
}

// Run the seed function
seedDatabase()
