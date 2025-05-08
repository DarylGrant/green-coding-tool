const axios = require("axios");

// Replace this with any JavaScript code you'd like to test
const testCode =
  `function countCharactersClean(str) {
    const result = {};
    for (const char of str) {
        result[char] = (result[char] || 0) + 1;
    }
    return result;
}

  


  
`;

const ANALYSIS_URL = "http://localhost:3000/analyse";
const RUN_COUNT = 100;

async function runAnalysisMultipleTimes() {
  let totalEnergy = 0;
  let totalCarbon = 0;
  let totalExecutionTime = 0;

  for (let i = 0; i < RUN_COUNT; i++) {
    const startTime = performance.now();

    try {
      const response = await axios.post(ANALYSIS_URL, {
        code: testCode,
        codeSize: new Blob([testCode]).size, // Send codeSize here
        executionTime: performance.now() - startTime,
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;

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