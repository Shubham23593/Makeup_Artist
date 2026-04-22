import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary keys are configured, use Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      return new Promise((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "makeup_atelier" },
          (error, result) => {
            if (error) {
              resolve(NextResponse.json({ error: "Cloudinary upload failed. Check your API keys in .env" }, { status: 500 }));
            } else {
              resolve(NextResponse.json({ success: true, url: result.secure_url, public_id: result.public_id }));
            }
          }
        );
        
        const { Readable } = require("stream");
        const stream = Readable.from(buffer);
        stream.pipe(uploadStream);
      });
    } else {
      // Fallback: Save file locally in public/uploads if Cloudinary is not configured
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Ensure the uploads directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate a unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name) || ".jpg";
      const newFilename = `${uniqueSuffix}${ext}`;
      const filepath = path.join(uploadDir, newFilename);

      // Write file locally
      await fs.writeFile(filepath, buffer);

      // Return the public URL
      const publicUrl = `/uploads/${newFilename}`;
      return NextResponse.json({ success: true, url: publicUrl, public_id: newFilename });
    }

  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file", details: error.message }, { status: 500 });
  }
}
