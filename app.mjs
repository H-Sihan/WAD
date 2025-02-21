// app.mjs - use .mjs extension as ECMAScript 6 modules are used

import express from 'express';
import Database from 'better-sqlite3';

//import db from './database';

const app = express();
const db = new Database ('students.db')

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

app.listen(3000);