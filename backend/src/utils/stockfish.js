import { spawn } from "child_process";

/**
 * Run a single best-move search on Stockfish.
 * - Requires STOCKFISH_PATH env set to an executable (Windows .exe is fine locally)
 * - difficulty: 0-20 mapped to Skill Level; depth or movetime also supported
 */
export async function getBestMoveFromStockfish({ fen, difficulty = 10, depth, movetime }) {
  return new Promise((resolve, reject) => {
    const enginePath = process.env.STOCKFISH_PATH;
    if (!enginePath) return reject(new Error("STOCKFISH_PATH env not set"));

    const sf = spawn(enginePath, [], { stdio: ["pipe", "pipe", "pipe"] });

    let bestmove = null;
    let stderr = "";

    const send = (cmd) => {
      try { sf.stdin.write(cmd + "\n"); } catch {}
    };

    sf.stdout.on("data", (data) => {
      const text = data.toString();
      // console.log(text);
      const lines = text.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith("bestmove ")) {
          const parts = line.split(" ");
          bestmove = parts[1];
          // optional: ponder move = parts[3]
        }
      }
      if (bestmove) {
        try { sf.stdin.end(); } catch {}
        try { sf.kill(); } catch {}
        resolve({ bestmove });
      }
    });

    sf.stderr.on("data", (data) => { stderr += data.toString(); });
    sf.on("error", (err) => reject(err));
    sf.on("close", (code) => {
      if (!bestmove) return reject(new Error(stderr || `Stockfish exited with code ${code}`));
    });

    // UCI initialization
    send("uci");
    // skill level 0-20
    const skill = Math.max(0, Math.min(20, Number(difficulty)));
    send(`setoption name Skill Level value ${skill}`);
    send("ucinewgame");
    send("isready");
    send(`position fen ${fen}`);

    if (typeof depth === "number" && depth > 0) {
      send(`go depth ${depth}`);
    } else if (typeof movetime === "number" && movetime > 0) {
      send(`go movetime ${movetime}`);
    } else {
      // default: depth tuned by difficulty
      const mappedDepth = Math.max(6, Math.min(20, 4 + Math.floor(skill * 0.8)));
      send(`go depth ${mappedDepth}`);
    }
  });
}


