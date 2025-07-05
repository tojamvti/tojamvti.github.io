document.addEventListener('DOMContentLoaded', () => {
  // === KURSOR ===
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let lastX = mouseX;
  let lastY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.add('hidden');
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.remove('hidden');
  });

  function animate() {
    const velocityX = mouseX - lastX;
    const velocityY = mouseY - lastY;
    lastX = mouseX;
    lastY = mouseY;

    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;

    const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    const stretch = 1 + Math.min(speed / 40, 0.35);
    const angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);

    let scale = cursor.classList.contains('clicking') ? 0.8 : 1;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${stretch * scale}, ${scale})`;

    requestAnimationFrame(animate);
  }
  animate();

  // === Wczytywanie wierszy ===
  fetch('data/poems.json')
    .then(res => res.json())
    .then(poems => {
      const content = document.getElementById('poem-content');
      const sidebar = document.getElementById('poem-sidebar');
      const ul = document.createElement('ul');

      poems.forEach((poem, index) => {
        const section = document.createElement('section');
        section.classList.add('poem-section');
        section.id = `poem-${index}`;

        const p = document.createElement('p');
        p.innerHTML = poem.text.replace(/\n/g, '<br>');
        section.appendChild(p);
        content.appendChild(section);

        const li = document.createElement('li');
        li.textContent = poem.title;
        li.dataset.target = `poem-${index}`;
        li.addEventListener('click', () => {
          document.getElementById(li.dataset.target).scrollIntoView({ behavior: 'smooth' });
        });

        li.addEventListener('mouseenter', () => {
          cursor.classList.add('small');
          cursor.classList.remove('hidden');
        });

        li.addEventListener('mouseleave', () => {
          cursor.classList.remove('small');
        });

        ul.appendChild(li);
      });

      sidebar.appendChild(ul);

      const poemSections = document.querySelectorAll('.poem-section');
      const menuItems = ul.querySelectorAll('li');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(poemSections).indexOf(entry.target);
            menuItems.forEach(li => li.classList.remove('active'));
            if (menuItems[index]) {
              menuItems[index].classList.add('active');
            }
          }
        });
      }, { threshold: 0.6 });

      poemSections.forEach(section => observer.observe(section));
    })
    .catch(err => console.error('Błąd ładowania wierszy:', err));

  // === Animacja linii SVG ===
  const headerPath = document.getElementById("header-line");
  const footerPath = document.getElementById("footer-line");

  let t = 0;
  let mouseOffsetX = 0;
  let mouseOffsetY = 0;

  window.addEventListener("mousemove", (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseOffsetX = (e.clientX - centerX) / centerX;
    mouseOffsetY = (e.clientY - centerY) / centerY;
  });

  function animateLines() {
    t += 0.03;
    const waveX = Math.sin(t) * 45;
    const waveY = Math.cos(t * 0.9) * 50;

    const bendX = mouseOffsetX * 55;
    const bendY = mouseOffsetY * 70;

    const cx1 = 50 + waveX + bendX;
    const cy1 = 60 + waveY + bendY;
    const cx2 = 50 - waveX + bendX;
    const cy2 = 140 - waveY + bendY;

    const newD = `M50,0 C${cx1},${cy1} ${cx2},${cy2} 50,200`;

    if (headerPath) headerPath.setAttribute("d", newD);
    if (footerPath) footerPath.setAttribute("d", newD);

    requestAnimationFrame(animateLines);
  }

  animateLines();

  // === Scrollowanie sekcji wierszy + logo / footer ===
  const scrollZone = document.querySelector('.poems-section');
  const container = document.getElementById('poem-content');
  const logoSection = document.querySelector('.logo-section');
  const footerSection = document.querySelector('.poem-footer');

  let sections = [];

  setTimeout(() => {
    sections = Array.from(container.querySelectorAll('.poem-section'));
  }, 500);

  let currentIndex = 0;
  let isScrolling = false;

  scrollZone.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrolling || sections.length === 0) return;

    const atTop = currentIndex === 0;
    const atBottom = currentIndex === sections.length - 1;

    if (e.deltaY < 0 && atTop) {
      logoSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (e.deltaY > 0 && atBottom) {
      footerSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    isScrolling = true;

    if (e.deltaY > 0 && !atBottom) currentIndex++;
    else if (e.deltaY < 0 && !atTop) currentIndex--;

    sections[currentIndex].scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      isScrolling = false;
    });
  }, { passive: false });
});
