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
