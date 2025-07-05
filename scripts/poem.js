// Pobierz ID z query parametru
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
  document.getElementById("poem-title").textContent = "Nie znaleziono wiersza";
  document.getElementById("poem-text").textContent = "Brak identyfikatora wiersza w adresie URL.";
} else {
  fetch("../data/poems.json")
    .then((response) => response.json())
    .then((poems) => {
      const poem = poems.find((p) => p.id === id);

      if (poem) {
        document.title = `lekARTswo | ${poem.title}`;
        document.getElementById("poem-title").textContent = poem.title;
        document.getElementById("poem-text").innerHTML = poem.text.replace(/\n/g, "<br>");

        const currentIndex = poems.findIndex((p) => p.id === id);

        // Obsługa linków: Poprzedni / Następny
        const prev = poems[currentIndex - 1];
        const next = poems[currentIndex + 1];

        const prevLink = document.getElementById("prev-poem");
        const nextLink = document.getElementById("next-poem");

        if (prev) {
          prevLink.href = `../templates/poem.html?id=${prev.id}`;
        } else {
          prevLink.style.display = "none";
        }

        if (next) {
          nextLink.href = `../templates/poem.html?id=${next.id}`;
        } else {
          nextLink.style.display = "none";
        }

        // Obsługa strzałek klawiatury (opcjonalnie)
        document.addEventListener("keydown", (event) => {
          if (event.key === "ArrowLeft" && prev) {
            window.location.href = `../templates/poem.html?id=${prev.id}`;
          }
          if (event.key === "ArrowRight" && next) {
            window.location.href = `../templates/poem.html?id=${next.id}`;
          }
        });

      } else {
        document.getElementById("poem-title").textContent = "Nie znaleziono wiersza";
        document.getElementById("poem-text").textContent = `Nie odnaleziono wiersza o ID "${id}".`;
      }
    })
    .catch((error) => {
      document.getElementById("poem-title").textContent = "Błąd wczytywania";
      document.getElementById("poem-text").textContent = "Nie udało się wczytać pliku z wierszami.";
      console.error(error);
    });
}
