// Utility function to analyse JavaScript code for sustainability
function analyseCode(code) {
    let energyUsed = 0; // Energy used (in kWh)
    let carbonEmissions = 0; // Carbon emissions (in kg CO2)
    const feedback = [];

    // 1. Calculate baseline energy usage based on length of code
    // We estimate baseline energy based on the length of the code and the number of functions and loops
    const codeLength = code.length; // Total number of characters in the code
    const functionCalls = (code.match(/\w+\s*\(.*\)/g) || []).length; // Count function calls
    const loops = (code.match(/for\s*\(.*\)\s*{/) || []).length; // Count loops

    // Baseline energy estimation based on the length of the code and number of operations
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
        feedback.push("Avoid using global variables (e.g., window object), as they can lead to memory leaks and increased memory consumption.");
        energyUsed += globalVars * 0.005; // Energy used for global variables
    }

    // 4. Check for inefficient loop usage
    if (loops > 0) {
        feedback.push("Optimise loops by reducing unnecessary iterations to decrease CPU cycles and improve energy efficiency.");
        energyUsed += loops * 0.02; // Energy used by loops
    }

    /// 5. Identify unnecessary function calls (e.g., empty function calls or function calls that don't perform useful operations)
    const functionCallsList = (code.match(/\w+\s*\(.*\)/g) || []);
    functionCallsList.forEach(call => {
        // Check for function calls with empty parentheses and no meaningful operation inside the function
        if (call.includes('()') && !call.includes('console.log') && !call.includes('alert') && !call.includes('debugger')) {
            feedback.push(`Remove redundant function calls like '${call}' to avoid unnecessary overhead.`);
            energyUsed += 0.004; // Energy used by redundant function calls
        }
    });


    // 6. Synchronous operations in loops (performance bottlenecks)
    if (/for\s*\(.*\)\s*\{.*setTimeout/.test(code)) {
        feedback.push("Avoid using synchronous operations like 'setTimeout' inside loops, as they can block execution and consume more energy.");
        energyUsed += 0.03; // Energy cost for inefficient loops
    }

    // 7. Check for console.log statements (debugging, unnecessary computation)
    const consoleLogs = (code.match(/console\.log/g) || []).length;
    if (consoleLogs > 0) {
        feedback.push("Remove debugging statements like 'console.log' to reduce unnecessary computation.");
        energyUsed += consoleLogs * 0.005; // Energy used by console logs
    }

    // 8. Inefficient array operations (using 'for' instead of 'forEach')
    const inefficientLoops = (code.match(/for\s*\(.*\)\s*\{.*\[\w+\]\.push\(/g) || []).length;
    if (inefficientLoops > 0) {
        feedback.push("Use 'forEach' instead of 'for' loops with 'push()' to optimise array operations.");
        energyUsed += inefficientLoops * 0.02; // Energy for inefficient loops
    }

    // 9. Memory management feedback (uncleaned references)
    if (/=\s*null\s*;/.test(code)) {
        feedback.push("Clean up unused objects or variables to allow garbage collection.");
        energyUsed += 0.008; // Energy for memory management
    }

    // 10. Inline event handlers (inefficient DOM manipulation)
    if (/<\w+\s+[a-zA-Z]+\s*=\s*['"][a-zA-Z]+\(['"]/.test(code)) {
        feedback.push("Avoid inline event handlers to reduce inefficient DOM manipulation.");
        energyUsed += 0.012; // Energy for inefficient DOM handling
    }

    // 11. Use of setInterval for repeated actions
    if (/setInterval/.test(code)) {
        feedback.push("Avoid using 'setInterval' unless necessary. It can result in excessive CPU usage.");
        energyUsed += 0.015; // Energy for setInterval usage
    }

    // 12. Inefficient string concatenation
    if (/(\w+\s*)\+\s*(\w+)/.test(code)) {
        feedback.push("Use 'Array.join()' for better performance instead of string concatenation.");
        energyUsed += 0.01; // Energy for inefficient string operations
    }

    // 13. Unnecessary DOM manipulations
    if (/<\w+.*>/g.test(code)) {
        feedback.push("Minimise unnecessary DOM manipulations to reduce performance impact.");
        energyUsed += 0.025; // Energy for excessive DOM operations
    }

    // Calculate carbon emissions based on energy used (example conversion: 1 kWh = 0.5 kg CO2)
    carbonEmissions = energyUsed * 0.5;

    // 14. No inefficiencies found
    if (!feedback.length) {
        feedback.push("No major inefficiencies detected. Great job!");
    }

    // Return a more detailed analysis with calculated energy usage and carbon emissions
    return { energyUsed, carbonEmissions, feedback };
}

// Export the analysis function to be used in other files
module.exports = { analyseCode };
