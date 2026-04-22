import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteImage from "@/models/SiteImage";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const updateData = await request.json();

    const image = await SiteImage.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, image });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await SiteImage.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Image removed from site configuration" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
