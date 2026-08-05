// Simple page-by-page "magazine" viewer for the Revista project.

(function () {
  const pages = [
    { src: "assets/revista/portada%201.png", label: "Cover" },
    { src: "assets/revista/2.png", label: "2" },
    { src: "assets/revista/3.png", label: "3" },
    { src: "assets/revista/4.png", label: "4" },
    { src: "assets/revista/5.png", label: "5" },
    { src: "assets/revista/6.png", label: "6" },
    { src: "assets/revista/7.png", label: "7" },
    { src: "assets/revista/8.png", label: "8" },
    { src: "assets/revista/9.png", label: "9" },
    { src: "assets/revista/10.png", label: "10" },
    { src: "assets/revista/11.png", label: "11" },
    { src: "assets/revista/12.png", label: "12" },
  ];

  const pageImage = document.getElementById("magazine-page");
  const currentLabel = document.getElementById("magazine-current");
  const totalLabel = document.getElementById("magazine-total");
  const prevButton = document.querySelector(".magazine-prev");
  const nextButton = document.querySelector(".magazine-next");
  const thumbsWrap = document.getElementById("magazine-thumbs");

  if (!pageImage || !prevButton || !nextButton) return;

  let index = 0;

  totalLabel.textContent = pages.length;

  function render() {
    const page = pages[index];
    pageImage.src = page.src;
    pageImage.alt = "Revista, page " + page.label;
    currentLabel.textContent = page.label === "Cover" ? "Cover" : page.label;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === pages.length - 1;

    Array.from(thumbsWrap.children).forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  function goTo(newIndex) {
    index = Math.max(0, Math.min(pages.length - 1, newIndex));
    render();
  }

  prevButton.addEventListener("click", () => goTo(index - 1));
  nextButton.addEventListener("click", () => goTo(index + 1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(index - 1);
    if (event.key === "ArrowRight") goTo(index + 1);
  });

  pages.forEach((page, i) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "magazine-thumb";
    thumb.setAttribute("aria-label", "Go to page " + page.label);
    thumb.textContent = page.label === "Cover" ? "C" : page.label;
    thumb.addEventListener("click", () => goTo(i));
    thumbsWrap.appendChild(thumb);
  });

  render();
})();
