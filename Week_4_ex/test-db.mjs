import Database from 'better-sqlite3';

const db = new Database('wadsongs.db'); // Use the actual path!

try {
    const result = db.prepare("SELECT * FROM wadsongs LIMIT 5").all();
    console.log("✅ Database connected successfully! Sample data:", result);
} catch (error) {
    console.error("❌ Database connection error:", error.message);
}
