document.addEventListener('DOMContentLoaded', () => {
    const primaryWeaponEl = document.getElementById('primary-weapon');
    const primaryWeaponLink = document.getElementById('primary-weapon-link');
    const legionArmEl = document.getElementById('legion-arm');
    const legionArmLink = document.getElementById('legion-arm-link');
    const endingEl = document.getElementById('ending');
    const endingLink = document.getElementById('ending-link');
    const includeDLCCheckbox = document.getElementById('include-dlc');

    const rerollPrimaryWeaponBtn = document.getElementById('reroll-primary-weapon');
    const rerollLegionArmBtn = document.getElementById('reroll-legion-arm');
    const rerollEndingBtn = document.getElementById('reroll-ending');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let gameData;
    let data = {};
    const STORAGE_KEY = 'liesOfPOptions';
    let options = {};

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {}
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data[category]) return [];
        return data[category].filter(item => isEnabled(category, item.name));
    }

    function getAvailablePrimaryWeapons() {
        if (!gameData) return [];
        const baseNormal = gameData.base_game.normal_weapons || [];
        const baseSpecial = gameData.base_game.special_weapons || [];
        let allWeapons = [...baseNormal, ...baseSpecial];

        if (includeDLCCheckbox.checked && gameData.overture_dlc) {
            const dlcNormal = gameData.overture_dlc.normal_weapons || [];
            const dlcSpecial = gameData.overture_dlc.special_weapons || [];
            allWeapons = [...allWeapons, ...dlcNormal, ...dlcSpecial];
        }
        return allWeapons;
    }

    function getAvailableLegionArms() {
        if (!gameData) return [];
        const baseArms = gameData.base_game.legion_arms || [];
        if (includeDLCCheckbox.checked && gameData.overture_dlc) {
            return [...baseArms, ...(gameData.overture_dlc.legion_arms || [])];
        }
        return baseArms;
    }

    function generatePrimaryWeapon() {
        const weapons = getAvailablePrimaryWeapons();
        if (weapons.length === 0) return;
        
        const randomWeapon = getRandomElement(weapons);
        primaryWeaponEl.textContent = randomWeapon.name;
        primaryWeaponLink.href = randomWeapon.url;
    }

    function generateLegionArm() {
        const arms = getAvailableLegionArms();
        if (arms.length === 0) return;
        
        const randomArm = getRandomElement(arms);
        legionArmEl.textContent = randomArm.name;
        legionArmLink.href = randomArm.url;
    }

    function generateEnding() {
        if (!gameData || !gameData.endings) return;
        
        const randomEnding = getRandomElement(gameData.endings);
        endingEl.textContent = randomEnding.name;
        endingLink.href = randomEnding.url;
    }

    function randomizeAll() {
        generatePrimaryWeapon();
        generateLegionArm();
        generateEnding();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            gameData = data;
            loadOptions();randomizeAll();

            rerollPrimaryWeaponBtn.addEventListener('click', generatePrimaryWeapon);
            rerollLegionArmBtn.addEventListener('click', generateLegionArm);
            rerollEndingBtn.addEventListener('click', generateEnding);
            generateLoadoutBtn.addEventListener('click', randomizeAll);
            includeDLCCheckbox.addEventListener('change', randomizeAll);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load necessary data. Please check the console for more details and ensure the .json file is present and correctly formatted.');
        });
});
