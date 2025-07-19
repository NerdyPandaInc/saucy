import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.min.js";

const routerAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap
const boomAddress = "0x665Dcc5aD8F4306C87dCFB0B2329ca829Bb0f6CF";
const maticAddress = "0x0000000000000000000000000000000000001010"; // MATIC

async function swapBoom() {
  const amountIn = document.getElementById("boomAmount").value;
  if (!amountIn || isNaN(amountIn)) return alert("Enter a valid amount.");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();

  const routerAbi = [...]; // Add ABI JSON here
  const router = new ethers.Contract(routerAddress, routerAbi, signer);

  const amountInWei = ethers.utils.parseUnits(amountIn, 18);
  const path = [maticAddress, boomAddress];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const tx = await router.swapExactETHForTokens(
    0, // minOutput
    path,
    userAddress,
    deadline,
    { value: amountInWei }
  );
  alert(`Swapping... TX Hash: ${tx.hash}`);
}
