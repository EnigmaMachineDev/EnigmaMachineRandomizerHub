document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-all');
    const rerollGameModeBtn = document.getElementById('reroll-game-mode');
    const rerollDifficultyBtn = document.getElementById('reroll-difficulty');
    const rerollWorldTypeBtn = document.getElementById('reroll-world-type');

    const gameModeEl = document.getElementById('game-mode');
    const difficultyEl = document.getElementById('difficulty');
    const worldTypeEl = document.getElementById('world-type');

    let data = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            generateAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateGameMode() {
        const items = data.categories['Game Mode'].items;
        if (items.length === 0) {
            gameModeEl.textContent = 'No game modes available';
            return;
        }
        gameModeEl.textContent = getRandomValue(items);
    }

    function generateDifficulty() {
        const items = data.categories['Difficulty'].items;
        if (items.length === 0) {
            difficultyEl.textContent = 'No difficulty available';
            return;
        }
        difficultyEl.textContent = getRandomValue(items);
    }

    function generateWorldType() {
        const items = data.categories['World Type'].items;
        if (items.length === 0) {
            worldTypeEl.textContent = 'No world types available';
            return;
        }
        worldTypeEl.textContent = getRandomValue(items);
    }

    function generateAll() {
        generateGameMode();
        generateDifficulty();
        generateWorldType();
    }

    generateBtn.addEventListener('click', generateAll);
    rerollGameModeBtn.addEventListener('click', generateGameMode);
    rerollDifficultyBtn.addEventListener('click', generateDifficulty);
    rerollWorldTypeBtn.addEventListener('click', generateWorldType);
});
