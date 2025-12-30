document.addEventListener('DOMContentLoaded', () => {
    const primaryWeaponEl = document.getElementById('primary-weapon');
    const primaryWeaponLink = document.getElementById('primary-weapon-link');
    const legionArmEl = document.getElementById('legion-arm');
    const legionArmLink = document.getElementById('legion-arm-link');
    const endingEl = document.getElementById('ending');
    const endingLink = document.getElementById('ending-link');

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
        const allWeapons = [];
        
        if (gameData.base_game) {
            if (gameData.base_game.normal_weapons) {
                gameData.base_game.normal_weapons.forEach(w => {
                    if (isEnabled('weapons', w.name)) allWeapons.push(w);
                });
            }
            if (gameData.base_game.special_weapons) {
                gameData.base_game.special_weapons.forEach(w => {
                    if (isEnabled('weapons', w.name)) allWeapons.push(w);
                });
            }
        }
        
        if (gameData.overture_dlc) {
            if (gameData.overture_dlc.normal_weapons) {
                gameData.overture_dlc.normal_weapons.forEach(w => {
                    if (isEnabled('weapons', w.name)) allWeapons.push(w);
                });
            }
            if (gameData.overture_dlc.special_weapons) {
                gameData.overture_dlc.special_weapons.forEach(w => {
                    if (isEnabled('weapons', w.name)) allWeapons.push(w);
                });
            }
        }
        
        return allWeapons;
    }

    function getAvailableLegionArms() {
        if (!gameData) return [];
        const allArms = [];
        
        if (gameData.base_game && gameData.base_game.legion_arms) {
            gameData.base_game.legion_arms.forEach(a => {
                if (isEnabled('legion_arms', a.name)) allArms.push(a);
            });
        }
        
        if (gameData.overture_dlc && gameData.overture_dlc.legion_arms) {
            gameData.overture_dlc.legion_arms.forEach(a => {
                if (isEnabled('legion_arms', a.name)) allArms.push(a);
            });
        }
        
        return allArms;
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
        
        const enabledEndings = gameData.endings.filter(e => isEnabled('endings', e.name));
        if (enabledEndings.length === 0) return;
        
        const randomEnding = getRandomElement(enabledEndings);
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
            loadOptions();
            randomizeAll();

            rerollPrimaryWeaponBtn.addEventListener('click', generatePrimaryWeapon);
            rerollLegionArmBtn.addEventListener('click', generateLegionArm);
            rerollEndingBtn.addEventListener('click', generateEnding);
            generateLoadoutBtn.addEventListener('click', randomizeAll);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load necessary data. Please check the console for more details and ensure the .json file is present and correctly formatted.');
        });
});
