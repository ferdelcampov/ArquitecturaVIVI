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

const heroVideo = document.querySelector(".hero-video-bg");

if (heroVideo) {
  heroVideo.muted = true;

  const playHeroVideo = () => {
    const playPromise = heroVideo.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // El navegador puede bloquear temporalmente la reproducción.
      });
    }
  };

  heroVideo.addEventListener("loadeddata", playHeroVideo);
  heroVideo.addEventListener("canplay", playHeroVideo);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      playHeroVideo();
    }
  });

  playHeroVideo();
}

document.addEventListener("DOMContentLoaded", () => {
  const heroSlides = Array.from(
    document.querySelectorAll(".hero-gallery-slide")
  );

  const currentCounter = document.querySelector(
    ".hero-gallery-current"
  );

  const totalCounter = document.querySelector(
    ".hero-gallery-total"
  );

  if (heroSlides.length === 0) {
    return;
  }

  let activeHeroSlide = 0;
  let heroGalleryInterval;

  const formatHeroNumber = (number) => {
    return String(number).padStart(2, "0");
  };

  const showHeroSlide = (index) => {
    heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === index);
    });

    if (currentCounter) {
      currentCounter.textContent = formatHeroNumber(index + 1);
    }
  };

  if (totalCounter) {
    totalCounter.textContent = formatHeroNumber(heroSlides.length);
  }

  const startHeroGallery = () => {
    window.clearInterval(heroGalleryInterval);

    heroGalleryInterval = window.setInterval(() => {
      activeHeroSlide =
        (activeHeroSlide + 1) % heroSlides.length;

      showHeroSlide(activeHeroSlide);
    }, 3000);
  };

  showHeroSlide(activeHeroSlide);
  startHeroGallery();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(heroGalleryInterval);
    } else {
      startHeroGallery();
    }
  });
});
