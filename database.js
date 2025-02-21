import Database from "better-sqlite3";

//Creating database
// const -- assigned value don't change.
// let -- local or global variable. assigned value can be changed.
// var -- local variable.

const db = new Database('students.db');

// SQL for database
db.exec("CREATE TABLE IF NOT EXISTS students ( stu_id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT NOT NULL, lastname TEXT NOT NULL, course TEXT NOT NULL)");

// Insert records
const insert = db.prepare("INSERT INTO students (firstname, lastname, course) VALUES (?,?,?)");
insert.run("Sihan","ABC","Comp. Sci");
insert.run("Sihan","Sci","Comp. Sci");

console.log("Database created!!!");

export default db;

