document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  });

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

        const h2 = document.createElement('h2');
        h2.textContent = poem.title;

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

        // === Kursor reaguje na menu ===
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

      // Podświetlanie aktywnego wiersza
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
      }, {
        threshold: 0.6
      });

      poemSections.forEach(section => observer.observe(section));
    })
    .catch(error => console.error('Błąd wczytywania wierszy:', error));

    document.addEventListener('mousedown', () => {
  cursor.classList.add('clicking');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('clicking');
});
    
});


document.addEventListener("DOMContentLoaded", () => {
  const headerPath = document.getElementById("header-line");
  const footerPath = document.getElementById("footer-line");

  let mouseOffsetX = 0;
  let mouseOffsetY = 0;

  window.addEventListener("mousemove", (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseOffsetX = (e.clientX - centerX) / centerX; // -1 to 1
    mouseOffsetY = (e.clientY - centerY) / centerY;
  });

  let t = 0; // do animacji falowania

  function animateLines() {
    t += 0.03; // tempo falowania

    // Fala bazowa
    const waveX = Math.sin(t) * 45;
    const waveY = Math.cos(t * 0.9) * 50;

    // Ruch myszki
    const bendX = mouseOffsetX * 55;
    const bendY = mouseOffsetY * 70;

    // Finalne punkty kontrolne
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
});
