// Handle click event and validate input
document.getElementById("submitCode").addEventListener("click", async () => {
  const code = document.getElementById("codeInput").value;
  if (!code.trim()) {
    alert("Please enter JavaScript code.");
    return;
  }

  // Reset UI and clear previous outputs
  console.clear();
  document.getElementById("carbonEmissions").textContent = "Calculating...";
  document.getElementById("energyUsed").textContent = "Calculating...";
  document.getElementById("executionTime").textContent = "Running...";
  document.getElementById("feedbackList").innerHTML = "";
  document.querySelectorAll("#dynamicOutput").forEach(el => el.remove());

  let executionTime = 0;

  // Execute user code and measure time
  try {
    const startTime = performance.now();

    const outputDiv = document.createElement("div");
    outputDiv.id = "dynamicOutput";
    document.body.appendChild(outputDiv);

    const script = document.createElement("script");
    script.textContent = code;
    outputDiv.appendChild(script);

    const endTime = performance.now();
    executionTime = (endTime - startTime).toFixed(8);
  } catch (error) {
    alert("Error executing code: " + error.message);
    return;
  }

  // Send code and time to backend, then handle response
  try {
    const response = await fetch("/analyse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        executionTime: parseFloat(executionTime)
      }),
    });

    const result = await response.json();

    document.getElementById("carbonEmissions").textContent = `${result.carbonEmissions.toFixed(4)} mg CO₂`;
    document.getElementById("energyUsed").textContent = `${result.energyUsed.toFixed(4)} mWh`;
    document.getElementById("executionTime").textContent = `${parseFloat(executionTime).toFixed(2)} ms`;

    const feedbackList = document.getElementById("feedbackList");
    result.feedback.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      feedbackList.appendChild(li);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while analysing the code.");
  }
});
