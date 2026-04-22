import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  notes: { type: String, default: "" },
  outfitImageURL: { type: String, default: "" },
  referenceImageURL: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled", "Completed"], default: "Pending" },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
