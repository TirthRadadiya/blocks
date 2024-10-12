document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let currentIndex = 0;
  let autoScrollEnabled = true; // Condition to control auto-scroll
  let autoScrollInterval;

  // Initial Setup of Slides
  function setupSlides() {
    slides.forEach((slide, index) => {
      slide.classList.remove("activeSlide", "nextSlide", "lastSlide");
      if (index === currentIndex) {
        slide.classList.add("activeSlide");
      } else if (index === (currentIndex + 1) % slides.length) {
        slide.classList.add("nextSlide");
      } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
        slide.classList.add("lastSlide");
      }
    });
  }

  // Function to handle moving to next slide
  function goToNextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    setupSlides();
  }

  // Function to handle moving to previous slide
  function goToPrevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    setupSlides();
  }

  setupSlides(); // Initialize slides on load

  // Handle Next Button Click
  document.querySelector(".next").addEventListener("click", function () {
    goToNextSlide();
  });

  // Handle Previous Button Click
  document.querySelector(".prev").addEventListener("click", function () {
    goToPrevSlide();
  });

  // Enable or Disable Auto-scroll based on condition
  function checkAutoScrollCondition() {
    // Add your condition logic here
    // For example, enable auto-scroll based on a boolean or a user setting
    autoScrollEnabled = true; // Assume condition is met and enable auto-scroll
  }

  // Start Auto-scroll when condition is met
  function startAutoScroll() {
    if (autoScrollEnabled) {
      autoScrollInterval = setInterval(goToNextSlide, 2000); // Change slide every 2 seconds
    }
  }

  // Stop Auto-scroll when needed
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Call the function to check for auto-scroll condition
  checkAutoScrollCondition();

  // If auto-scroll is enabled, start it
  if (autoScrollEnabled) {
    startAutoScroll();
  }

  // Optional: You can also stop auto-scroll when user interacts manually
  document.querySelector(".next").addEventListener("click", stopAutoScroll);
  document.querySelector(".prev").addEventListener("click", stopAutoScroll);
});
