const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { analyseCode } = require("./feedback");

// Create an instance of an Express app
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// Route for the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Endpoint to handle POST requests for code analysis
app.post("/analyse", (req, res) => {
  const { code, executionTime } = req.body;
  // Validate request body
  if (!code) {
    return res.status(400).json({ error: "Code is required." });
  }

  // Analyse the submitted code and return feedback
  const result = analyseCode(code, executionTime); 
  res.json(result);
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});