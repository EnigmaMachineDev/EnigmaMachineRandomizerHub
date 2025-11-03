document.addEventListener('DOMContentLoaded', () => {
    const warframeEl = document.getElementById('warframe');
    const primaryEl = document.getElementById('primary');
    const secondaryEl = document.getElementById('secondary');
    const meleeEl = document.getElementById('melee');
    const petEl = document.getElementById('pet');
    const focusEl = document.getElementById('focus');
    const ampEl = document.getElementById('amp');
    const archwingEl = document.getElementById('archwing');
    const archgunEl = document.getElementById('archgun');
    const archmeleeEl = document.getElementById('archmelee');
    const necramechEl = document.getElementById('necramech');

    const warframeLink = document.getElementById('warframe-link');
    const primaryLink = document.getElementById('primary-link');
    const secondaryLink = document.getElementById('secondary-link');
    const meleeLink = document.getElementById('melee-link');
    const petLink = document.getElementById('pet-link');
    const focusLink = document.getElementById('focus-link');
    const ampLink = document.getElementById('amp-link');
    const archwingLink = document.getElementById('archwing-link');
    const archgunLink = document.getElementById('archgun-link');
    const archmeleeLink = document.getElementById('archmelee-link');
    const necramechLink = document.getElementById('necramech-link');

    const rerollWarframeBtn = document.getElementById('reroll-warframe');
    const rerollPrimaryBtn = document.getElementById('reroll-primary');
    const rerollSecondaryBtn = document.getElementById('reroll-secondary');
    const rerollMeleeBtn = document.getElementById('reroll-melee');
    const rerollPetBtn = document.getElementById('reroll-pet');
    const rerollFocusBtn = document.getElementById('reroll-focus');
    const rerollAmpBtn = document.getElementById('reroll-amp');
    const rerollArchwingBtn = document.getElementById('reroll-archwing');
    const rerollArchgunBtn = document.getElementById('reroll-archgun');
    const rerollArchmeleeBtn = document.getElementById('reroll-archmelee');
    const rerollNecramechBtn = document.getElementById('reroll-necramech');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let warframesData;
    let primaryWeaponsData;
    let secondaryWeaponsData;
    let meleeWeaponsData;
    let petsData;
    let focusData;
    let ampsData;
    let archwingsData;
    let archgunsData;
    let archMeleesData;
    let necramechsData;

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const STORAGE_KEY = 'warframeOptions';
    let options = {};

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

    function generateWarframe() {
        if (!warframesData) return;
        const randomWarframe = getRandomElement(getEnabledItems('Warframes'));
        warframeEl.textContent = randomWarframe.name;
        warframeLink.href = randomWarframe.link;
    }

    function generatePrimary() {
        if (!primaryWeaponsData) return;
        const randomPrimary = getRandomElement(getEnabledItems('Primary Weapons'));
        primaryEl.textContent = randomPrimary.name;
        primaryLink.href = randomPrimary.link;
    }

    function generateSecondary() {
        if (!secondaryWeaponsData) return;
        const randomSecondary = getRandomElement(getEnabledItems('Secondary Weapons'));
        secondaryEl.textContent = randomSecondary.name;
        secondaryLink.href = randomSecondary.link;
    }

    function generateMelee() {
        if (!meleeWeaponsData) return;
        const randomMelee = getRandomElement(getEnabledItems('Melee Weapons'));
        meleeEl.textContent = randomMelee.name;
        meleeLink.href = randomMelee.link;
    }

    function generatePet() {
        if (!petsData) return;
        const randomPet = getRandomElement(getEnabledItems('Pets'));
        petEl.textContent = randomPet.name;
        petLink.href = randomPet.link;
    }

    function generateFocus() {
        if (!focusData) return;
        const randomFocus = getRandomElement(getEnabledItems('Focus'));
        focusEl.textContent = randomFocus.name;
        focusLink.href = randomFocus.link;
    }

    function generateAmp() {
        if (!ampsData) return;
        const randomAmp = getRandomElement(getEnabledItems('Amps'));
        ampEl.textContent = randomAmp.name;
        ampLink.href = randomAmp.link;
    }

    function generateArchwing() {
        if (!archwingsData) return;
        const randomArchwing = getRandomElement(getEnabledItems('Archwings'));
        archwingEl.textContent = randomArchwing.name;
        archwingLink.href = randomArchwing.link;
    }

    function generateArchgun() {
        if (!archgunsData) return;
        const randomArchgun = getRandomElement(getEnabledItems('Archgun'));
        archgunEl.textContent = randomArchgun.name;
        archgunLink.href = randomArchgun.link;
    }

    function generateArchmelee() {
        if (!archMeleesData) return;
        const randomArchmelee = getRandomElement(getEnabledItems('Arch Melees'));
        archmeleeEl.textContent = randomArchmelee.name;
        archmeleeLink.href = randomArchmelee.link;
    }

    function generateNecramech() {
        if (!necramechsData) return;
        const randomNecramech = getRandomElement(getEnabledItems('Necramech'));
        necramechEl.textContent = randomNecramech.name;
        necramechLink.href = randomNecramech.link;
    }

    function randomizeAll() {
        generateWarframe();
        generatePrimary();
        generateSecondary();
        generateMelee();
        generatePet();
        generateFocus();
        generateAmp();
        generateArchwing();
        generateArchgun();
        generateArchmelee();
        generateNecramech();
    }

    let data = {};
    loadOptions();

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            warframesData = data.Warframes;
            primaryWeaponsData = data['Primary Weapons'];
            secondaryWeaponsData = data['Secondary Weapons'];
            meleeWeaponsData = data['Melee Weapons'];
            petsData = data.Pets;
            focusData = data.Focus;
            ampsData = data.Amps;
            archwingsData = data.Archwings;
            archgunsData = data.Archgun;
            archMeleesData = data['Arch Melees'];
            necramechsData = data.Necramech;

            loadOptions();randomizeAll();

            rerollWarframeBtn.addEventListener('click', generateWarframe);
            rerollPrimaryBtn.addEventListener('click', generatePrimary);
            rerollSecondaryBtn.addEventListener('click', generateSecondary);
            rerollMeleeBtn.addEventListener('click', generateMelee);
            rerollPetBtn.addEventListener('click', generatePet);
            rerollFocusBtn.addEventListener('click', generateFocus);
            rerollAmpBtn.addEventListener('click', generateAmp);
            rerollArchwingBtn.addEventListener('click', generateArchwing);
            rerollArchgunBtn.addEventListener('click', generateArchgun);
            rerollArchmeleeBtn.addEventListener('click', generateArchmelee);
            rerollNecramechBtn.addEventListener('click', generateNecramech);
            generateLoadoutBtn.addEventListener('click', randomizeAll);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load necessary data. Please check the console for more details and ensure the .json file is present and correctly formatted.');
        });
});
