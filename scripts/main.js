document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById('nav-logo');
  const hero = document.getElementById('hero');
  const scrollIndicator = document.getElementById('scroll-indicator');

  // Dodaj klasę visible po 2s
  setTimeout(() => {
    if (scrollIndicator) {
      scrollIndicator.classList.add('visible');
    }
  }, 2000);

  const observer = new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting;
    if (logo) logo.classList.toggle('hidden', visible);
    if (scrollIndicator) scrollIndicator.classList.toggle('fade-out', !visible);
  }, { threshold: 0.1 });

  if (hero) observer.observe(hero);

  // Scrollowanie po kliknięciu
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      document.getElementById('poems').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Wczytaj listę wierszy
  fetch("data/poems.json")
    .then(res => res.json())
    .then(poems => {
      const list = document.getElementById("poem-list");
      poems.forEach(poem => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `templates/poem.html?id=${poem.id}`;
        link.textContent = poem.title;
        li.appendChild(link);
        list.appendChild(li);
      });
    });
});
