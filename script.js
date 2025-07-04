
document.addEventListener("DOMContentLoaded", () => {
  const rotator = document.querySelector(".background-rotator");

  const backgrounds = [
    'images/202572165617309.png',
    'images/202572165631575.png',
    'images/202572165113979.png'
  ];

  let index = 0;

  function rotateBackground() {
    rotator.style.backgroundImage = `url(${backgrounds[index]})`;
    index = (index + 1) % backgrounds.length;
  }

  rotateBackground(); // initial load
  setInterval(rotateBackground, 8000); // change every 8 seconds
});
