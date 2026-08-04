document.addEventListener("DOMContentLoaded", () => {
  const projectsSection = document.querySelector(
    ".projects-scroll-section"
  );

  const projectsTrack = document.querySelector(
    ".projects-horizontal-track"
  );

  const progressBar = document.querySelector(
    ".projects-progress-bar"
  );

  if (!projectsSection || !projectsTrack) {
    return;
  }

  let maximumHorizontalMovement = 0;
  let ticking = false;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const clamp = (number, minimum, maximum) => {
    return Math.min(Math.max(number, minimum), maximum);
  };

  const calculateMeasurements = () => {
    maximumHorizontalMovement = Math.max(
      0,
      projectsTrack.scrollWidth - window.innerWidth
    );

    updateProjectsScroll();
  };

  const updateProjectsScroll = () => {
    const sectionRect = projectsSection.getBoundingClientRect();

    const scrollableDistance =
      projectsSection.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) {
      return;
    }

    const scrolledInsideSection = -sectionRect.top;

    const progress = clamp(
      scrolledInsideSection / scrollableDistance,
      0,
      1
    );

    if (prefersReducedMotion.matches) {
      projectsTrack.style.transform = "translate3d(0, 0, 0)";
    } else {
      const horizontalPosition =
        maximumHorizontalMovement * progress;

      projectsTrack.style.transform =
        `translate3d(${-horizontalPosition}px, 0, 0)`;
    }

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    projectsSection.classList.toggle(
      "is-active",
      progress > 0 && progress < 1
    );

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProjectsScroll);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestScrollUpdate, {
    passive: true
  });

  window.addEventListener("resize", calculateMeasurements);

  window.addEventListener("load", calculateMeasurements);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(
      calculateMeasurements
    );

    resizeObserver.observe(projectsTrack);
  }

  calculateMeasurements();
});
