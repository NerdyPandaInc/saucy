// 🔓 Unlock the comic when user clicks "OKAY, BOOM"
document.getElementById("okayBoom").addEventListener("click", () => {
  // Hide the modal
  document.getElementById("popup").style.display = "none";

  // Show the comic container
  document.getElementById("comic-container").classList.remove("hidden");

  // Allow scrolling again
  document.body.style.overflow = "auto";

  // Initialize Turn.js flipbook
  $('#flipbook').turn({
    width: 800,
    height: 600,
    autoCenter: true,
    elevation: 50,
    gradients: true,
    duration: 1000
  });
});

// 🔌 Optional: Connect Wallet Button
document.querySelector(".connect-btn")?.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      alert("Wallet connected!");
    } catch (err) {
      alert("Connection rejected.");
    }
  } else {
    alert("MetaMask not found. Please install it to connect.");
  }
});
