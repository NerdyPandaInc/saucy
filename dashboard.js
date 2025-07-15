const { ethers } = window;
let provider, signer, contract;

const contractAddress = "0x665Dcc5aD8F4306C87dCFB0B2329ca829Bb0f6CF";
const abi = [
  {"inputs":[{"internalType":"address","name":"_treasuryWallet","type":"address"},{"internalType":"address","name":"_teamWallet","type":"address"},{"internalType":"address","name":"_publicWallet","type":"address"},{"internalType":"address","name":"_dexRouter","type":"address"},{"internalType":"address","name":"_dexFactory","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[],"name":"BoostWindowClosed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"open","type":"bool"}],"name":"BoostWindowSet","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"until","type":"uint256"}],"name":"DoubleReflectionGranted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReflectionClaimed","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReflectionDistributed","type":"event"},
  {"anonymous":false,"inputs":[],"name":"ReflectionsLocked","type":"event"},
  {"anonymous":false,"inputs":[],"name":"ReflectionsUnlocked","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"currentStreak","type":"uint256"}],"name":"StreakProgress","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"newTokens","type":"address[]"}],"name":"TrackedTokensUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TreasuryBurned","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"volume","type":"uint256"}],"name":"VolumeThresholdReached","type":"event"},
  {"inputs":[],"name":"MAGNITUDE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MAX_CLAIM_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MIN_FLIP_FOR_STREAK","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"PHASE_TWO_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"STREAK_BONUS_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"STREAK_REQUIRED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"STREAK_WINDOW","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"alreadyCredited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"autoClaimEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bool","name":"status","type":"bool"}],"name":"blacklistAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"blacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"boostWindowOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"burned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"buyTaxPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint8","name":"maxLoops","type":"uint8"}],"name":"claimAllFull","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"dailyVolume","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"dexFactory","outputs":[{"internalType":"contract IUniswapV2Factory","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"dexRouter","outputs":[{"internalType":"contract IUniswapV2Router","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"emergencyUnlockReflections","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"flipStreak","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"isPhaseTwo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastAutoClaimTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastBoostCheck","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastDailyAction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastFlipTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastSellTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastVolumeReset","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"magnifiedReflectionPerShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"maxDailyActionAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"minDailyActionAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"minHoldingForReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"publicWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"reflectionsLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"reflectionsManuallyUnlocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"sellTaxPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setAutoClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tax","type":"uint256"}],"name":"setBuyTaxPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tax","type":"uint256"}],"name":"setSellTaxPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"streakBonusExpires","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"teamWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"trackedTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"treasuryBurnCap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"treasuryBurnProgress","outputs":[{"internalType":"uint256","name":"burnedAmount","type":"uint256"},{"internalType":"uint256","name":"burnCap","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"treasuryWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address[]","name":"newTokens","type":"address[]"}],"name":"updateTrackedTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"volumeThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"status","type":"bool"}],"name":"whitelistAddress","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

// Connect Wallet
document.getElementById("connect-wallet").addEventListener("click", async () => {
  // Debug: Check if Ethers and MetaMask are loaded
  console.log("Ethers loaded:", ethers);
  if (!window.ethereum) {
    console.error("MetaMask not detected. Please install it.");
    alert("MetaMask is not detected. Please install it and refresh the page.");
    return; // Return inside the event listener is valid
  }

  try {
    console.log("Attempting to connect wallet...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId !== 137) { // 137 is Polygon Mainnet
      alert("Please switch to Polygon Mainnet in MetaMask.");
      return;
    }
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("Wallet connected, contract initialized:", contract);
    await loadData();
    document.getElementById("connect-wallet").style.display = "none";
    document.getElementById("toggle-auto-claim").disabled = false;
    document.getElementById("claim-reflections").disabled = false;
  } catch (error) {
    console.error("Connection error:", error);
    alert("Failed to connect wallet: " + error.message);
  }
});

// Load Data
async function loadData() {
  await updateMetrics();
  await updateUserData();
  listenToEvents();
}

