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

// 🔒 Lock scroll until accepted
document.body.style.overflow = "hidden";

// 🔓 Unlock site on "OKAY, BOOM"
document.getElementById("okayBoom").addEventListener("click", () => {
  // Hide modal
  document.getElementById("popup").style.display = "none";

  // Inject logo container into DOM
  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  logoContainer.innerHTML = `<img src="images/boomInuLogo1.png" alt="BOOMINU Logo" class="logo" />`;
  document.body.prepend(logoContainer);

  // Animate logo
  setTimeout(() => {
    document.querySelector(".logo").classList.add("visible");
  }, 100);

  // Show comic content
  document.getElementById("comic-container").classList.remove("hidden");

  // Enable scrolling
  document.body.style.overflow = "auto";

  // 🌄 Randomize background
  const randomSrc = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = `url(${randomSrc})`;
});

// ✨ Animate sections on scroll
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
});

// 🔌 Wallet Connect Button
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
  // 👀 Hide logo on scroll down, show on scroll up
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const logoContainer = document.querySelector(".logo-container");
  if (!logoContainer) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 50) {
    logoContainer.classList.add("hidden-scroll");
  } else {
    logoContainer.classList.remove("hidden-scroll");
  }

  lastScrollTop = scrollTop;
});
