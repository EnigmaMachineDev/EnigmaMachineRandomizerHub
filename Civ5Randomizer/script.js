document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-all');
    const rerollLeaderBtn = document.getElementById('reroll-leader');
    const rerollVictoryBtn = document.getElementById('reroll-victory');
    const rerollDifficultyBtn = document.getElementById('reroll-difficulty');
    const rerollPaceBtn = document.getElementById('reroll-pace');
    const rerollMapBtn = document.getElementById('reroll-map');
    const rerollMapSizeBtn = document.getElementById('reroll-map-size');
    const dlcLeaderCheckbox = document.getElementById('dlc-leader');
    const dlcMapCheckbox = document.getElementById('dlc-map');

    const leaderEl = document.getElementById('leader');
    const victoryEl = document.getElementById('victory');
    const difficultyEl = document.getElementById('difficulty');
    const paceEl = document.getElementById('pace');
    const mapEl = document.getElementById('map');
    const mapSizeEl = document.getElementById('map-size');

    let data = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            generateAll();
        });

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateLeader() {
        let availableLeaders = data.leaders;
        if (!dlcLeaderCheckbox.checked) {
            availableLeaders = availableLeaders.filter(leader => !leader.dlc);
        }
        const selectedLeader = getRandomElement(availableLeaders);
        leaderEl.textContent = selectedLeader.name;
    }

    function generateVictory() {
        const selectedVictory = getRandomElement(data.victories);
        victoryEl.textContent = selectedVictory.name;
    }

    function generateDifficulty() {
        const selectedDifficulty = getRandomElement(data.difficulty);
        difficultyEl.textContent = selectedDifficulty.name;
    }

    function generatePace() {
        const selectedPace = getRandomElement(data.pace);
        paceEl.textContent = selectedPace.name;
    }

    function generateMap() {
        let availableMaps = data.maps;
        if (!dlcMapCheckbox.checked) {
            availableMaps = availableMaps.filter(map => !map.dlc);
        }
        const selectedMap = getRandomElement(availableMaps);
        mapEl.textContent = selectedMap.name;
    }

    function generateMapSize() {
        const selectedMapSize = getRandomElement(data.map_size);
        mapSizeEl.textContent = selectedMapSize.name;
    }

    function generateAll() {
        generateLeader();
        generateVictory();
        generateDifficulty();
        generatePace();
        generateMap();
        generateMapSize();
    }

    generateBtn.addEventListener('click', generateAll);
    rerollLeaderBtn.addEventListener('click', generateLeader);
    rerollVictoryBtn.addEventListener('click', generateVictory);
    rerollDifficultyBtn.addEventListener('click', generateDifficulty);
    rerollPaceBtn.addEventListener('click', generatePace);
    rerollMapBtn.addEventListener('click', generateMap);
    rerollMapSizeBtn.addEventListener('click', generateMapSize);
    dlcLeaderCheckbox.addEventListener('change', generateLeader);
    dlcMapCheckbox.addEventListener('change', generateMap);
});
