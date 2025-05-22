import { NextResponse } from "next/server";
import { getDoctorsCollection } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate the ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    // Fetch the doctor from the database
    const doctorsCollection = await getDoctorsCollection();
    const doctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Return the doctor details
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
