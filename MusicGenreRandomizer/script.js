document.addEventListener('DOMContentLoaded', () => {
    const genreEl = document.getElementById('genre');
    const subgenreEl = document.getElementById('subgenre');
    const rerollGenreBtn = document.getElementById('reroll-genre');
    const rerollSubgenreBtn = document.getElementById('reroll-subgenre');
    const generateMusicBtn = document.getElementById('generate-music');

    let data = {};
    let currentGenre = '';

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            randomizeAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function setGenre() {
        const genres = Object.keys(data);
        currentGenre = getRandomValue(genres);
        
        genreEl.innerHTML = `<div class="genre-display">
            <h3>${currentGenre}</h3>
        </div>`;
        
        setSubgenre();
    }

    function setSubgenre() {
        if (!currentGenre || !data[currentGenre]) {
            subgenreEl.textContent = '';
            return;
        }
        
        const subgenres = data[currentGenre];
        const subgenre = getRandomValue(subgenres);
        
        subgenreEl.textContent = subgenre;
    }

    function randomizeAll() {
        setGenre();
    }

    rerollGenreBtn.addEventListener('click', setGenre);
    rerollSubgenreBtn.addEventListener('click', setSubgenre);
    generateMusicBtn.addEventListener('click', randomizeAll);

    function copyResults() {
        const sections = document.querySelectorAll('.container > .section');
        const lines = [];
        sections.forEach(section => {
            if (section.style.display === 'none') return;
            const header = section.querySelector('.section-header h2');
            if (!header) return;
            const label = header.textContent.trim();
            const itemContainer = section.querySelector('.item-container');
            if (!itemContainer) return;
            // Check for list items
            const listItems = itemContainer.querySelectorAll('li');
            let value = '';
            if (listItems.length > 0) {
                const items = Array.from(listItems).map(li => li.textContent.trim());
                value = items.join(', ');
            } else {
                value = itemContainer.textContent.trim();
            }
            if (value) {
                lines.push(label + ': ' + value);
            }
        });
        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-results');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    }

    document.getElementById('copy-results').addEventListener('click', copyResults);
});
