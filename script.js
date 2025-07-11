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

// 🧠 Imgflip Template Map (Verified)
const IMGFLIP_TEMPLATES = {
  "drake": "181913649",
  "two-buttons": "87743020",
  "distracted-boyfriend": "112126428",
  "change-my-mind": "129242436",
  "gru": "131087935",
  "doge": "8072285",
  "buzz": "148593947",
  "philosoraptor": "97984",
  "exit-ramp": "124822590",
  "uno-draw-25": "323911829",
  "bernie-asking": "222403160",
  "disaster-girl": "97984",
  "batman-slap": "438680",
  "epic-handshake": "135256802",
  "sad-pablo": "248395943",
  "anakin-padme": "218253896",
  "always-has-been": "296176148",
  "mocking-spongebob": "102156234",
  "buff-doge": "511307624",
  "expanding-brain": "93895088",
  "woman-cat": "188390779",
  "x-everywhere": "91538330",
  "trade-offer": "326297693",
  "one-does-not-simply": "61579",
  "success-kid": "61544",
  "tuxedo-pooh": "178591752",
  "pain-harold": "27813981",
  "this-is-fine": "55311130"
};

// 🖼️ Meme Generator (Using Imgflip API)
function sanitize(text) {
  return text.trim() || "_";
}

async function generateMeme() {
  const tplKey = document.getElementById("template").value;
  const templateId = IMGFLIP_TEMPLATES[tplKey];
  const topText = sanitize(document.getElementById("topText").value);
  const bottomText = sanitize(document.getElementById("bottomText").value);

  const form = new FormData();
  form.append("template_id", templateId);
  form.append("username", "B00m1nu");       // ← Your Imgflip Username
  form.append("password", "Word2p@ss");     // ← Your Imgflip Password
  form.append("text0", topText);
  form.append("text1", bottomText);

  try {
    const res = await fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      body: form
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error_message);
    document.getElementById("memeImage").src = json.data.url;
  } catch (err) {
    console.error("Imgflip error:", err);
    alert("Failed to generate meme: " + err.message);
  }
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
    document.getElementById("volume").innerText = "-- BOOM";
    document.getElementById("buyTax").innerText = "--%";
    document.getElementById("sellTax").innerText = "--%";
    document.getElementById("supply").innerText = "-- BOOM";
    document.getElementById("nextBurn").innerText = "-- BOOM until burn";
    document.getElementById("gasPrice").innerText = "-- GWEI";
  }
}

fetchBoomStats();
setInterval(fetchBoomStats, 10000); // refresh stats every 10s
