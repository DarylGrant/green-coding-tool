const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { analyseCode } = require("./feedback");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/analyse", (req, res) => {
  const { code, executionTime, codeSize } = req.body; // Receive codeSize
  if (!code) {
    return res.status(400).json({ error: "Code is required." });
  }

  const result = analyseCode(code, executionTime, codeSize); // Pass codeSize
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});