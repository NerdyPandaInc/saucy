document.querySelector(".connect-btn")?.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      alert("Wallet connected!");
    } catch (err) {
      alert("Connection rejected.");
    }
  } else {
    alert("MetaMask not found.");
  }
});
