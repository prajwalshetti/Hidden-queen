import { asyncHandler } from "../utils/asynchandler.js";
import { getBestMoveFromStockfish } from "../utils/stockfish.js";

// POST /api/v1/bot/move
// body: { fen: string, difficulty?: number, depth?: number, movetime?: number }
export const getBotMove = asyncHandler(async (req, res) => {
  const { fen, difficulty, depth, movetime } = req.body || {};
  if (!fen || typeof fen !== "string") {
    return res.status(400).json({ message: "fen is required" });
  }
  const result = await getBestMoveFromStockfish({ fen, difficulty, depth, movetime });
  return res.status(200).json({ success: true, ...result });
});


