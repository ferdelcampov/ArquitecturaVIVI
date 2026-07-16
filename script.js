const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    projects.forEach((project) => {
      const matches = filter === 'todos' || project.dataset.category === filter;
      project.classList.toggle('hidden', !matches);
    });
  });
});