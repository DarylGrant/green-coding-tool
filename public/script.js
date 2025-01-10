document.getElementById("submitCode").addEventListener("click", async () => {
    const code = document.getElementById("codeInput").value;

    if (!code.trim()) {
        alert("Please enter JavaScript code.");
        return;
    }

    try {
        const response = await fetch("/analyse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        });

        const result = await response.json();
        document.getElementById("energyUsed").textContent = `${result.energyUsed.toFixed(4)} kWh`;
        document.getElementById("carbonEmissions").textContent = `${result.carbonEmissions.toFixed(4)} kg CO2`;
        
        const feedbackList = document.getElementById("feedbackList");
        feedbackList.innerHTML = "";
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
