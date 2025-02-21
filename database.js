import Database from "better-sqlite3";

//Creating database
// const -- assigned value don't change.
// let -- local or global variable. assigned value can be changed.
// var -- local variable.

const db = new Database('students.db');

// Create table in students.db
db.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        course TEXT NOT NULL,
        studentMark INTEGER NOT NULL,
        studentType TEXT NOT NULL
    )
`);

// Prepare Insert Statement
const insert = db.prepare("INSERT INTO students (firstname, lastname, course, studentMark, studentType) VALUES (?, ?, ?, ?, ?)");

// Insert sample records (if table is empty)
const studentExists = db.prepare("SELECT COUNT(*) AS count FROM students").get();
if (studentExists.count === 0) {
    insert.run("Sihan", "ABC", "Comp. Sci", 85, "Undergraduate");
    insert.run("John", "Doe", "Mathematics", 90, "Masters");
    console.log("Sample records inserted!");
}

console.log("Database created!!!");

export default db;

