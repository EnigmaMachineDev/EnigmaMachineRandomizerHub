document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-all');
    const rerollGameModeBtn = document.getElementById('reroll-game-mode');
    const rerollDifficultyBtn = document.getElementById('reroll-difficulty');
    const rerollWorldTypeBtn = document.getElementById('reroll-world-type');

    const gameModeEl = document.getElementById('game-mode');
    const difficultyEl = document.getElementById('difficulty');
    const worldTypeEl = document.getElementById('world-type');

    let data = {};
    const STORAGE_KEY = 'minecraftOptions';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            generateAll();
        });

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading options:', e);
            }
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data.categories || !data.categories[category]) return [];
        return data.categories[category].items.filter(item => isEnabled(category, item));
    }

    function generateGameMode() {
        const items = getEnabledItems('Game Mode');
        if (items.length === 0) {
            gameModeEl.textContent = 'No game modes available';
            return;
        }
        gameModeEl.textContent = getRandomValue(items);
    }

    function generateDifficulty() {
        const items = getEnabledItems('Difficulty');
        if (items.length === 0) {
            difficultyEl.textContent = 'No difficulty available';
            return;
        }
        difficultyEl.textContent = getRandomValue(items);
    }

    function generateWorldType() {
        const items = getEnabledItems('World Type');
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
