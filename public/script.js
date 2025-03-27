document.getElementById("submitCode").addEventListener("click", async () => {
    const code = document.getElementById("codeInput").value;
    if (!code.trim()) {
        alert("Please enter JavaScript code.");
        return;
    }

    // Clear previous output
    console.clear();
    document.getElementById("energyUsed").textContent = "N/A";
    document.getElementById("carbonEmissions").textContent = "N/A";
    document.getElementById("executionTime").textContent = "N/A";
    document.getElementById("feedbackList").innerHTML = "";

    // Remove all dynamically added elements from previous executions
    document.querySelectorAll("#dynamicOutput").forEach(el => el.remove());

    let executionTime;
    try {
        const startTime = performance.now(); // Start timer
        
        // Create a safe sandbox for script execution
        const outputDiv = document.createElement("div");
        outputDiv.id = "dynamicOutput";
        document.body.appendChild(outputDiv);
        
        const script = document.createElement("script");
        script.textContent = code;
        outputDiv.appendChild(script);
        
        const endTime = performance.now(); // End timer
        executionTime = (endTime - startTime).toFixed(4); // Calculate execution time in milliseconds
    } catch (error) {
        alert("Error in executing code: " + error.message);
        return;
    }

    try {
        const response = await fetch("/analyse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, executionTime }),
        });

        const result = await response.json();
        document.getElementById("energyUsed").textContent = `${result.energyUsed.toFixed(4)} kWh`;
        document.getElementById("carbonEmissions").textContent = `${result.carbonEmissions.toFixed(4)} kg CO2`;
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