// Update Metrics
async function updateMetrics() {
  const metricsDiv = document.getElementById("metrics");
  try {
    const [totalSupply, burned, dailyVolume, reflectionsLocked, phaseTwo] = await Promise.all([
      contract.totalSupply(),
      contract.burned(),
      contract.dailyVolume(),
      contract.reflectionsLocked(),
      contract.isPhaseTwo()
    ]);
    metricsDiv.innerHTML = `<h3>Global Metrics</h3>
      <p>Total Supply: ${ethers.utils.formatEther(totalSupply)} BOOM</p>
      <p>Burned: ${ethers.utils.formatEther(burned)} BOOM</p>
      <p>Daily Volume: ${ethers.utils.formatEther(dailyVolume)} BOOM</p>
      <p>Reflections Locked: ${reflectionsLocked}</p>
      <p>Phase Two: ${phaseTwo}</p>`;
  } catch (error) {
    console.error("Metrics error:", error);
    metricsDiv.innerHTML = `<h3>Global Metrics</h3><p>Error loading data: ${error.message}</p>`;
  }
}

// Update User Data
async function updateUserData() {
  const userDataDiv = document.getElementById("user-data");
  try {
    const address = await signer.getAddress();
    const [balance, owed] = await Promise.all([
      contract.balanceOf(address),
      contract._calculateOwed(address).then(result => result[1]) // Assuming [accrued, owed]
    ]);
    const streak = await contract.flipStreak(address);
    const bonusExpires = await contract.streakBonusExpires(address);

    userDataDiv.innerHTML = `<h3>Your Stats</h3>
      <p>Balance: ${ethers.utils.formatEther(balance)} BOOM</p>
      <p>Owed Reflections: ${ethers.utils.formatEther(owed)} BOOM</p>
      <p>Streak: ${streak}</p>
      <p>Bonus Expires: ${bonusExpires.eq(0) ? 'N/A' : new Date(bonusExpires.toNumber() * 1000).toLocaleString()}</p>`;
  } catch (error) {
    console.error("User data error:", error);
    userDataDiv.innerHTML = `<h3>Your Stats</h3><p>Error loading data: ${error.message}</p>`;
  }
}

// Toggle Auto Claim
document.getElementById("toggle-auto-claim").addEventListener("click", async () => {
  try {
    const currentStatus = await contract.autoClaimEnabled(await signer.getAddress());
    const tx = await contract.setAutoClaim(!currentStatus);
    await tx.wait();
    alert("Auto Claim toggled successfully!");
    updateUserData();
  } catch (error) {
    console.error("Toggle error:", error);
    alert("Error toggling auto claim: " + error.message);
  }
});

// Claim Reflections
document.getElementById("claim-reflections").addEventListener("click", async () => {
  try {
    const tx = await contract.claimAllFull(5); // Adjust maxLoops as needed
    await tx.wait();
    alert("Reflections claimed successfully!");
    updateUserData();
  } catch (error) {
    console.error("Claim error:", error);
    alert("Error claiming reflections: " + error.message);
  }
});

// Listen to Events
function listenToEvents() {
  const eventList = document.getElementById("event-list");
  contract.on("ReflectionClaimed", (user, amount, event) => {
    const time = new Date(event.block.timestamp * 1000).toLocaleString();
    eventList.innerHTML = `<li>${time}: ${user} claimed ${ethers.utils.formatEther(amount)} BOOM</li>` + eventList.innerHTML;
  });
  contract.on("TreasuryBurned", (amount, event) => {
    const time = new Date(event.block.timestamp * 1000).toLocaleString();
    eventList.innerHTML = `<li>${time}: ${ethers.utils.formatEther(amount)} BOOM burned</li>` + eventList.innerHTML;
    updateMetrics();
  });
  contract.on("StreakProgress", (user, streak, event) => {
    const time = new Date(event.block.timestamp * 1000).toLocaleString();
    eventList.innerHTML = `<li>${time}: ${user} reached streak ${streak}</li>` + eventList.innerHTML;
  });
}

// Initial Load if MetaMask is detected
if (window.ethereum) {
  loadData().catch(console.error);
}
