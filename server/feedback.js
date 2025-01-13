// Utility function to analyse JavaScript code for sustainability
function analyseCode(code) {
    let energyUsed = 0; // Energy used (in kWh)
    let carbonEmissions = 0; // Carbon emissions (in kg CO2)
    const feedback = [];

    // 1. Calculate baseline energy usage based on length of code
    const codeLength = code.length; // Total number of characters in the code
    const functionCalls = (code.match(/\w+\s*\(.*\)/g) || []).length; // Count function calls
    const loops = (code.match(/for\s*\(.*\)\s*{/) || []).length; // Count loops

    energyUsed += (codeLength / 1000) * 0.005; // Small baseline for code length
    energyUsed += functionCalls * 0.002; // Small energy for function calls
    energyUsed += loops * 0.01; // Small energy for loops

    // 2. Check for 'var' usage (reduce memory usage)
    const varUsage = (code.match(/var\s+\w+\s*=/g) || []).length;
    if (varUsage > 0) {
        feedback.push(`Consider replacing 'var' with 'let' or 'const' to improve memory management and avoid unintended global variables.`);
        energyUsed += varUsage * 0.003; // Energy used for var usage
    }

    // 3. Check for excessive global variables (memory leaks)
    const globalVars = (code.match(/window\.\w+\s*=/g) || []).length;
    if (globalVars > 0) {
        feedback.push("Avoid using global variables, as they can lead to memory leaks and increased memory consumption.");
        energyUsed += globalVars * 0.005; // Energy used for global variables
    }

    // 4. Check for inefficient loop usage
    if (loops > 0) {
        // 4.1 Large Loops: Adjust condition to check if the loop exceeds a threshold (e.g., more than 50 iterations)
        const largeLoops = (code.match(/for\s*\(.*;.*<\s*(\d+);.*\)\s*\{/) || []).map(loop => {
            const matches = loop.match(/for\s*\(.*;.*<\s*(\d+);.*\)\s*\{/);
            return matches ? parseInt(matches[1], 10) : 0;
        }).filter(iterations => iterations > 50);

        if (largeLoops.length > 0) {
            feedback.push("Optimise loops by reducing unnecessary iterations to decrease CPU cycles and improve energy efficiency.");
            energyUsed += largeLoops.length * 0.02; // Energy used by large loops
        } else {
            // 4.2 Nested loops: Detect nested loops
            const nestedLoops = (code.match(/for\s*\(.*\)\s*\{[^{}]*for\s*\(.*\)\s*\{/g) || []).length;
            if (nestedLoops > 0) {
                feedback.push("Nested loops detected, which may lead to performance bottlenecks. Consider optimising.");
                energyUsed += nestedLoops * 0.04; // Energy cost for nested loops
            }
        }
    }



    // 5. Synchronous operations in loops (performance bottlenecks)
    if (/for\s*\(.*\)\s*\{[^{}]*setTimeout\s*\(/.test(code)) {
        feedback.push("Avoid using synchronous operations like 'setTimeout' inside loops, as they can block execution and consume more energy.");
        energyUsed += 0.03; // Energy cost for inefficient loops
    }



    // 6. Memory management feedback (uncleaned references)
    if (/=\s*null\s*;/.test(code)) {
        feedback.push("Clean up unused objects or variables to allow garbage collection.");
        energyUsed += 0.008; // Energy for memory management
    }

    // 7. Inline event handlers (inefficient DOM manipulation)
    if (/<\w+\s+[a-zA-Z]+\s*=\s*['"][a-zA-Z]+\(['"]/.test(code)) {
        feedback.push("Avoid inline event handlers to reduce inefficient DOM manipulation.");
        energyUsed += 0.012; // Energy for inefficient DOM handling
    }

    // 8. Use of setInterval for repeated actions
    if (/setInterval/.test(code)) {
        feedback.push("Avoid using 'setInterval' unless necessary. It can result in excessive CPU usage.");
        energyUsed += 0.015; // Energy for setInterval usage
    }

    // 9. Unnecessary DOM manipulations
    if (/<\w+.*>/g.test(code)) {
        feedback.push("Minimise unnecessary DOM manipulations to reduce performance impact.");
        energyUsed += 0.025; // Energy for excessive DOM operations
    }

    // Calculate carbon emissions based on energy used (example conversion: 1 kWh = 0.5 kg CO2)
    carbonEmissions = energyUsed * 0.5;

    // 10. No inefficiencies found
    if (!feedback.length) {
        feedback.push("No major inefficiencies detected. Great job!");
    }

    // Return a more detailed analysis with calculated energy usage and carbon emissions
    return { energyUsed, carbonEmissions, feedback };
}

// Export the analysis function to be used in other files
module.exports = { analyseCode };
