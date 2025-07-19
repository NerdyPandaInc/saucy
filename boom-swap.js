// boom-swap.js

// 💡 Contract Constants
const routerAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
const boomAddress = "0x665Dcc5aD8F4306C87dCFB0B2329ca829Bb0f6CF";
const maticAddress = "0x0000000000000000000000000000000000001010";

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
let signer;
let userAddress;

// 🔗 Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("walletStatus").textContent = `✅ Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  } catch (err) {
    console.error("Wallet connect failed:", err);
    alert("Connection failed. Make sure MetaMask is installed and you're on Polygon.");
  }
});

// 💥 Execute Swap
async function swapBoom() {
  const amountInput = document.getElementById("maticInput").value;

  if (!amountInput || isNaN(amountInput)) {
    alert("Please enter a valid MATIC amount.");
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
      0, // amountOutMin — later add slippage support
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

// 🌍 Expose to global scope
window.swapBoom = swapBoom;
