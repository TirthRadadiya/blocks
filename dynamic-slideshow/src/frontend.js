document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let currentIndex = 0;

  const autoScrollEnabled = attributes.autoScroll;
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
    stopAutoScroll();
    goToNextSlide();
    startAutoScroll();
  });

  // Handle Previous Button Click
  document.querySelector(".prev").addEventListener("click", function () {
    stopAutoScroll();
    goToPrevSlide();
    startAutoScroll();
  });

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

  // If auto-scroll is enabled, start it
  if (autoScrollEnabled) {
    startAutoScroll();
  }
});
