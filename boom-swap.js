// boom-swap.js

// 💡 Contract Constants
const routerAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap Router
const boomAddress = "0x665Dcc5aD8F4306C87dCFB0B2329ca829Bb0f6CF"; // BOOM Token
const maticAddress = "0x0000000000000000000000000000000000001010"; // Native MATIC

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

// 🌐 State Variables
let signer = null;
let userAddress = null;

// 🔗 Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("walletStatus").textContent =
      `✅ Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  } catch (err) {
    console.error("Wallet connect failed:", err);
    alert("Connection failed. Make sure MetaMask is installed and you're on Polygon.");
  }
});

// 🔌 Disconnect Wallet
document.getElementById("disconnectWallet").addEventListener("click", () => {
  signer = null;
  userAddress = null;
  document.getElementById("walletStatus").textContent = "🔒 Disconnected";
});

// 💥 Execute Swap
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
  const path = [maticAddress, boomAddress];
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const swapContract = new ethers.Contract(routerAddress, routerAbi, signer);

  try {
    document.getElementById("swapStatus").textContent = "⏳ Submitting transaction...";
    const tx = await swapContract.swapExactETHForTokens(
      0,          // amountOutMin (slippage control later)
      path,
      userAddress,
      deadline,
      { value: amountInWei }
    );
    document.getElementById("swapStatus").textContent = `✅ TX sent: ${tx.hash}`;
  } catch (error) {
    console.error(error);
    alert("Swap failed. Try again or check your wallet.");
    document.getElementById("swapStatus").textContent = "❌ Swap failed";
  }
}

// 🌍 Expose to global scope (in case HTML uses onclick)
window.swapBoom = swapBoom;

// 🧠 Also wire via button ID
document.getElementById("swapButton").addEventListener("click", swapBoom);
