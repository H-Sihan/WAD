// app.mjs - use .mjs extension as ECMAScript 6 modules are used

import express from 'express';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('students.db');

app.use(express.json());

app.get('/', (req,res)=> {
    res.send('Hello World from Express!');
});

app.get('/time', (req, res) => {
    res.send(`There have been ${Date.now()} milliseconds since 1/1/25.`);
});

app.get('/students', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM students");
        const results = stmt.all();
        res.json(results);
    } catch(error) {
        console.log(error); 
        res.status(500).json({ error: error });
    }
});

// API Endpoint: Get Students by Last Name
app.get('/students/:lastname', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM students WHERE lastname = ?");
        const results = stmt.all(req.params.lastname);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
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