import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists. Setup complete." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, message: "Admin created setup complete." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
