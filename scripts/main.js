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


    
});


document.addEventListener("DOMContentLoaded", () => {
  const headerPath = document.getElementById("header-line");
  const footerPath = document.getElementById("footer-line");

  let targetX = 0, currentX = 0;
  let targetY = 0, currentY = 0;

  window.addEventListener("mousemove", (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const offsetX = (e.clientX - centerX) / centerX;
    const offsetY = (e.clientY - centerY) / centerY;

    targetX = offsetX * 50;
    targetY = offsetY * 70;
  });

  function animateBothLines() {
    currentX += (targetX - currentX) * 0.7;
    currentY += (targetY - currentY) * 0.6;

    const newD = `
      M50,0 
      C${50 + currentX},${60 + currentY} 
       ${50 - currentX},${140 - currentY} 
       50,200
    `.trim();

    if (headerPath) headerPath.setAttribute("d", newD);
    if (footerPath) footerPath.setAttribute("d", newD);

    requestAnimationFrame(animateBothLines);
  }

  animateBothLines();
});


