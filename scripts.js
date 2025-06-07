// Dynamic navigation for previous and next chapters
function updateNavigation() {
    const currentChapter = document.body.classList.contains('chapter-1') ? 1 :
                           document.body.classList.contains('chapter-2') ? 2 : 0;

    const prevButton = document.querySelector('.prev-chapter');
    const nextButton = document.querySelector('.next-chapter');

    if (currentChapter > 1) {
        prevButton.href = `chapter-${currentChapter - 1}.html`;
    } else {
        prevButton.style.display = 'none'; // Hide previous button on the first chapter
    }

    if (currentChapter < 3) { // You can change this to the number of chapters you have
        nextButton.href = `chapter-${currentChapter + 1}.html`;
    } else {
        nextButton.style.display = 'none'; // Hide next button on the last chapter
    }
}

window.onload = updateNavigation;
