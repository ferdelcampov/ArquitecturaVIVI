document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector(
    ".projects-carousel-viewport"
  );

  const track = document.querySelector(
    ".projects-carousel-track"
  );

  const cards = Array.from(
    document.querySelectorAll(
      ".projects-carousel-track .project-card"
    )
  );

  const previousButton = document.querySelector(
    ".carousel-prev"
  );

  const nextButton = document.querySelector(
    ".carousel-next"
  );

  const currentProjectElement = document.querySelector(
    ".current-project"
  );

  const totalProjectsElement = document.querySelector(
    ".total-projects"
  );

  if (
    !viewport ||
    !track ||
    cards.length === 0 ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  let currentIndex = 0;
  let scrollTimeout;

  const formatNumber = (number) => {
    return String(number).padStart(2, "0");
  };

  const getTrackGap = () => {
    const styles = window.getComputedStyle(track);

    return parseFloat(styles.gap) || 0;
  };

  const getSlideWidth = () => {
    return cards[0].getBoundingClientRect().width + getTrackGap();
  };

  const updateInterface = () => {
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === cards.length - 1;

    if (currentProjectElement) {
      currentProjectElement.textContent =
        formatNumber(currentIndex + 1);
    }

    if (totalProjectsElement) {
      totalProjectsElement.textContent =
        formatNumber(cards.length);
    }
  };

  const goToProject = (index) => {
    currentIndex = Math.max(
      0,
      Math.min(index, cards.length - 1)
    );

    viewport.scrollTo({
      left: currentIndex * getSlideWidth(),
      behavior: "smooth"
    });

    updateInterface();
  };

  previousButton.addEventListener("click", () => {
    goToProject(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    goToProject(currentIndex + 1);
  });

  viewport.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(scrollTimeout);

      scrollTimeout = window.setTimeout(() => {
        const slideWidth = getSlideWidth();

        if (slideWidth <= 0) {
          return;
        }

        currentIndex = Math.round(
          viewport.scrollLeft / slideWidth
        );

        currentIndex = Math.max(
          0,
          Math.min(currentIndex, cards.length - 1)
        );

        updateInterface();
      }, 80);
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    viewport.scrollLeft =
      currentIndex * getSlideWidth();

    updateInterface();
  });

  updateInterface();
});
