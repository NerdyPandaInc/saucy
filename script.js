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

  // 🌄 Set a random background image
  const randomSrc = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = `url(${randomSrc})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
});

// ✨ Fade-in animation on scroll
const sections = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

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
