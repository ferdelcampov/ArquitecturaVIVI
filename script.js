document.addEventListener("DOMContentLoaded", () => {
  const projectsSection = document.querySelector(
    ".projects-scroll-section"
  );

  const projectsViewport = document.querySelector(
    ".projects-horizontal-viewport"
  );

  const projectsTrack = document.querySelector(
    ".projects-horizontal-track"
  );

  const progressBar = document.querySelector(
    ".projects-progress-bar"
  );

  if (!projectsSection || !projectsViewport || !projectsTrack) {
    return;
  }

  let maximumHorizontalScroll = 0;
  let ticking = false;
  let isManuallyInteracting = false;
  let manualInteractionTimer;

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const clamp = (value, minimum, maximum) => {
    return Math.min(Math.max(value, minimum), maximum);
  };

  const calculateMeasurements = () => {
    maximumHorizontalScroll = Math.max(
      0,
      projectsViewport.scrollWidth - projectsViewport.clientWidth
    );

    updateProjectsFromVerticalScroll();
  };

  const getSectionProgress = () => {
    const sectionRectangle =
      projectsSection.getBoundingClientRect();

    const verticalDistance =
      projectsSection.offsetHeight - window.innerHeight;

    if (verticalDistance <= 0) {
      return 0;
    }

    return clamp(
      -sectionRectangle.top / verticalDistance,
      0,
      1
    );
  };

  const updateProgressBar = () => {
    if (!progressBar || maximumHorizontalScroll <= 0) {
      return;
    }

    const horizontalProgress = clamp(
      projectsViewport.scrollLeft / maximumHorizontalScroll,
      0,
      1
    );

    progressBar.style.transform =
      `scaleX(${horizontalProgress})`;
  };

  const updateProjectsFromVerticalScroll = () => {
    const progress = getSectionProgress();

    if (
      !reducedMotionQuery.matches &&
      !isManuallyInteracting
    ) {
      const targetHorizontalPosition =
        maximumHorizontalScroll * progress;

      projectsViewport.scrollLeft =
        targetHorizontalPosition;
    }

    updateProgressBar();

    projectsSection.classList.toggle(
      "is-active",
      progress > 0 && progress < 1
    );

    ticking = false;
  };

  const requestVerticalUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(
      updateProjectsFromVerticalScroll
    );
  };

  const startManualInteraction = () => {
    isManuallyInteracting = true;

    window.clearTimeout(manualInteractionTimer);
  };

  const finishManualInteraction = () => {
    window.clearTimeout(manualInteractionTimer);

    manualInteractionTimer = window.setTimeout(() => {
      isManuallyInteracting = false;
    }, 700);
  };

  projectsViewport.addEventListener(
    "pointerdown",
    startManualInteraction
  );

  projectsViewport.addEventListener(
    "pointerup",
    finishManualInteraction
  );

  projectsViewport.addEventListener(
    "pointercancel",
    finishManualInteraction
  );

  projectsViewport.addEventListener(
    "touchstart",
    startManualInteraction,
    { passive: true }
  );

  projectsViewport.addEventListener(
    "touchend",
    finishManualInteraction,
    { passive: true }
  );

  projectsViewport.addEventListener(
    "wheel",
    (event) => {
      const horizontalMovement =
        Math.abs(event.deltaX) > Math.abs(event.deltaY);

      if (horizontalMovement || event.shiftKey) {
        startManualInteraction();
        finishManualInteraction();
      }
    },
    { passive: true }
  );

  projectsViewport.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateProgressBar);
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    requestVerticalUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    calculateMeasurements
  );

  window.addEventListener(
    "load",
    calculateMeasurements
  );

  if ("ResizeObserver" in window) {
    const projectsResizeObserver =
      new ResizeObserver(calculateMeasurements);

    projectsResizeObserver.observe(projectsTrack);
    projectsResizeObserver.observe(projectsViewport);
  }

  calculateMeasurements();
});
