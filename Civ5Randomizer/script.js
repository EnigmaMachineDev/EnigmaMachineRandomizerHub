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

    let data={};const STORAGE_KEY='civ5Options';let options={};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            generateAll();
        });

    function getRandomValue(arr){return arr[Math.floor(Math.random()*arr.length)];}
    function loadOptions(){const saved=localStorage.getItem(STORAGE_KEY);if(saved){try{options=JSON.parse(saved);}catch(e){}}}
    function isEnabled(category,name){if(!options[category])return true;if(!options[category].hasOwnProperty(name))return true;return options[category][name];}
    function getEnabledItems(category){if(!data[category])return[];return data[category].filter(item=>isEnabled(category,item.name));}

    function generateLeader() {
        let availableLeaders = getEnabledItems('leaders');
        if (!dlcLeaderCheckbox.checked) {
            availableLeaders = availableLeaders.filter(leader => !leader.dlc);
        }
        if (availableLeaders.length === 0) {
            leaderEl.textContent = 'No leaders available';
            return;
        }
        const selectedLeader = getRandomValue(availableLeaders);
        leaderEl.textContent = selectedLeader.name;
    }

    function generateVictory() {
        const enabled = getEnabledItems('victories');
        if (enabled.length === 0) {
            victoryEl.textContent = 'No victories selected';
            return;
        }
        const selectedVictory = getRandomValue(enabled);
        victoryEl.textContent = selectedVictory.name;
    }

    function generateDifficulty() {
        const enabled = getEnabledItems('difficulty');
        if (enabled.length === 0) {
            difficultyEl.textContent = 'No difficulty selected';
            return;
        }
        const selectedDifficulty = getRandomValue(enabled);
        difficultyEl.textContent = selectedDifficulty.name;
    }

    function generatePace() {
        const enabled = getEnabledItems('pace');
        if (enabled.length === 0) {
            paceEl.textContent = 'No pace selected';
            return;
        }
        const selectedPace = getRandomValue(enabled);
        paceEl.textContent = selectedPace.name;
    }

    function generateMap() {
        let availableMaps = getEnabledItems('maps');
        if (!dlcMapCheckbox.checked) {
            availableMaps = availableMaps.filter(map => !map.dlc);
        }
        if (availableMaps.length === 0) {
            mapEl.textContent = 'No maps selected';
            return;
        }
        const selectedMap = getRandomValue(availableMaps);
        mapEl.textContent = selectedMap.name;
    }

    function generateMapSize() {
        const enabled = getEnabledItems('map_size');
        if (enabled.length === 0) {
            mapSizeEl.textContent = 'No map size selected';
            return;
        }
        const selectedMapSize = getRandomValue(enabled);
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
