const axios = require("axios");
const { performance } = require("perf_hooks");

// JavaScript code to be tested
const testCode = `
let goodCode = '<button id="myButton">Click</button>' +
               '<script>' +
               'function doSomething() { alert("Hello"); }' +
               'document.getElementById("myButton").addEventListener("click", doSomething);' +
               '</script>';






`;



const ANALYSIS_URL = "http://localhost:3000/analyse";
const RUN_COUNT = 100;

// Function to measure execution time of the code
function measureExecutionTime(codeStr) {
  const start = performance.now();
  try {
    eval(codeStr);
  } catch (err) {
    console.error("Error executing test code:", err);
  }
  const end = performance.now();
  return end - start;
}

// Function to calculate standard deviation
function calculateStdDev(values, mean) {
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}

async function runAnalysisMultipleTimes() {
  const energyValues = [];
  const carbonValues = [];
  const executionTimes = [];

  for (let i = 0; i < RUN_COUNT; i++) {
    const executionTime = measureExecutionTime(testCode);

    try {
      const response = await axios.post(ANALYSIS_URL, {
        code: testCode,
        executionTime,
      });

      const { energyUsed, carbonEmissions } = response.data;

      energyValues.push(energyUsed);
      carbonValues.push(carbonEmissions);
      executionTimes.push(executionTime);
    } catch (error) {
      console.error(`Error during run ${i + 1}:`, error.message);
    }
  }

  // Calculate averages
  const avgEnergy = energyValues.reduce((a, b) => a + b, 0) / RUN_COUNT;
  const avgCarbon = carbonValues.reduce((a, b) => a + b, 0) / RUN_COUNT;
  const avgExecutionTime = executionTimes.reduce((a, b) => a + b, 0) / RUN_COUNT;

  // Calculate standard deviations
  const stdDevEnergy = calculateStdDev(energyValues, avgEnergy);
  const stdDevCarbon = calculateStdDev(carbonValues, avgCarbon);
  const stdDevExecution = calculateStdDev(executionTimes, avgExecutionTime);

  // Output the results
  console.log("=== AVERAGE RESULTS AFTER 100 RUNS ===");
  console.log(`Average Energy Used: ${avgEnergy.toFixed(4)} mWh (±${stdDevEnergy.toFixed(4)})`);
  console.log(`Average Carbon Emissions: ${avgCarbon.toFixed(4)} mg CO₂ (±${stdDevCarbon.toFixed(4)})`);
  console.log(`Average Execution Time: ${avgExecutionTime.toFixed(2)} ms (±${stdDevExecution.toFixed(2)})`);
}

runAnalysisMultipleTimes();
