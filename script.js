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

  // Show comic content
  document.getElementById("comic-container").classList.remove("hidden");

  // Show and animate logo
  const header = document.getElementById("siteHeader");
  const logo = header.querySelector(".logo");
  header.classList.remove("hidden");
  setTimeout(() => logo.classList.add("visible"), 100); // trigger zoom-in

  // Enable scrolling
  document.body.style.overflow = "auto";

  // Optional: randomize background
  const randomSrc = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = `url(${randomSrc})`;
});

// ✨ Animate sections on scroll
const sections = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

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
});
