function analyseCode(code, executionTime = 0) {
  // Estimate base CPU energy usage
  const cpuPowerWatts = 50; // in watts
  const cpuPowerKilowatts = cpuPowerWatts / 1000; // convert to kW
  const executionTimeHours = executionTime / (1000 * 3600); // convert ms to hours
  const energyUsedKWh = cpuPowerKilowatts * executionTimeHours;

  const carbonIntensity = 207.05; // g CO₂ per kWh
  const feedback = [];

  // 1. Check for 'var' usage
  const varUsage = (code.match(/var\s+\w+\s*=/g) || []).length;
  if (varUsage > 0) {
    feedback.push("Consider replacing 'var' with 'let' or 'const' to improve memory management and avoid unintended global variables.");
  }

  // 2. Check for global variables
const globalVars = (code.match(/(?:window|global)\.\w+\s*=/g) || []).length;
if (globalVars > 0) {
  feedback.push("Avoid using global variables, as they can lead to memory leaks and increased memory consumption.");
}


  // 3. Large loops check
  const loopMatches = code.match(/for\s*\(.*;.*<\s*(\d+);.*\)\s*\{/g) || [];
  const largeLoops = loopMatches.map(loop => {
    const match = loop.match(/for\s*\(.*;.*<\s*(\d+);.*\)\s*\{/);
    return match ? parseInt(match[1], 10) : 0;
  }).filter(iterations => iterations > 50);
  if (largeLoops.length > 0) {
    feedback.push("Optimise loops by reducing unnecessary iterations to decrease CPU cycles and improve energy efficiency.");
  }

  // 4. Nested loops check
  const nestedLoops = (code.match(/for\s*\(.*\)\s*\{[^{}]*for\s*\(.*\)\s*\{/g) || []).length;
  if (nestedLoops > 0) {
    feedback.push("Nested loops detected, which may lead to performance bottlenecks. Consider optimising.");
  }

  // 5. Synchronous ops in loops
  if (/for\s*\(.*\)\s*\{[^]*?setTimeout\s*\(/
  .test(code)) {
    feedback.push("Avoid using synchronous operations like 'setTimeout' inside loops, as they can block execution and consume more energy.");
  }

  // 6. Memory management
  if (/=\s*null\s*;/.test(code)) {
    feedback.push("Clean up unused objects or variables to allow garbage collection.");
  }

  // 7. Inline event handlers
  if (/<\w+[^>]*\s+on\w+\s*=\s*["'][^"']*["']/i.test(code)) {
    feedback.push("Avoid inline event handlers to reduce inefficient DOM manipulation.");
  }

  // 8. Use of setInterval
  if (/setInterval/.test(code)) {
    feedback.push("Avoid using 'setInterval' unless necessary. It can result in excessive CPU usage.");
  }

  // If no inefficiencies are detected, give positive feedback
  if (feedback.length === 0) {
    feedback.push("Great job! Your code appears efficient and low in emissions.");
  }

  const carbonEmissionsGrams = energyUsedKWh * carbonIntensity;
  const energyUsedmWh = energyUsedKWh * 1_000_000; // milliwatt-hours
  const carbonEmissionsMg = carbonEmissionsGrams * 1_000; // milligrams CO₂

  return {
    energyUsed: energyUsedmWh,
    carbonEmissions: carbonEmissionsMg,
    feedback,
  };
}

module.exports = { analyseCode };