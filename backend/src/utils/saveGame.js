import { Game } from "../models/game.model.js";

/**
 * Persists a finished game to MongoDB.
 * @param {string} roomId - The room identifier used in Socket.IO.
 * @param {object} room - The in-memory room object holding game data.
 * @returns {Promise<object|null>} The created Game document or null if already saved / invalid.
 */
export const saveGameFromRoom = async (roomId, room) => {
  if (!room || !room.databaseinfo) return null;

  // Already persisted?
  if (room.databaseinfo.isSaved) return null;

  const db = room.databaseinfo;
  console.log(db);

  const payload = {
    roomId,
    isBotGame: roomId.startsWith("BOT_"),
    variantType: roomId.split("_").pop(),

    moves: db.moves || [],
    result: db.result,
    resultType: db.resulttype,
    whiteUserId: db.whiteuserid || undefined,
    blackUserId: db.blackuserid || undefined,
    whitehq: db.initialwhq,
    blackhq: db.initialbhq,
    whitepp: db.initialwpp,
    blackpp: db.initialbpp,
    whitemk: db.initialwmk,
    blackmk: db.initialbmk,

    whiteUsername: room.whiteUsername,
    blackUsername: room.blackUsername,
  };

  try {
    const doc = await Game.create(payload);
    room.databaseinfo.isSaved = true;
    return doc;
  } catch (err) {
    console.error("Error saving game for room", roomId, err);
    throw err;
  }
};
