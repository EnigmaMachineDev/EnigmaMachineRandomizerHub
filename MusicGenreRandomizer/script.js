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
});
