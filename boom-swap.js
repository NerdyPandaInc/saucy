// boom-swap.js

const routerAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap Router
const boomAddress = "0x665Dcc5aD8F4306C87dCFB0B2329ca829Bb0f6CF";
const maticAddress = "0x0000000000000000000000000000000000001010";

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

async function swapBoom() {
  const inputEl = document.getElementById("boomAmount");
  const inputValue = inputEl.value;

  if (!inputValue || isNaN(inputValue)) {
    alert("Enter a valid MATIC amount.");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();

  const router = new ethers.Contract(routerAddress, routerAbi, signer);

  const amountInWei = ethers.utils.parseUnits(inputValue, 18);
  const path = [maticAddress, boomAddress];
  const deadline = Math.floor(Date.now() / 1000) + 600;

  try {
    const tx = await router.swapExactETHForTokens(
      0,         // use slippage protection later!
      path,
      userAddress,
      deadline,
      { value: amountInWei }
    );
    alert(`TX Sent! Hash: ${tx.hash}`);
  } catch (error) {
    console.error(error);
    alert("Swap failed. Try again or check your wallet.");
  }
}

// Expose to global so HTML onclick works
window.swapBoom = swapBoom;
