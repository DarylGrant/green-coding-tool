const { co2 } = require("@tgwf/co2");
const oneByteModel = new co2({ model: "1byte" });

function analyseCode(code, executionTime = 0) {
  const codeByteSize = Buffer.byteLength(code, "utf8");
  let carbonEmissions = oneByteModel.perByte(codeByteSize);

  // Include execution time weight: 0.005g CO₂ per ms (example estimate)
  carbonEmissions += executionTime * 0.005;

  // Convert to energy used in mWh: 1 kWh = 207.05 g CO₂ based on UK Government 2024 conversion factor
  const energyUsedmWh = (carbonEmissions / 207.05) * 1000 * 1000;

  const feedback = [];

  // 1. Check for 'var' usage
  const varUsage = (code.match(/var\s+\w+\s*=/g) || []).length;
  if (varUsage > 0) {
    feedback.push("Consider replacing 'var' with 'let' or 'const' to improve memory management and avoid unintended global variables.");
  }

  // 2. Check for global variables
  const globalVars = (code.match(/window\.\w+\s*=/g) || []).length;
  if (globalVars > 0) {
    feedback.push("Avoid using global variables, as they can lead to memory leaks and increased memory consumption.");
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
    } else {
      const nestedLoops = (code.match(/for\s*\(.*\)\s*\{[^{}]*for\s*\(.*\)\s*\{/g) || []).length;
      if (nestedLoops > 0) {
        feedback.push("Nested loops detected, which may lead to performance bottlenecks. Consider optimising.");
      }
    }
  }

  // 4. Synchronous ops in loops
  if (/for\s*\(.*\)\s*\{[^{}]*setTimeout\s*\(/.test(code)) {
    feedback.push("Avoid using synchronous operations like 'setTimeout' inside loops, as they can block execution and consume more energy.");
  }

  // 5. Memory management
  if (/=\s*null\s*;/.test(code)) {
    feedback.push("Clean up unused objects or variables to allow garbage collection.");
  }

  // 6. Inline event handlers
  if (/<\w+\s+[a-zA-Z]+\s*=\s*['"][a-zA-Z]+\(['"]/.test(code)) {
    feedback.push("Avoid inline event handlers to reduce inefficient DOM manipulation.");
  }

  // 7. Use of setInterval
  if (/setInterval/.test(code)) {
    feedback.push("Avoid using 'setInterval' unless necessary. It can result in excessive CPU usage.");
  }

  if (feedback.length === 0) {
    feedback.push("Great job! Your code appears efficient and low in emissions.");
  }

  return {
    codeByteSize,
    energyUsed: energyUsedmWh,      
    carbonEmissions,               
    feedback,
  };
}

module.exports = { analyseCode };