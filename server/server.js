const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { analyseCode } = require("./feedback");  // Import feedback analysis function

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public folder

// Serve the index.html when visiting the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Route to analyse code
app.post("/analyse", (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Code is required." });
    }

    const analysis = analyseCode(code);
    res.json(analysis);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
