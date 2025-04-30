function analyseCode(code, executionTime = 0) {
  // Estimate CPU energy usage based on execution time
  // Assumption: 0.5 watts average CPU power consumption
  const cpuPowerWatts = 0.5;
  
  // Convert execution time from milliseconds to seconds
  const executionTimeSeconds = executionTime / 1000;
  
  // Calculate initial energy used in kWh based on execution time
  let energyUsedKWh = (cpuPowerWatts * executionTimeSeconds) / 3600;

  // UK Government 2024 conversion factor: 207.05 g CO₂ per kWh
  const carbonIntensity = 207.05; // g CO₂ per kWh

  const feedback = [];
  
  // Small energy increment for each inefficiency (in kWh)
  const inefficiencyEnergyIncrement = 1e-8; // Small value in kWh

  // 1. Check for 'var' usage
  const varUsage = (code.match(/var\s+\w+\s*=/g) || []).length;
  if (varUsage > 0) {
    feedback.push("Consider replacing 'var' with 'let' or 'const' to improve memory management and avoid unintended global variables.");
    energyUsedKWh += inefficiencyEnergyIncrement;
  }

  // 2. Check for global variables
  const globalVars = (code.match(/window\.\w+\s*=/g) || []).length;
  if (globalVars > 0) {
    feedback.push("Avoid using global variables, as they can lead to memory leaks and increased memory consumption.");
    energyUsedKWh += inefficiencyEnergyIncrement;
  }

  // 3. Loop checks
  const loops = (code.match(/for\s*\(.*\)\s*{/g) || []).length;
  if (loops > 0) {
    const largeLoops = (code.match(/for\s*\(.*;.*<\s*(\d+);.*\)\s*\{/) || []).map(loop => {
      const matches = loop.match(/for\s*\(.*;.*<\s*(\d+);.*\)\s*\{/);
      return matches ? parseInt(matches[1], 10) : 0;
    }).filter(iterations => iterations > 50);

    if (largeLoops.length > 0) {
      feedback.push("Optimise loops by reducing unnecessary iterations to decrease CPU cycles and improve energy efficiency.");
      energyUsedKWh += inefficiencyEnergyIncrement;
    } else {
      const nestedLoops = (code.match(/for\s*\(.*\)\s*\{[^{}]*for\s*\(.*\)\s*\{/g) || []).length;
      if (nestedLoops > 0) {
        feedback.push("Nested loops detected, which may lead to performance bottlenecks. Consider optimising.");
        energyUsedKWh += inefficiencyEnergyIncrement;
      }
    }
  }

  // 4. Synchronous ops in loops
  if (/for\s*\(.*\)\s*\{[^{}]*setTimeout\s*\(/.test(code)) {
    feedback.push("Avoid using synchronous operations like 'setTimeout' inside loops, as they can block execution and consume more energy.");
    energyUsedKWh += inefficiencyEnergyIncrement;
  }

  // 5. Memory management
  if (/=\s*null\s*;/.test(code)) {
    feedback.push("Clean up unused objects or variables to allow garbage collection.");
    energyUsedKWh += inefficiencyEnergyIncrement;
  }

  // 6. Inline event handlers
  if (/<\w+\s+[a-zA-Z]+\s*=\s*['"][a-zA-Z]+\(['"]/.test(code)) {
    feedback.push("Avoid inline event handlers to reduce inefficient DOM manipulation.");
    energyUsedKWh += inefficiencyEnergyIncrement;
  }

  // 7. Use of setInterval
  if (/setInterval/.test(code)) {
    feedback.push("Avoid using 'setInterval' unless necessary. It can result in excessive CPU usage.");
    energyUsedKWh += inefficiencyEnergyIncrement;
  }

  // If no inefficiencies are detected, give positive feedback
  if (feedback.length === 0) {
    feedback.push("Great job! Your code appears efficient and low in emissions.");
  }

  // ** All energy calculations are done, now calculate carbon emissions **

  // Calculate carbon emissions based on final energy used in grams
  const executionCarbonEmissionsGrams = energyUsedKWh * carbonIntensity;
  
  // Convert grams to milligrams (mg)
  const executionCarbonEmissionsMg = executionCarbonEmissionsGrams * 1000;

  // Convert total energy used to mWh
  const energyUsedmWh = energyUsedKWh * 1e6;


  // Return the results, including feedback, carbon emissions, and energy used
  return {
    energyUsed: energyUsedmWh,
    carbonEmissions: executionCarbonEmissionsMg,
    feedback,
  };
}



module.exports = { analyseCode };
