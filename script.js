// 👉 Boom Inu Contract Setup
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // Replace with actual
const ABI = [ /* Paste actual ABI here */ ];
const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com()");
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// ✅ Claim Reflections (connected wallet must use signer)
async function claimReflections() {
  try {
    const tx = await contract.claimAllFull(1);
    await tx.wait();
    const btn = document.querySelector("button[onclick='claimReflections()']");
    btn.classList.add("claimed-success");
    setTimeout(() => btn.classList.remove("claimed-success"), 1200);
    alert("Reflections claimed!");
  } catch (e) {
    console.error("Claim failed:", e);
    alert("Claim failed");
  }
}

// 🧠 Meme Template Map
const MEME_TEMPLATES = {
  "drake": "drake",
  "two-buttons": "two-buttons",
  "distracted-boyfriend": "distracted-boyfriend",
  "change-my-mind": "change-my-mind",
  "gru": "gru",
  "united-states": "united-states",
  "doge": "doge",
  "success-kid": "success-kid",
  "roll-safe": "roll-safe"
};

// 🖼️ Meme Generator
function generateMeme() {
  const top = document.getElementById("topText")?.value || "_";
  const bottom = document.getElementById("bottomText")?.value || "_";
  const templateKey = document.getElementById("template")?.value || "doge";
  const template = MEME_TEMPLATES[templateKey] || "doge";
  const memeUrl = `https://api.memegen.link/images/${template}/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png`;
  const memeImage = document.getElementById("memeImage");
  if (memeImage) memeImage.src = memeUrl;
}

// 📥 Meme Downloader
function downloadMeme() {
  const memeImage = document.getElementById("memeImage");
  if (memeImage?.src) {
    const link = document.createElement("a");
    link.href = memeImage.src;
    link.download = "boom-meme.png";
    link.click();
  }
}

// 🔁 Intro Popup Handler
document.getElementById("enterBtn")?.addEventListener("click", () => {
  const popup = document.getElementById("intro-popup");
  if (popup) popup.style.display = "none";
});

// 📊 Boom Inu Stats
async function fetchBoomStats() {
  try {
    const volume = await contract.get24hVolume();
    const buyTax = await contract.currentBuyTax();
    const sellTax = await contract.currentSellTax();
    const supply = await contract.circulatingSupply();
    const burnCountdown = await contract.getBurnCountdown();
    const gasPrice = await provider.getGasPrice();

    document.getElementById("volume").innerText = (volume / 1e18).toFixed(2) + " BOOM";
    document.getElementById("buyTax").innerText = buyTax + "%";
    document.getElementById("sellTax").innerText = sellTax + "%";
    document.getElementById("supply").innerText = (supply / 1e18).toFixed(2) + " BOOM";
    document.getElementById("nextBurn").innerText = burnCountdown + " BOOM until burn";
    document.getElementById("gasPrice").innerText = parseFloat(ethers.utils.formatUnits(gasPrice, "gwei")).toFixed(1) + " GWEI";

  } catch (e) {
    console.error("Error fetching Boom stats:", e);
  }
}

fetchBoomStats();
setInterval(fetchBoomStats, 10000); // refresh stats every 10s

document.getElementById("enterBtn")?.addEventListener("click", () => {
  const modal = document.getElementById("intro-popup");
  if (modal) modal.style.display = "none";
});
