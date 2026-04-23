import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteImage from "@/models/SiteImage";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    await connectDB();
    
    const query = category ? { category } : {};
    const images = await SiteImage.find(query).sort({ displayOrder: 1, createdAt: -1 });
    
    return NextResponse.json(
      { success: true, images },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const image = await SiteImage.create(data);
    return NextResponse.json({ success: true, image });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
