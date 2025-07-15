document.addEventListener("DOMContentLoaded", () => {
  const { ethers } = window;
  let provider, signer, contract;
  let isConnecting = false;
  let timerInterval;

  // Cache DOM elements
  const connectButton = document.getElementById("connect-wallet");
  const disconnectButton = document.getElementById("disconnect-wallet");
  const loadingDiv = document.getElementById("loading");
  const toggleAutoClaimButton = document.getElementById("toggle-auto-claim");
  const claimReflectionsButton = document.getElementById("claim-reflections");
  const securityAck = document.getElementById("security-ack");
  const timerDiv = document.getElementById("timer");

  if (!connectButton || !disconnectButton || !loadingDiv || !toggleAutoClaimButton || !claimReflectionsButton || !securityAck || !timerDiv) {
    console.error("DOM elements not found:", {
      connectButton,
      disconnectButton,
      loadingDiv,
      toggleAutoClaimButton,
      claimReflectionsButton,
      securityAck,
      timerDiv
    });
    alert("Error: Required DOM elements not found. Please reload the page.");
    return;
  }

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

  // Generic error message template
  const genericErrorMessage = `
    Action failed. Possible reasons include:
    - Insufficient BOOM token balance (check your balance and minimum holding requirement).
    - Unmet contract conditions (e.g., streak or threshold requirements).
    - Network issues (ensure you're on Polygon Mainnet).
    - Contract restrictions (e.g., reflections locked).
    For help, review your stats, ensure proper setup, or contact support at [support link].
  `.trim();

  // Initialize timer
  function startTimer() {
    let timeLeft = 60;
    timerDiv.textContent = `Session Timer: ${timeLeft}s`;
    if (timerInterval) clearInterval(timerInterval); // Clear existing interval
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDiv.textContent = `Session Timer: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (disconnectButton.style.display !== "none") {
          disconnectButton.click();
          alert("Session timed out. Wallet disconnected for security.");
        }
      }
    }, 1000);
  }

  // Reset timer on navigation
  window.addEventListener("DOMContentLoaded", startTimer);

  // Initialize connection
  async function initializeConnection() {
    if (isConnecting) {
      alert("Already processing connection request. Please wait.");
      return false;
    }

    isConnecting = true;
    connectButton.style.display = "none";
    loadingDiv.style.display = "block";

    if (!window.ethereum) {
      console.error("MetaMask not detected. Please install it.");
      alert("MetaMask is not detected. Please install it and refresh the page.");
      isConnecting = false;
      connectButton.style.display = "inline-block";
      loadingDiv.style.display = "none";
      return false;
    }

    try {
      console.log("Requesting accounts...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("Network detected:", network);
      if (network.chainId !== 137) {
        alert("Please switch to Polygon Mainnet in MetaMask.");
        isConnecting = false;
        connectButton.style.display = "inline-block";
        loadingDiv.style.display = "none";
        return false;
      }
      provider.on("network", (newNetwork, oldNetwork) => {
        if (newNetwork && newNetwork.chainId !== 137) {
          alert("Network changed to an unsupported chain. Please switch back to Polygon Mainnet.");
          if (contract) {
            contract = null;
            disconnectButton.click();
          }
        }
      });
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
      console.log("Contract initialized:", contract);
      isConnecting = false;
      connectButton.style.display = "inline-block";
      loadingDiv.style.display = "none";
      startTimer(); // Start timer after successful connection
      return true;
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Failed to connect wallet: " + error.message + "\n" + genericErrorMessage);
      isConnecting = false;
      connectButton.style.display = "inline-block";
      loadingDiv.style.display = "none";
      return false;
    }
  }

  // Connect Wallet
  connectButton.addEventListener("click", async () => {
    if (!securityAck.checked) {
      alert("Please acknowledge the security risks before connecting.");
      return;
    }
    const connected = await initializeConnection();
    console.log("Connection result:", connected);
    if (connected) {
      await loadData();
      if (connectButton) connectButton.style.display = "none";
      if (disconnectButton) disconnectButton.style.display = "inline-block";
      // Force enable action buttons with delay to ensure DOM update
      setTimeout(() => {
        if (toggleAutoClaimButton) toggleAutoClaimButton.disabled = false;
        if (claimReflectionsButton) claimReflectionsButton.disabled = false;
        console.log("Action buttons enabled:", {
          toggle: !toggleAutoClaimButton.disabled,
          claim: !claimReflectionsButton.disabled
        });
      }, 0);
    } else {
      alert("Connection failed. Please check MetaMask and try again.\n" + genericErrorMessage);
    }
  });

  // Enable Connect Wallet based on security acknowledgment
  securityAck.addEventListener("change", (e) => {
    connectButton.disabled = !e.target.checked;
    console.log("Connect button enabled:", !connectButton.disabled);
  });

  // Disconnect Wallet
  disconnectButton.addEventListener("click", () => {
    provider = null;
    signer = null;
    contract = null;
    if (connectButton) connectButton.style.display = "inline-block";
    if (disconnectButton) disconnectButton.style.display = "none";
    if (toggleAutoClaimButton) toggleAutoClaimButton.disabled = true;
    if (claimReflectionsButton) claimReflectionsButton.disabled = true;
    document.getElementById("metrics").innerHTML = `<h3>Global Metrics</h3><p>Loading...</p>`;
    document.getElementById("user-data").innerHTML = `<h3>Your Stats</h3><p>Connect wallet to see your data.</p>`;
    alert("Wallet disconnected. Please refresh the page to clear the cache and reconnect.");
  });

  // Load Data
  async function loadData() {
    if (!contract) {
      console.error("Contract not initialized. Please connect wallet.");
      document.getElementById("metrics").innerHTML = `<h3>Global Metrics</h3><p>Contract not initialized. Connect your wallet first.</p>`;
      document.getElementById("user-data").innerHTML = `<h3>Your Stats</h3><p>Connect wallet to see your data.</p>`;
      return;
    }
    await updateMetrics();
    await updateUserData();
    listenToEvents();
  }

  // Update Metrics
  async function updateMetrics() {
    const metricsDiv = document.getElementById("metrics");
    try {
      if (!contract) throw new Error("Contract not initialized");
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
      if (!contract) throw new Error("Contract not initialized");
      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address); // Token balance
      const streak = await contract.flipStreak(address);
      const minHolding = await contract.minHoldingForReflection(); // Minimum holding requirement
      const bonusExpires = await contract.streakBonusExpires(address);

      // Note: Owed Reflections requires a specific function not in the current ABI
      userDataDiv.innerHTML = `<h3>Your Stats</h3>
        <p>Balance: ${ethers.utils.formatEther(balance)} BOOM</p>
        <p>Minimum Holding Required: ${ethers.utils.formatEther(minHolding)} BOOM</p>
        <p>Owed Reflections: N/A (Placeholder - Update ABI with correct function, e.g., getOwed)</p>
        <p>Streak: ${streak.toString()}</p>
        <p>Bonus Expires: ${bonusExpires.eq(0) ? 'N/A' : new Date(bonusExpires.toNumber() * 1000).toLocaleString()}</p>`;
    } catch (error) {
      console.error("User data error:", error);
      userDataDiv.innerHTML = `<h3>Your Stats</h3><p>Error loading data: ${error.message}</p>`;
    }
  }

  // Toggle Auto Claim
  toggleAutoClaimButton.addEventListener("click", async () => {
    alert("Toggle Auto Claim button clicked! Attempting to toggle...");
    try {
      if (!contract) throw new Error("Contract not initialized");
      const currentStatus = await contract.autoClaimEnabled(await signer.getAddress());
      const tx = await contract.setAutoClaim(!currentStatus);
      await tx.wait();
      alert("Auto Claim toggled successfully!");
      updateUserData();
      startTimer(); // Reset timer on successful toggle
    } catch (error) {
      console.error("Toggle error:", error);
      alert("Failed to toggle auto claim: " + (error.message || "Unknown error") + " (Reason: " + (error.reason || "Unknown") + ")\n" + genericErrorMessage);
    }
  });

  // Claim Reflections
  claimReflectionsButton.addEventListener("click", async () => {
    alert("Claim Reflections button clicked! Attempting to claim...");
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.claimAllFull(5); // Adjust maxLoops as needed
      await tx.wait();
      alert("Reflections claimed successfully!");
      updateUserData();
      startTimer(); // Reset timer on successful claim
    } catch (error) {
      console.error("Claim error:", error);
      alert("Failed to claim reflections: " + (error.message || "Unknown error") + " (Reason: " + (error.reason || "Unknown") + ")\n" + genericErrorMessage);
    }
  });

  // Listen to Events
  function listenToEvents() {
    if (!contract) {
      console.error("Contract not initialized. Cannot listen to events.");
      return;
    }
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
});
