document.addEventListener('DOMContentLoaded', () => {
    let data = {};
    const STORAGE_KEY = 'smite2Options';
    let options = {};

    const godResultEl = document.getElementById('god-result');
    const roleResultEl = document.getElementById('role-result');
    const gamemodeResultEl = document.getElementById('gamemode-result');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollGodBtn = document.getElementById('reroll-god');
    const rerollRoleBtn = document.getElementById('reroll-role');
    const rerollGamemodeBtn = document.getElementById('reroll-gamemode');

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
            setupEventListeners();
        })
        .catch(error => console.error('Error fetching or parsing randomizer.json:', error));

    function setupEventListeners() {
        generateLoadoutBtn.addEventListener('click', rollAll);
        rerollGodBtn.addEventListener('click', rollGod);
        rerollRoleBtn.addEventListener('click', rollRole);
        rerollGamemodeBtn.addEventListener('click', rollGamemode);
    }

    function getRandomItem(arr) {
        if (!arr || arr.length === 0) {
            return null;
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) { }
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data[category]) return [];
        return data[category].filter(item => isEnabled(category, item));
    }

    function rollGod() {
        const enabledGods = getEnabledItems('gods');
        if (enabledGods.length === 0) {
            godResultEl.textContent = 'No gods selected';
            return;
        }
        const randomGod = getRandomItem(enabledGods);
        if (!randomGod) return;
        godResultEl.textContent = randomGod;
    }

    function rollRole() {
        const enabledRoles = getEnabledItems('roles');
        if (enabledRoles.length === 0) {
            roleResultEl.textContent = 'No roles selected';
            return;
        }
        const randomRole = getRandomItem(enabledRoles);
        if (!randomRole) return;
        roleResultEl.textContent = randomRole;
    }

    function rollGamemode() {
        const enabledGamemodes = getEnabledItems('gamemodes');
        if (enabledGamemodes.length === 0) {
            gamemodeResultEl.textContent = 'No game modes selected';
            return;
        }
        const randomGamemode = getRandomItem(enabledGamemodes);
        if (!randomGamemode) return;
        gamemodeResultEl.textContent = randomGamemode;
    }

    function rollAll() {
        rollGod();
        rollRole();
        rollGamemode();
    }

    function randomizeAll() {
        rollAll();
    }
});
