// 🔓 Unlock the comic when user clicks "OKAY, BOOM"
document.getElementById("okayBoom").addEventListener("click", () => {
  // Hide the modal
  document.getElementById("popup").style.display = "none";

  // Show the comic container
  document.getElementById("comic-container").classList.remove("hidden");

  // Allow scrolling again
  document.body.style.overflow = "auto";

  // Initialize Turn.js flipbook
  $('#flipbook').turn({
    width: 800,
    height: 600,
    autoCenter: true,
    elevation: 50,
    gradients: true,
    duration: 1000,
    when: {
      turned: function (event, page) {
        // 🔄 Remove 'active' from all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // ✅ Add 'active' to the current page
        const currentPage = document.querySelector(`#flipbook .page:nth-child(${page})`);
        if (currentPage) currentPage.classList.add('active');

        // 🌄 Randomize background image
        const backgrounds = [
          'url(images/bg1.jpg)',
          'url(images/bg2.jpg)',
          'url(images/bg3.jpg)',
          'url(images/bg4.jpg)'
        ];
        const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        document.body.style.backgroundImage = randomBg;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
      }
    }
  });

  // Trigger animation on first page
  const firstPage = document.querySelector('#flipbook .page:nth-child(1)');
  if (firstPage) firstPage.classList.add('active');
});

// 🔌 Optional: Connect Wallet Button
document.querySelector(".connect-btn")?.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      alert("Wallet connected!");
    } catch (err) {
      alert("Connection rejected.");
    }
  } else {
    alert("MetaMask not found. Please install it to connect.");
  }
});
