document.addEventListener("DOMContentLoaded", () => {
  const projectTrack = document.querySelector(".projects .project-grid");

  const projectCards = Array.from(
    document.querySelectorAll(".projects .project-card")
  );

  const filterButtons = Array.from(
    document.querySelectorAll(".filter-btn")
  );

  const previousButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");

  if (
    !projectTrack ||
    !projectCards.length ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  const getVisibleCards = () => {
    return projectCards.filter(
      (card) => !card.classList.contains("hidden")
    );
  };

  const getScrollAmount = () => {
    const firstVisibleCard = getVisibleCards()[0];

    if (!firstVisibleCard) {
      return projectTrack.clientWidth;
    }

    const trackStyles = window.getComputedStyle(projectTrack);
    const gap =
      parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    return firstVisibleCard.getBoundingClientRect().width + gap;
  };

  const updateCarouselButtons = () => {
    const maximumScroll =
      projectTrack.scrollWidth - projectTrack.clientWidth;

    const tolerance = 4;

    previousButton.disabled =
      projectTrack.scrollLeft <= tolerance;

    nextButton.disabled =
      projectTrack.scrollLeft >= maximumScroll - tolerance ||
      maximumScroll <= tolerance;
  };

  const resetCarousel = () => {
    projectTrack.scrollTo({
      left: 0,
      behavior: "smooth"
    });

    window.setTimeout(updateCarouselButtons, 350);
  };

  previousButton.addEventListener("click", () => {
    projectTrack.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth"
    });
  });

  nextButton.addEventListener("click", () => {
    projectTrack.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth"
    });
  });

  projectTrack.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateCarouselButtons);
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        filterButton.classList.toggle(
          "active",
          filterButton === button
        );
      });

      projectCards.forEach((card) => {
        const projectCategory = card.dataset.category;

        const shouldShow =
          selectedFilter === "all" ||
          projectCategory === selectedFilter;

        card.classList.toggle("hidden", !shouldShow);
      });

      resetCarousel();
    });
  });

  window.addEventListener("resize", () => {
    updateCarouselButtons();
  });

  updateCarouselButtons();
});
