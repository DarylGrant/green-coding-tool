const axios = require("axios");
const { performance } = require("perf_hooks");

// JavaScript code to be tested
const testCode = `
function storeUserData(name) {
  const userName = name;
  return "User data stored locally.";
}




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

async function runAnalysisMultipleTimes() {
  let totalEnergy = 0;
  let totalCarbon = 0;
  let totalExecutionTime = 0;

  for (let i = 0; i < RUN_COUNT; i++) {
    const executionTime = measureExecutionTime(testCode);

    try {
      const response = await axios.post(ANALYSIS_URL, {
        code: testCode,
        executionTime,
      });

      const { energyUsed, carbonEmissions } = response.data;

      totalEnergy += energyUsed;
      totalCarbon += carbonEmissions;
      totalExecutionTime += executionTime;
    } catch (error) {
      console.error(`Error during run ${i + 1}:`, error.message);
    }
  }

  // Calculate averages
  const avgEnergy = totalEnergy / RUN_COUNT;
  const avgCarbon = totalCarbon / RUN_COUNT;
  const avgExecutionTime = totalExecutionTime / RUN_COUNT;

  // Output the average results
  console.log("=== AVERAGE RESULTS AFTER 100 RUNS ===");
  console.log(`Average Energy Used: ${avgEnergy.toFixed(4)} mWh`);
  console.log(`Average Carbon Emissions: ${avgCarbon.toFixed(4)} mg CO₂`);
  console.log(`Average Execution Time: ${avgExecutionTime.toFixed(4)} ms`);
}

runAnalysisMultipleTimes();
