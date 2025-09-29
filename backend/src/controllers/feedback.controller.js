import { Feedback } from "../models/feedback.model.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const createFeedback = asyncHandler(async (req, res) => {
  const { name, email, problemType, problemDescription, suggestion, rating, attachScreenshot } = req.body;

  if (!name || !email || !problemType || !problemDescription) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const doc = await Feedback.create({
    name,
    email,
    problemType,
    problemDescription,
    suggestion,
    rating,
    attachScreenshot,
  });

  return res.status(201).json({ success: true, id: doc._id });
});

export const listFeedback = asyncHandler(async (req, res) => {
  const { pwd } = req.query;
  if (pwd !== "3idiots") return res.status(401).json({ message: "Unauthorized" });

  const items = await Feedback.find({}).sort({ createdAt: -1 }).lean();
  return res.status(200).json(items);
});

export const getFeedback = asyncHandler(async (req, res) => {
  const { pwd } = req.query;
  if (pwd !== "3idiots") return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  const doc = await Feedback.findById(id).lean();
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.status(200).json(doc);
});

export const markViewed = asyncHandler(async (req, res) => {
  const { pwd } = req.query;
  if (pwd !== "3idiots") return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  const doc = await Feedback.findByIdAndUpdate(id, { viewed: true }, { new: true }).lean();
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.status(200).json({ success: true });
});


