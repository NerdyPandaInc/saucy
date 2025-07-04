document.addEventListener("DOMContentLoaded", () => {
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
  const okayBoomBtn = document.getElementById("okayBoom");
  const popup = document.getElementById("popup");
  const comicContainer = document.getElementById("comic-container");

  if (okayBoomBtn && popup && comicContainer) {
    okayBoomBtn.addEventListener("click", () => {
      // Hide modal
      popup.style.display = "none";

      // Show comic content
      comicContainer.classList.remove("hidden");

      // Enable scrolling
      document.body.style.overflow = "auto";

      // 🌄 Randomize background
      const randomSrc = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      document.body.style.backgroundImage = `url(${randomSrc})`;
    });
  } else {
    console.warn("⚠️ Modal or content container not found in DOM.");
  }

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

  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
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
  }
});
