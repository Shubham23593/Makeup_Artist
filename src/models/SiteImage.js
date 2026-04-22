import mongoose from "mongoose";

const SiteImageSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "Home Slider", "About Section", "Portfolio"
  title: { type: String }, // Optional title for the image
  imageUrl: { type: String, required: true },
  publicId: { type: String }, // For cloudinary or other storage references
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.SiteImage || mongoose.model("SiteImage", SiteImageSchema);
