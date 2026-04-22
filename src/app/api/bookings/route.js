import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

// Admin gets all bookings
export async function GET(request) {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Client creates a new booking
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Check if slot is already booked
    const existing = await Booking.findOne({ date: data.date, time: data.time, status: { $in: ["Pending", "Confirmed"] } });
    if (existing) {
      return NextResponse.json({ error: "Time slot is already booked" }, { status: 400 });
    }

    const booking = await Booking.create(data);
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
