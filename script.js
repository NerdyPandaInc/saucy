document.addEventListener("DOMContentLoaded", () => {
  const bg1 = document.querySelector(".bg1");
  const bg2 = document.querySelector(".bg2");

  const backgrounds = [
    'images/202572165617309.png',
    'images/202572165455552.png',
    'images/202572165113979.png'
  ];

  let index = 0;
  let showingBg1 = true;

  function crossfadeBackground() {
    const nextImage = backgrounds[index];
    index = (index + 1) % backgrounds.length;

    if (showingBg1) {
      bg2.style.backgroundImage = `url(${nextImage})`;
      bg2.style.opacity = 1;
      bg1.style.opacity = 0;
    } else {
      bg1.style.backgroundImage = `url(${nextImage})`;
      bg1.style.opacity = 1;
      bg2.style.opacity = 0;
    }

    showingBg1 = !showingBg1;
  }

  // Initial load
  bg1.style.backgroundImage = `url(${backgrounds[0]})`;
  bg1.style.opacity = 1;

  setInterval(crossfadeBackground, 8000); // every 8 seconds
});
