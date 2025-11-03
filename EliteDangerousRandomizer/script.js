document.addEventListener('DOMContentLoaded', () => {
    const suitEl = document.getElementById('suit');
    const suitLinkEl = document.getElementById('suit-link');
    const primaryWeaponEl = document.getElementById('primary-weapon');
    const primaryWeaponLinkEl = document.getElementById('primary-weapon-link');
    const secondaryWeaponEl = document.getElementById('secondary-weapon');
    const secondaryWeaponLinkEl = document.getElementById('secondary-weapon-link');
    const shipEl = document.getElementById('ship');
    const shipLinkEl = document.getElementById('ship-link');
    const allegianceEl = document.getElementById('allegiance');
    const allegianceLinkEl = document.getElementById('allegiance-link');
    const activitiesListEl = document.getElementById('activities-list');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollSuitBtn = document.getElementById('reroll-suit');
    const rerollPrimaryWeaponBtn = document.getElementById('reroll-primary-weapon');
    const rerollSecondaryWeaponBtn = document.getElementById('reroll-secondary-weapon');
    const rerollShipBtn = document.getElementById('reroll-ship');
    const rerollAllegianceBtn = document.getElementById('reroll-allegiance');
    const rerollActivitiesBtn = document.getElementById('reroll-activities');

    let suitsData;
    let primaryWeaponsData;
    let secondaryWeaponsData;
    let shipsData;
    let allegiancesData;
    let activitiesData;

    const STORAGE_KEY = 'eliteDangerousOptions';
    let options = {};

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading options:', e);
                options = {};
            }
        }
    }

    function isEnabled(category, id) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(id)) return true;
        return options[category][id];
    }

    function getEnabledItems(category, allItems) {
        return allItems.filter(item => {
            const id = item.name || item;
            return isEnabled(category, id);
        });
    }

    function generateSuit() {
        if (!suitsData) return;
        const enabledSuits = getEnabledItems('suits', suitsData);
        if (enabledSuits.length === 0) return;
        const randomSuit = getRandomElement(enabledSuits);
        suitEl.textContent = randomSuit.name;
        suitLinkEl.href = randomSuit.link;
    }

    function generatePrimaryWeapon() {
        if (!primaryWeaponsData) return;
        const enabledWeapons = getEnabledItems('primary_weapons', primaryWeaponsData);
        if (enabledWeapons.length === 0) return;
        const randomWeapon = getRandomElement(enabledWeapons);
        primaryWeaponEl.textContent = randomWeapon.name;
        primaryWeaponLinkEl.href = randomWeapon.link;
    }

    function generateSecondaryWeapon() {
        if (!secondaryWeaponsData) return;
        const enabledWeapons = getEnabledItems('secondary_weapons', secondaryWeaponsData);
        if (enabledWeapons.length === 0) return;
        const randomWeapon = getRandomElement(enabledWeapons);
        secondaryWeaponEl.textContent = randomWeapon.name;
        secondaryWeaponLinkEl.href = randomWeapon.link;
    }

    function generateShip() {
        if (!shipsData) return;
        const enabledShips = getEnabledItems('ships', shipsData);
        if (enabledShips.length === 0) return;
        const randomShip = getRandomElement(enabledShips);
        shipEl.textContent = randomShip.name;
        shipLinkEl.href = randomShip.link;
    }

    function generateAllegiance() {
        if (!allegiancesData) return;
        const enabledAllegiances = getEnabledItems('allegiances', allegiancesData);
        if (enabledAllegiances.length === 0) return;
        const randomAllegiance = getRandomElement(enabledAllegiances);
        allegianceEl.textContent = randomAllegiance.name;
        allegianceLinkEl.href = randomAllegiance.link;
    }

    function generateActivities() {
        if (!activitiesData) return;
        const enabledActivities = getEnabledItems('activities', activitiesData);
        if (enabledActivities.length === 0) return;
        
        const numberOfActivities = Math.min(Math.floor(Math.random() * 3) + 2, enabledActivities.length);
        const selectedActivities = [];
        const activitiesCopy = [...enabledActivities];

        for (let i = 0; i < numberOfActivities; i++) {
            if (activitiesCopy.length === 0) break;
            const randomIndex = Math.floor(Math.random() * activitiesCopy.length);
            selectedActivities.push(activitiesCopy.splice(randomIndex, 1)[0]);
        }

        activitiesListEl.innerHTML = '';
        selectedActivities.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${activity.link}" target="_blank">${activity.name}</a>`;
            activitiesListEl.appendChild(li);
        });
    }

    function generateAll() {
        generateSuit();
        generatePrimaryWeapon();
        generateSecondaryWeapon();
        generateShip();
        generateAllegiance();
        generateActivities();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            suitsData = data.suits;
            primaryWeaponsData = data.primary_weapons;
            secondaryWeaponsData = data.secondary_weapons;
            shipsData = data.ships;
            allegiancesData = data.allegiances;
            activitiesData = data.activities;

            loadOptions();
            generateAll();

            generateLoadoutBtn.addEventListener('click', generateAll);
            rerollSuitBtn.addEventListener('click', generateSuit);
            rerollPrimaryWeaponBtn.addEventListener('click', generatePrimaryWeapon);
            rerollSecondaryWeaponBtn.addEventListener('click', generateSecondaryWeapon);
            rerollShipBtn.addEventListener('click', generateShip);
            rerollAllegianceBtn.addEventListener('click', generateAllegiance);
            rerollActivitiesBtn.addEventListener('click', generateActivities);
        })
        .catch(error => console.error('Error loading data:', error));
});
