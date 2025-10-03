import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    // Numeric sequential id can be added via a plugin; for now ObjectId suffices
    roomId: { type: String, required: true, unique: true },
    isBotGame: { type: Boolean, default: false },

    // Variant of chess being played (Hidden Queen, Poisoned Pawn, Mini-King, etc.)
    variantType: {
      type: String,
      enum: ["HQ", "PP", "MK", "PHANTOM", "FB", "CLASSIC"],
      required: true,
    },

    // Player references (optional for anonymous games)
    whiteUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    blackUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    whiteUsername: { type: String },
    blackUsername: { type: String },

    // Array of SAN/lan moves or FEN snapshots
    moves: { type: [String], default: [] },

    // Outcome metadata
    result: { type: String, enum: ["white", "black", "draw"], default: null },
    resultType: { type: String }, // e.g. "king capture", "checkmate", "timeout" ...

    // Variant-specific squares / pieces (nullable when not applicable)
    whitehq: { type: String, default: null }, // Hidden queen square for white
    blackhq: { type: String, default: null },
    whitepp: { type: String, default: null }, // Poisoned pawn square for white
    blackpp: { type: String, default: null },
    whitemk: { type: String, default: null }, // Mini-king square for white
    blackmk: { type: String, default: null },
  },
  { timestamps: true }
);

export const Game = mongoose.model("Game", gameSchema);
