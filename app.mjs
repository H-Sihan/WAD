// app.mjs - use .mjs extension as ECMAScript 6 modules are used

import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';

//import db from './database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const db = new Database ('students.db')
//const db = new Database ("wadsongs.db")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files (HTML)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

/*app.post('/student/create', (req, res) => {
    try {
        const stmt = db.prepare("INSERT INTO students (firstname, lastname, course) VALUES(?, ?, ?)");
        const info = stmt.run(req.body.firstname, req.body.lastname, req.body.course);
        res.json({id: info.lastInsertRowid});
    } catch(error) {
        console.log(error); 
        res.status(500).json({ error: error });
    }
});*/

// Create Student (POST)
app.post('/student/create', (req, res) => {
    const { firstname, lastname, course, studentMark, studentType } = req.body;
    if (!firstname || !lastname || !course || !studentMark || !studentType) {
        return res.status(400).send('All fields are required!');
    }

    const stmt = db.prepare('INSERT INTO students (firstname, lastname, course, studentMark, studentType) VALUES (?, ?, ?, ?, ?)');
    stmt.run(firstname, lastname, course, studentMark, studentType);

    res.redirect('/');
});

// Find a song by ID (GET)
app.get('/student/:id', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM students WHERE id = ?");
        const result = stmt.get(req.params.id);  // `get()` returns a single row
        res.json(result || { message: "Song not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/student/:id', (req, res) =>{
    try {
        const stmt = db.prepare('UPDATE students SET firstname= ?, lastname= ?, course= ? WHERE id=?');
        const info = stmt.run(req.body.firstname, req.body.lastname, req.body.course, req.params.id);
        if(info.changes == 1) {
            res.status(200).json({success: true});
        } else {
            res.status(404).json({error: "Could not find student with that ID."});
        }
    } catch(error) {
        res.status(500).json({error: error});
    }
});

app.delete('/student/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM students WHERE id=?');
        const info = stmt.run(req.params.id);
        if(info.changes == 1) {
            res.json({success:1});
        } else {
            res.status(404).json({error: 'No product with that ID'});
        }
    } catch(error) {
        res.status(500).json({ error: error });
    }
});

app.listen(3000);