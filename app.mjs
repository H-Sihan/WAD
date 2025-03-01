// app.mjs - use .mjs extension as ECMAScript 6 modules are used

import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

//import db from './database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Database ('students.db')
//const db = new Database ("wadsongs.db")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req,res)=> {
    res.send('Hello World from Express!');
});
// API HTTP VERBS

// -- GET, POST, DELETE, PUT (Upadeting ), PATCH (Partial modify the data)

// STATUS CODES
// -- 200 - OK / Request successful
// -- 201 - OK / STATUS OK
// -- 500 - Internal server error
// -- 503 - Unavailable
// -- 403 - Unauthorized or forbidden
// -- 404 - Not found
app.get('/time', (req, res) => {
    res.send(`There have been ${Date.now()} milliseconds since 1/1/70.`);
});

app.get('/students', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM students");
        const results = stmt.all();
        res.json(results);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({error:error});
    }
});

app.post('/student/create', (req, res) => {
    try {
        const stmt = db.prepare("INSERT INTO students (firstname, lastname, course) VALUES(?, ?, ?)");
        const info = stmt.run(req.body.firstname, req.body.lastname, req.body.course);
        res.json({id: info.lastInsertRowid});
    } catch(error) {
        console.log(error); 
        res.status(500).json({ error: error });
    }
});

app.get('/songs', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM wadsongs");
        const results = stmt.all();
        res.json(results);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({error:error});
    }
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

app.listen(3000);