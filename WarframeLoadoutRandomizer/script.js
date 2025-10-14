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

    function generateWarframe() {
        if (!warframesData) return;
        const randomWarframe = getRandomElement(warframesData);
        warframeEl.textContent = randomWarframe.name;
        warframeLink.href = randomWarframe.link;
    }

    function generatePrimary() {
        if (!primaryWeaponsData) return;
        const randomPrimary = getRandomElement(primaryWeaponsData);
        primaryEl.textContent = randomPrimary.name;
        primaryLink.href = randomPrimary.link;
    }

    function generateSecondary() {
        if (!secondaryWeaponsData) return;
        const randomSecondary = getRandomElement(secondaryWeaponsData);
        secondaryEl.textContent = randomSecondary.name;
        secondaryLink.href = randomSecondary.link;
    }

    function generateMelee() {
        if (!meleeWeaponsData) return;
        const randomMelee = getRandomElement(meleeWeaponsData);
        meleeEl.textContent = randomMelee.name;
        meleeLink.href = randomMelee.link;
    }

    function generatePet() {
        if (!petsData) return;
        const randomPet = getRandomElement(petsData);
        petEl.textContent = randomPet.name;
        petLink.href = randomPet.link;
    }

    function generateFocus() {
        if (!focusData) return;
        const randomFocus = getRandomElement(focusData);
        focusEl.textContent = randomFocus.name;
        focusLink.href = randomFocus.link;
    }

    function generateAmp() {
        if (!ampsData) return;
        const randomAmp = getRandomElement(ampsData);
        ampEl.textContent = randomAmp.name;
        ampLink.href = randomAmp.link;
    }

    function generateArchwing() {
        if (!archwingsData) return;
        const randomArchwing = getRandomElement(archwingsData);
        archwingEl.textContent = randomArchwing.name;
        archwingLink.href = randomArchwing.link;
    }

    function generateArchgun() {
        if (!archgunsData) return;
        const randomArchgun = getRandomElement(archgunsData);
        archgunEl.textContent = randomArchgun.name;
        archgunLink.href = randomArchgun.link;
    }

    function generateArchmelee() {
        if (!archMeleesData) return;
        const randomArchmelee = getRandomElement(archMeleesData);
        archmeleeEl.textContent = randomArchmelee.name;
        archmeleeLink.href = randomArchmelee.link;
    }

    function generateNecramech() {
        if (!necramechsData) return;
        const randomNecramech = getRandomElement(necramechsData);
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

            randomizeAll();

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
