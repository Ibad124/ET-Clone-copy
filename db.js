const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = "mongodb+srv://emily:0505Maor2005@et-clone.ivjgopf.mongodb.net/?retryWrites=true&w=majority&appName=ET-Clone";
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db("bankDB"); // Replace "bankDB" with your desired database name
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        throw err;
    }
}

function getDb() {
    if (!db) {
        throw new Error("Database not initialized. Call connectToDatabase first.");
    }
    return db;
}

module.exports = { connectToDatabase, getDb };
