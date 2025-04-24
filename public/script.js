document.getElementById("submitCode").addEventListener("click", async () => {
  const code = document.getElementById("codeInput").value;
  if (!code.trim()) {
    alert("Please enter JavaScript code.");
    return;
  }

  // Clear old output
  console.clear();
  document.getElementById("carbonEmissions").textContent = "Calculating...";
  document.getElementById("energyUsed").textContent = "Calculating...";
  document.getElementById("executionTime").textContent = "Running...";
  document.getElementById("feedbackList").innerHTML = "";
  document.querySelectorAll("#dynamicOutput").forEach(el => el.remove());

  let executionTime = 0;
  try {
    const startTime = performance.now();

    const outputDiv = document.createElement("div");
    outputDiv.id = "dynamicOutput";
    document.body.appendChild(outputDiv);

    const script = document.createElement("script");
    script.textContent = code;
    outputDiv.appendChild(script);

    const endTime = performance.now();
    executionTime = (endTime - startTime).toFixed(4);
  } catch (error) {
    alert("Error executing code: " + error.message);
    return;
  }

  try {
    const response = await fetch("/analyse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        codeSize: new Blob([code]).size,
        executionTime: parseFloat(executionTime)
      }),
    });

    const result = await response.json();

    document.getElementById("carbonEmissions").textContent = `${result.carbonEmissions.toFixed(4)} g CO₂`;
    document.getElementById("energyUsed").textContent = `${result.energyUsed.toFixed(4)} kWh`;
    document.getElementById("executionTime").textContent = `${executionTime} ms`;

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
