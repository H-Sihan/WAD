import Database from 'better-sqlite3';

// Create a new SQLite database file (or open an existing one)
const db = new Database('students.db');

// Create a table for students if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        course TEXT NOT NULL
    )
`);

const insert = db.prepare("INSERT INTO students (firstname, lastname, course) VALUES (?, ?, ?)");
insert.run("John", "Smith", "Software Engineering");
insert.run("Jane", "Smith", "Data Science");

console.log("Database and students table initialized successfully.");

export default db;
