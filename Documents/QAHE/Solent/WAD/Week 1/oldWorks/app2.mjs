import express from 'express';
import Database from 'better-sqlite3';

// Initialize Express app
const app = express();
const db = new Database('wadsongs.db');  // Connect to the SQLite database

// Middleware for JSON parsing
app.use(express.json());

// Route to return current time
app.get('/time', (req, res) => {
    const currentTime = new Date().toLocaleTimeString();
    res.json({ time: currentTime });
});

// Route to greet a user by name
app.get('/greet/:name', (req, res) => {
    res.json({ message: `Hello, ${req.params.name}!` });
});

// Search all songs by a given artist (GET)
app.get('/songs/artist/:artist', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM wadsongs WHERE artist = ?");
        const results = stmt.all(req.params.artist);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//http://localhost:3000/songs/artist/Adele

// Search all songs with a given title (GET)
app.get('/songs/title/:title', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM wadsongs WHERE title = ?");
        const results = stmt.all(req.params.title);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//http://localhost:3000/songs/title/Shape of You

// Search for songs by BOTH artist and title (GET)
app.get('/songs/search', (req, res) => {
    try {
        const { artist, title } = req.query;
        const stmt = db.prepare("SELECT * FROM wadsongs WHERE artist = ? AND title = ?");
        const results = stmt.all(artist, title);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//http://localhost:3000/songs/search?artist=Adele&title=Someone Like You

// Find a song by ID (GET)
app.get('/songs/:id', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM wadsongs WHERE id = ?");
        const result = stmt.get(req.params.id);  // `get()` returns a single row
        res.json(result || { message: "Song not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//http://localhost:3000/songs/1

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});