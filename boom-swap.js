// boom-swap.js

// 💡 Contract Constants
const routerAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
const boomAddress = "0x665Dcc5aD8F4306C87dCFB0B2329ca829Bb0f6CF";
const maticAddress = "0x0000000000000000000000000000000000001010"; // Native MATIC
const wmaticAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; // Wrapped MATIC

// 🧬 Minimal ABI
const routerAbi = [
  {
    name: "swapExactETHForTokens",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" }
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }]
  },
  {
    name: "getAmountsOut",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" }
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }]
  }
];

// 🌐 Wallet State
let signer = null;
let userAddress = null;
let connectionTimer = null;

// 🔗 Show Disclaimer Before Connect
document.getElementById("connectWallet").addEventListener("click", () => {
  document.getElementById("walletDisclaimer").style.display = "flex";
});

// 🧠 Accept Disclaimer & Connect Wallet
document.getElementById("acceptDisclaimer").addEventListener("click", async () => {
  document.getElementById("walletDisclaimer").style.display = "none";

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("walletStatus").textContent =
      `✅ Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

    clearTimeout(connectionTimer);
    connectionTimer = setTimeout(() => {
      signer = null;
      userAddress = null;
      document.getElementById("walletStatus").textContent = "🔒 Auto-disconnected after 60s";
      document.getElementById("boomOutput").value = "";
    }, 60000);
  } catch (err) {
    console.error("Wallet connect failed:", err);
    alert("Connection failed. Make sure MetaMask is installed and you're on the Polygon network.");
  }
});

// 🔌 Manual Disconnect Button
document.getElementById("disconnectWallet").addEventListener("click", () => {
  signer = null;
  userAddress = null;
  document.getElementById("walletStatus").textContent = "🔒 Disconnected";
  document.getElementById("boomOutput").value = "";
  clearTimeout(connectionTimer);
});

// 💥 Execute Swap — MATIC → BOOM
async function swapBoom() {
  if (!signer || !userAddress) {
    alert("Please connect your wallet first.");
    return;
  }

  const amountInput = document.getElementById("maticInput").value;
  if (!amountInput || isNaN(amountInput)) {
    alert("Enter a valid MATIC amount.");
    return;
  }

  const amountInWei = ethers.utils.parseUnits(amountInput, 18);
  const path = [wmaticAddress, boomAddress];
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const swapContract = new ethers.Contract(routerAddress, routerAbi, signer);

  try {
    document.getElementById("swapStatus").textContent = "⏳ Submitting transaction...";
    const tx = await swapContract.swapExactETHForTokens(
      0,
      path,
      userAddress,
      deadline,
      { value: amountInWei }
    );
    document.getElementById("swapStatus").textContent = `✅ TX sent: ${tx.hash}`;
  } catch (error) {
    console.error("Swap failed", error);
    alert("Swap failed. Check your wallet or try again.");
    document.getElementById("swapStatus").textContent = "❌ Swap failed";
  }
}

// 📊 Estimate BOOM from MATIC input
document.getElementById("maticInput").addEventListener("input", async () => {
  const inputValue = document.getElementById("maticInput").value;
  if (!inputValue || isNaN(inputValue)) {
    document.getElementById("boomOutput").value = "";
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const router = new ethers.Contract(routerAddress, routerAbi, provider);

    const amountInWei = ethers.utils.parseUnits(inputValue, 18);
    const path = [wmaticAddress, boomAddress];

    const amounts = await router.getAmountsOut(amountInWei, path);
    const boomEstimate = ethers.utils.formatUnits(amounts[1], 18);
    document.getElementById("boomOutput").value = boomEstimate;
  } catch (err) {
    console.error("Estimation failed", err);
    document.getElementById("boomOutput").value = "—";
  }
});

// 🌍 Global Access & Button Binding
window.swapBoom = swapBoom;
document.getElementById("swapButton").addEventListener("click", swapBoom);
