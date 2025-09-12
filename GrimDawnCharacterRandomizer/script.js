document.addEventListener('DOMContentLoaded', () => {
    const classNameEl = document.getElementById('class-name');
    const abilitiesListEl = document.getElementById('abilities-list');
    const weaponTypeEl = document.getElementById('weapon-type');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollClassBtn = document.getElementById('reroll-class');
    const rerollAbilitiesBtn = document.getElementById('reroll-abilities');
    const rerollWeaponBtn = document.getElementById('reroll-weapon');

    let characterData = null;
    let selectedClass = null;
    let selectedAbilities = [];
    let compatibleWeapons = [];

    async function loadData() {
        try {
            const response = await fetch('randomizer.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            characterData = await response.json();
            generateCharacter();
        } catch (error) {
            console.error("Failed to load character data:", error);
        }
    }

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateClass() {
        const { classes } = characterData;
        selectedClass = getRandomElement(classes);
        classNameEl.textContent = `${selectedClass.className} (${selectedClass.masteries.join(', ')})`;
    }

    function generateAbilitiesAndWeapon() {
        const { abilities: masteryAbilities } = characterData;
        let potentialAbilities = masteryAbilities
            .filter(m => selectedClass.masteries.includes(m.masteryName))
            .flatMap(m => m.abilityList);

        const focusAbilityCount = Math.floor(Math.random() * 3) + 1;
        selectedAbilities = [];
        compatibleWeapons = [];

        for (let i = 0; i < focusAbilityCount; i++) {
            if (potentialAbilities.length === 0) break;

            const abilityIndex = Math.floor(Math.random() * potentialAbilities.length);
            const selectedAbility = potentialAbilities[abilityIndex];
            selectedAbilities.push(selectedAbility);

            potentialAbilities.splice(abilityIndex, 1);

            if (i === 0) {
                compatibleWeapons = [...selectedAbility.compatibleWeapons];
            } else {
                compatibleWeapons = compatibleWeapons.filter(weapon => selectedAbility.compatibleWeapons.includes(weapon));
            }

            potentialAbilities = potentialAbilities.filter(ability =>
                ability.compatibleWeapons.some(weapon => compatibleWeapons.includes(weapon))
            );
        }

        displayAbilities();
        generateWeapon();
    }

    function generateWeapon() {
        const selectedWeapon = compatibleWeapons.length > 0
            ? getRandomElement(compatibleWeapons)
            : "Any";
        weaponTypeEl.textContent = selectedWeapon;
    }

    function generateCharacter() {
        generateClass();
        generateAbilitiesAndWeapon();
    }

    function displayAbilities() {
        abilitiesListEl.innerHTML = '';
        if (selectedAbilities.length > 0) {
            selectedAbilities.forEach(ability => {
                const li = document.createElement('li');
                li.textContent = ability.name;
                abilitiesListEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'None';
            abilitiesListEl.appendChild(li);
        }
    }

    generateLoadoutBtn.addEventListener('click', generateCharacter);
    rerollClassBtn.addEventListener('click', () => {
        generateClass();
        generateAbilitiesAndWeapon();
    });
    rerollAbilitiesBtn.addEventListener('click', generateAbilitiesAndWeapon);
    rerollWeaponBtn.addEventListener('click', generateWeapon);

    loadData();
});