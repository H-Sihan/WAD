// app.mjs - use .mjs extension as ECMAScript 6 modules are used

/*
    POST /songs/create
    PUT /songs/update/:id
    DELETE /songs/delete/:id
    POST /songs/buy/:id
    GET /songs
    GET /songs/artist/:artist_id
    GET /artists
    GET /users
*/

import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors'

const app = express();
app.use(express.urlencoded({ extended: true })); // For form-urlencoded data
app.use(cors());
const db = new Database ("wadsongs.db")
app.use(express.json());

app.get('/', (req,res)=> {
    res.send('Hello World from Express!');
});

app.get('/time', (req, res) => {
    res.send(`There have been ${Date.now()} milliseconds since 1/1/70.`);
});

//POST /songs/create
app.post('/songs/create', (req, res) => {
    try {
        // Debugging: Log request body to check received data
        //console.log("Received data:", req.body);

        // Insert data into database
        const stmt = db.prepare("INSERT INTO wadsongs (title, artist, year, downloads, price, quantity) VALUES(?, ?, ?, ?, ?, ?)");
        const info = stmt.run(req.body.title, req.body.artist, req.body.year, req.body.downloads, req.body.price, req.body.quantity);
        
        res.json({ id: info.lastInsertRowid });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: error.message });
    }
});

//PUT /songs/update/:id
app.put('/songs/update/:id', (req, res) => {
    try {
        const stmt = db.prepare("UPDATE wadsongs SET price = ?, quantity = ? WHERE id = ?");
        const info = stmt.run(req.body.price, req.body.quantity, req.params.id);

        if (info.changes === 0) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json({ message: "Song updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//DELETE /songs/delete/:id
app.delete('/songs/delete/:id', (req, res) => {
    try {
        const stmt = db.prepare("DELETE FROM wadsongs WHERE id = ?");
        const info = stmt.run(req.params.id);

        if (info.changes === 0) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//POST /songs/buy/:id
app.post('/songs/buy/:id', (req, res) => {
    try {
        const { quantity } = req.body; // Get quantity from request body
        const song = db.prepare("SELECT quantity FROM wadsongs WHERE id = ?").get(req.params.id);
        
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity requested" });
        }
        if (song.quantity < quantity) {
            return res.status(400).json({ error: "Not enough quantity available" });
        }

        // Reduce stock by requested quantity
        db.prepare("UPDATE wadsongs SET quantity = quantity - ? WHERE id = ?").run(quantity, req.params.id);

        // Insert order with correct quantity
        const stmt = db.prepare("INSERT INTO orders (song_id, quantity_purchased) VALUES(?, ?)");
        const info = stmt.run(req.params.id, quantity);

        res.json({ message: "Song purchased successfully", order_id: info.lastInsertRowid, quantity_purchased: quantity });
    } catch (error) {
        console.error("Purchase error:", error);
        res.status(500).json({ error: error.message });
    }
});

//1248
//GET /songs/artist/:artist_id
app.get('/songs/artist/:artist_id', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM wadsongs WHERE id = ?");
        const songs = stmt.all(req.params.artist_id);
        res.json(songs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//GET /artists
app.get('/songs/artists', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM artists");
        const artists = stmt.all();
        res.json(artists);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(3001);