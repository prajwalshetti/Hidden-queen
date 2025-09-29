import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    problemType: { type: String, required: true, enum: ["bug", "feature", "improvement", "experience", "other"] },
    problemDescription: { type: String, required: true },
    suggestion: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    attachScreenshot: { type: Boolean, default: false },
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);


