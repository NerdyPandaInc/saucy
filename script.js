// 🌄 Preload background images
const backgrounds = [
  'images/202572165113979.png',
  'images/202572165617309.png',
  'images/20257216561317.png',
  'images/20257216516370.png'
];

backgrounds.forEach(src => {
  const img = new Image();
  img.onload = () => console.log(`✅ Preloaded: ${src}`);
  img.src = src;
});

// 🔒 Lock scroll until comic is unlocked
document.body.style.overflow = "hidden";

// 🔓 Unlock the comic when user clicks "OKAY, BOOM"
document.getElementById("okayBoom").addEventListener("click", () => {
  // Hide the modal
  document.getElementById("popup").style.display = "none";

  // Show the comic container
  document.getElementById("comic-container").classList.remove("hidden");

  // Allow scrolling again
  document.body.style.overflow = "auto";

  // ✅ Initialize Turn.js if available
  const flipbook = document.getElementById("flipbook");
  if (!flipbook) {
    console.error("❌ #flipbook element not found.");
    return;
  }

  if (typeof $('#flipbook').turn === 'function') {
    $('#flipbook').turn({
      width: 800,
      height: 600,
      autoCenter: true,
      elevation: 50,
      gradients: true,
      duration: 1000,
      when: {
        turned: function (event, page) {
          // 🔄 Remove 'active' from all pages
          document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

          // ✅ Add 'active' to the current page
          const currentPage = document.querySelector(`#flipbook .page:nth-child(${page})`);
          if (currentPage) currentPage.classList.add('active');

          // 🌄 Randomize background image
          const randomSrc = backgrounds[Math.floor(Math.random() * backgrounds.length)];
          document.body.style.backgroundImage = `url(${randomSrc})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
        }
      }
    });

    // Trigger animation on first page
    const firstPage = document.querySelector('#flipbook .page:nth-child(1)');
    if (firstPage) firstPage.classList.add('active');
  } else {
    console.error("❌ Turn.js failed to load.");
  }
});

// 🔌 Connect Wallet Button Logic
const connectBtn = document.querySelector(".connect-btn");

connectBtn?.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectBtn.textContent = "✅ Connected";
      connectBtn.disabled = true;
    } catch (err) {
      alert("Connection rejected.");
    }
  } else {
    alert("MetaMask not found. Please install it to connect.");
  }
});
