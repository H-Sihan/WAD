import express from "express";
import Database from "better-sqlite3";
import cors from "cors";

const app = express();
const PORT = 3000;

// Enable CORS to allow requests from Vite frontend
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Connect to SQLite database using better-sqlite3
const db = new Database("wadsongs.db");

// Route to fetch all artists
app.get("/artists", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM artists").all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to fetch an artist’s hometown
app.get("/hometown/:artist", (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM artists WHERE name = ?");
        const row = stmt.get(req.params.artist);

        if (!row) {
            return res.status(404).json({ error: "Artist not found" });
        }
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to add a new hometown
app.post("/addHometown", (req, res) => {
    const { name, lat, lon, hometown } = req.body;

    try {
        const stmt = db.prepare(
            "INSERT INTO artists (name, lat, lon, hometown) VALUES (?, ?, ?, ?)"
        );
        const result = stmt.run(name, lat, lon, hometown);

        res.json({ id: result.lastInsertRowid, name, lat, lon, hometown });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
