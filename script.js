document.addEventListener("DOMContentLoaded", () => {
  const introPopup = document.getElementById("intro-popup");
  const enterBtn = document.getElementById("enterBtn");
  const bgMusic = document.getElementById("bgMusic");

  // Lock scroll while intro is active
  document.body.style.overflow = "hidden";

  enterBtn.addEventListener("click", () => {
    introPopup.classList.add("fade-out");

    setTimeout(() => {
      introPopup.style.display = "none";
      document.body.style.overflow = "auto";

      if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
          console.log("Music started.");
        }).catch(err => {
          console.warn("Music play failed:", err);
        });
      }
    }, 1000); // match CSS transition duration
  });

  // 🔁 Background Crossfade Setup
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

  bg1.style.backgroundImage = `url(${backgrounds[0]})`;
  bg1.style.opacity = 1;

  setInterval(crossfadeBackground, 8000);

  // ✨ Scroll-triggered Panel Animation
  const panels = document.querySelectorAll('.comic-panel');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  panels.forEach(panel => observer.observe(panel));

  // ✨ Animate origin story paragraphs on scroll
  const fadePanels = document.querySelectorAll('.fade-panel');

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  fadePanels.forEach(p => fadeObserver.observe(p));
});
