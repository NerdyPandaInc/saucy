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
  document.getElementById("popup").style.display = "none";
  document.getElementById("comic-container").classList.remove("hidden");

  const header = document.getElementBy
