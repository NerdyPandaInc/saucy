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
  setTimeout(() => logo.classList.add("visible"), 100);

  // Enable scrolling
  document.body.style.overflow = "auto";

  // 🌄 Randomize background
  const randomSrc = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = `url(${randomSrc})`;
});

// ✨ Animate sections on scroll
const sections = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/lzh-yi/Web-Fork-/tree/024b3e55587afdf9f05a677613a75f24e3d1803e/03-CSS%E8%BF%9B%E9%98%B6%2F04-%E5%A6%82%E4%BD%95%E8%AE%A9%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%E6%B0%B4%E5%B9%B3%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD%EF%BC%9F.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")
