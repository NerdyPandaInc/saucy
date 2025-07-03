// Unlock the comic when user clicks "OKAY, BOOM"
document.getElementById("okayBoom").addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";
  document.getElementById("comic").classList.remove("hidden");
  document.body.style.overflow = "auto";
});

// Wait for the page to load before rendering the chart
window.addEventListener("load", () => {
  const chartCanvas = document.getElementById("tokenomicsChart");
  if (!chartCanvas) return; // Exit if chart section hasn't loaded yet

  const ctx = chartCanvas.getContext("2d");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "Circulating (1T)",
        "Locked Wallet 1 (100B)",
        "Locked Wallet 2 (100B)"
      ],
      datasets: [{
        data: [1000, 100, 100], // Represented in billions
        backgroundColor: ["#ffcc00", "#ff4444", "#44ff44"],
        borderColor: "#000",
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
            font: {
              family: "Bangers",
              size: 16
            }
          }
        }
      }
    }
  });
});
