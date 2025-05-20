// === HitTastic! Secure Server Example ===
// Express.js app with both vulnerable and secured routes

import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import xss from 'xss';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize in-memory DB with vulnerable data
db.serialize(() => {
  db.run("CREATE TABLE ht_users (username TEXT, password TEXT)");
  db.run("INSERT INTO ht_users VALUES ('JohnStevenson', 'abc123')");
  db.run("INSERT INTO ht_users VALUES ('admin', 'adminpass')");
});

// npm install express sqlite3 body-parser express-session xss

// Home page
app.get('/', (req, res) => {
  res.send(`
    <h1>HitTastic Login</h1>
    <form method="post" action="/login">
      Username: <input name="username" /><br />
      Password: <input type="password" name="password" /><br />
      <input type="submit" value="Login" />
    </form>
  `);
});

// Vulnerable login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM ht_users WHERE password='${password}' AND username='${username}'`;
  db.get(query, [], (err, row) => {
    if (row) {
      req.session.user = row.username;
      res.send(`<h2>Welcome ${row.username}!</h2>`);
    } else {
      res.send('<h2>Login failed</h2>');
    }
  });
});

// Secured login route (mitigated against SQLi)
app.post('/secure-login', (req, res) => {
  const { username, password } = req.body;
  const stmt = db.prepare("SELECT * FROM ht_users WHERE username = ? AND password = ?");
  stmt.get([username, password], (err, row) => {
    if (row) {
      req.session.user = row.username;
      res.send(`<h2>Welcome (secure) ${row.username}!</h2>`);
    } else {
      res.send('<h2>Secure Login failed</h2>');
    }
  });
});

// XSS vulnerable route
app.post('/buy', (req, res) => {
  const id = req.body.id;
  res.send(`You are buying the song with ID ${id}`); // Vulnerable to XSS
});

// XSS protected route
app.post('/secure-buy', (req, res) => {
  const id = xss(req.body.id);
  res.send(`You are securely buying the song with ID ${id}`);
});

app.listen(3000, () => {
  console.log('HitTastic app running on http://localhost:3000');
});
