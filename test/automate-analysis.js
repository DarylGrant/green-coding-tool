const axios = require("axios");
const { performance } = require("perf_hooks");

// JavaScript code to be tested
const testCode = `
function computeFibonacci(n) {
  const memo = [0, 1];
  for (let i = 2; i <= n; i++) {
    memo[i] = memo[i - 1] + memo[i - 2];
  }
  return memo[n];
}

function generateLargeArray(size) {
  return Array.from({ length: size }, () => Math.random() * 100000);
}

function sortAndProcessArray(arr) {
  const sorted = Float64Array.from(arr).sort((a, b) => a - b);
  const processed = [];
  for (let i = 0; i < sorted.length; i++) {
    processed.push(Math.log1p(sorted[i]) * Math.sin(i));
  }
  return processed;
}

function generatePrimes(limit) {
  const sieve = new Array(limit).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i < limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j < limit; j += i) {
        sieve[j] = false;
      }
    }
  }
  return sieve.reduce((primes, isPrime, i) => {
    if (isPrime) primes.push(i);
    return primes;
  }, []);
}

function deepObjectOperation(depth, width) {
  const buildObject = () => {
    let obj = { value: Math.random() };
    for (let d = 0; d < depth; d++) {
      const newObj = {};
      for (let i = 0; i < width; i++) {
        newObj["key_" + i] = obj;
      }
      obj = newObj;
    }
    return obj;
  };
  return JSON.stringify(buildObject());
}

function cpuIntensiveTask() {
  console.time("CPU Intensive Task");

  const fib = computeFibonacci(25);
  const primes = generatePrimes(10000);
  const largeArray = generateLargeArray(50000);
  const processedArray = sortAndProcessArray(largeArray);
  const deepObject = deepObjectOperation(5, 4);

  console.log("Fibonacci Result:", fib);
  console.log("Number of Primes Found:", primes.length);
  console.log("Processed Array Sample:", processedArray.slice(0, 5));
  console.log("Deep Object Size (chars):", deepObject.length);

  console.timeEnd("CPU Intensive Task");
  return "Heavy computation completed.";
}

cpuIntensiveTask();





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
