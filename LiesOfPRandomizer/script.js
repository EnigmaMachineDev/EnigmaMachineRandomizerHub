document.addEventListener('DOMContentLoaded', () => {
    const normalWeaponEl = document.getElementById('normal-weapon');
    const normalWeaponLink = document.getElementById('normal-weapon-link');
    const specialWeaponEl = document.getElementById('special-weapon');
    const specialWeaponLink = document.getElementById('special-weapon-link');
    const specialWeaponErgoEl = document.getElementById('special-weapon-ergo');
    const legionArmEl = document.getElementById('legion-arm');
    const legionArmLink = document.getElementById('legion-arm-link');
    const legionArmDescriptionEl = document.getElementById('legion-arm-description');
    const endingEl = document.getElementById('ending');
    const endingLink = document.getElementById('ending-link');
    const endingDescriptionEl = document.getElementById('ending-description');
    const includeDLCCheckbox = document.getElementById('include-dlc');

    const rerollNormalWeaponBtn = document.getElementById('reroll-normal-weapon');
    const rerollSpecialWeaponBtn = document.getElementById('reroll-special-weapon');
    const rerollLegionArmBtn = document.getElementById('reroll-legion-arm');
    const rerollEndingBtn = document.getElementById('reroll-ending');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let gameData;

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function getAvailableNormalWeapons() {
        if (!gameData) return [];
        const baseWeapons = gameData.base_game.normal_weapons || [];
        if (includeDLCCheckbox.checked && gameData.overture_dlc) {
            return [...baseWeapons, ...(gameData.overture_dlc.normal_weapons || [])];
        }
        return baseWeapons;
    }

    function getAvailableSpecialWeapons() {
        if (!gameData) return [];
        const baseWeapons = gameData.base_game.special_weapons || [];
        if (includeDLCCheckbox.checked && gameData.overture_dlc) {
            return [...baseWeapons, ...(gameData.overture_dlc.special_weapons || [])];
        }
        return baseWeapons;
    }

    function getAvailableLegionArms() {
        if (!gameData) return [];
        const baseArms = gameData.base_game.legion_arms || [];
        if (includeDLCCheckbox.checked && gameData.overture_dlc) {
            return [...baseArms, ...(gameData.overture_dlc.legion_arms || [])];
        }
        return baseArms;
    }

    function generateNormalWeapon() {
        const weapons = getAvailableNormalWeapons();
        if (weapons.length === 0) return;
        
        const randomWeapon = getRandomElement(weapons);
        normalWeaponEl.textContent = randomWeapon.name;
        normalWeaponLink.href = randomWeapon.url;
    }

    function generateSpecialWeapon() {
        const weapons = getAvailableSpecialWeapons();
        if (weapons.length === 0) return;
        
        const randomWeapon = getRandomElement(weapons);
        specialWeaponEl.textContent = randomWeapon.name;
        specialWeaponLink.href = randomWeapon.url;
        
        if (randomWeapon.required_ergo) {
            specialWeaponErgoEl.textContent = `Required: ${randomWeapon.required_ergo}`;
            specialWeaponErgoEl.style.display = 'block';
        } else {
            specialWeaponErgoEl.style.display = 'none';
        }
    }

    function generateLegionArm() {
        const arms = getAvailableLegionArms();
        if (arms.length === 0) return;
        
        const randomArm = getRandomElement(arms);
        legionArmEl.textContent = randomArm.name;
        legionArmLink.href = randomArm.url;
        
        if (randomArm.description) {
            legionArmDescriptionEl.textContent = randomArm.description;
            legionArmDescriptionEl.style.display = 'block';
        } else {
            legionArmDescriptionEl.style.display = 'none';
        }
    }

    function generateEnding() {
        if (!gameData || !gameData.endings) return;
        
        const randomEnding = getRandomElement(gameData.endings);
        endingEl.textContent = randomEnding.name;
        endingLink.href = randomEnding.url;
        
        let descriptionText = '';
        if (randomEnding.requirement) {
            descriptionText = `Requirement: ${randomEnding.requirement}`;
        }
        if (randomEnding.description) {
            if (descriptionText) descriptionText += '\n';
            descriptionText += randomEnding.description;
        }
        
        if (descriptionText) {
            endingDescriptionEl.textContent = descriptionText;
            endingDescriptionEl.style.display = 'block';
        } else {
            endingDescriptionEl.style.display = 'none';
        }
    }

    function randomizeAll() {
        generateNormalWeapon();
        generateSpecialWeapon();
        generateLegionArm();
        generateEnding();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            gameData = data;
            randomizeAll();

            rerollNormalWeaponBtn.addEventListener('click', generateNormalWeapon);
            rerollSpecialWeaponBtn.addEventListener('click', generateSpecialWeapon);
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
