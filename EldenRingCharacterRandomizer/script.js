document.addEventListener('DOMContentLoaded', () => {
    const weaponEl = document.getElementById('weapon');
    const weaponLinkEl = document.getElementById('weapon-link');
    const armorEl = document.getElementById('armor');
    const armorLinkEl = document.getElementById('armor-link');
    const spiritAshesListEl = document.getElementById('spirit-ashes-list');
    const spellsListEl = document.getElementById('spells-list');
    const spellTypeLabelEl = document.getElementById('spell-type-label');
    const casterWeaponEl = document.getElementById('caster-weapon');
    const casterWeaponLinkEl = document.getElementById('caster-weapon-link');
    const casterWeaponSectionEl = document.getElementById('caster-weapon-section');
    const endingEl = document.getElementById('ending');
    const endingLinkEl = document.getElementById('ending-link');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollWeaponBtn = document.getElementById('reroll-weapon');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollSpiritAshesBtn = document.getElementById('reroll-spirit-ashes');
    const rerollSpellsBtn = document.getElementById('reroll-spells');
    const rerollCasterWeaponBtn = document.getElementById('reroll-caster-weapon');
    const rerollEndingBtn = document.getElementById('reroll-ending');

    let primaryWeaponData;
    let armorData;
    let spiritAshesData;
    let eldenRingSpellsData;
    let eldenRingCastingWeaponsData;
    let endingsData;

    let currentSpellType = '';
    const STORAGE_KEY = 'eldenRingOptions';
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
        if (Array.isArray(allItems)) {
            return allItems.filter(item => {
                const id = item.name || item;
                return isEnabled(category, id);
            });
        } else {
            // For objects like weapons
            return Object.keys(allItems).filter(key => isEnabled(category, key));
        }
    }

    function generateWeapon() {
        if (!primaryWeaponData) return;
        const enabledWeapons = getEnabledItems('weapons', primaryWeaponData);
        if (enabledWeapons.length === 0) return;
        const randomWeaponName = getRandomElement(enabledWeapons);
        const randomWeaponLink = primaryWeaponData[randomWeaponName];
        weaponEl.textContent = randomWeaponName;
        weaponLinkEl.href = randomWeaponLink;
    }

    function generateArmor() {
        if (!armorData) return;
        // Combine all armor types into one pool
        const allArmor = [...armorData.light, ...armorData.medium, ...armorData.heavy];
        const enabledArmor = allArmor.filter(armor => isEnabled('armor', armor.name));
        if (enabledArmor.length === 0) return;
        
        const randomArmorSet = getRandomElement(enabledArmor);
        armorEl.textContent = randomArmorSet.name;
        armorLinkEl.href = randomArmorSet.link;
    }

    function generateSpiritAshes() {
        if (!spiritAshesData) return;
        const enabledSpirits = getEnabledItems('spirit_ashes', spiritAshesData);
        if (enabledSpirits.length === 0) return;
        
        const numberOfSpiritAshes = Math.min(Math.floor(Math.random() * 5) + 1, enabledSpirits.length);
        const selectedSpiritAshes = [];
        const spiritAshesCopy = [...enabledSpirits];

        for (let i = 0; i < numberOfSpiritAshes; i++) {
            if (spiritAshesCopy.length === 0) break;
            const randomIndex = Math.floor(Math.random() * spiritAshesCopy.length);
            selectedSpiritAshes.push(spiritAshesCopy.splice(randomIndex, 1)[0]);
        }

        spiritAshesListEl.innerHTML = '';
        selectedSpiritAshes.forEach(ash => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${ash.link}" target="_blank">${ash.name}</a>`;
            spiritAshesListEl.appendChild(li);
        });
    }

    function generateSpells() {
        if (!eldenRingSpellsData) return;

        const spellRoll = Math.floor(Math.random() * 3) + 1;
        let selectedSpells = [];

        if (spellRoll === 2) { // Sorceries
            currentSpellType = '(Sorceries)';
            const sorceries = eldenRingSpellsData.filter(spell => spell.type === 'Sorcery');
            const enabledSorceries = getEnabledItems('spells', sorceries);
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledSorceries.length);
            const spellsCopy = [...enabledSorceries];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else if (spellRoll === 3) { // Incantations
            currentSpellType = '(Incantations)';
            const incantations = eldenRingSpellsData.filter(spell => spell.type === 'Incantation');
            const enabledIncantations = getEnabledItems('spells', incantations);
            const numberOfSpells = Math.min(Math.floor(Math.random() * 3) + 1, enabledIncantations.length);
            const spellsCopy = [...enabledIncantations];
            for (let i = 0; i < numberOfSpells; i++) {
                if (spellsCopy.length === 0) break;
                const randomIndex = Math.floor(Math.random() * spellsCopy.length);
                selectedSpells.push(spellsCopy.splice(randomIndex, 1)[0]);
            }
        } else { // None
            currentSpellType = '(None)';
        }

        spellsListEl.innerHTML = '';
        if (selectedSpells.length > 0) {
            selectedSpells.forEach(spell => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${spell.link}" target="_blank">${spell.name}</a>`;
                spellsListEl.appendChild(li);
            });
        }

        spellTypeLabelEl.textContent = `Spells: ${currentSpellType}`;
        generateCasterWeapon();
    }

    function generateCasterWeapon() {
        if (!eldenRingCastingWeaponsData || currentSpellType === '(None)') {
            casterWeaponSectionEl.style.display = 'none';
            return;
        }
        casterWeaponSectionEl.style.display = 'block';

        let casterWeaponName = 'None';
        let casterWeaponLink = '#';

        if (currentSpellType === '(Sorceries)') {
            const enabledStaffs = getEnabledItems('staffs', eldenRingCastingWeaponsData.staffs);
            if (enabledStaffs.length > 0) {
                const randomStaff = getRandomElement(enabledStaffs);
                casterWeaponName = randomStaff.name;
                casterWeaponLink = randomStaff.url;
            }
        } else if (currentSpellType === '(Incantations)') {
            const enabledSeals = getEnabledItems('seals', eldenRingCastingWeaponsData.seals);
            if (enabledSeals.length > 0) {
                const randomSeal = getRandomElement(enabledSeals);
                casterWeaponName = randomSeal.name;
                casterWeaponLink = randomSeal.url;
            }
        }

        casterWeaponEl.textContent = casterWeaponName;
        casterWeaponLinkEl.href = casterWeaponLink;
    }

    function generateEnding() {
        if (!endingsData) return;
        const enabledEndings = getEnabledItems('endings', endingsData);
        if (enabledEndings.length === 0) return;
        const randomEnding = getRandomElement(enabledEndings);
        endingEl.textContent = randomEnding.name;
        endingLinkEl.href = randomEnding.link;
    }

    function generateAll() {
        generateWeapon();
        generateArmor();
        generateSpiritAshes();
        generateSpells();
        generateEnding();
    }

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            primaryWeaponData = data.weapons;
            armorData = data.armor;
            spiritAshesData = data.spirit_ashes;
            eldenRingSpellsData = data.spells;
            eldenRingCastingWeaponsData = data.casting_weapons;
            endingsData = data.endings;

            loadOptions();
            generateAll();

            generateLoadoutBtn.addEventListener('click', generateAll);
            rerollWeaponBtn.addEventListener('click', generateWeapon);
            rerollArmorBtn.addEventListener('click', generateArmor);
            rerollSpiritAshesBtn.addEventListener('click', generateSpiritAshes);
            rerollSpellsBtn.addEventListener('click', generateSpells);
            rerollCasterWeaponBtn.addEventListener('click', generateCasterWeapon);
            rerollEndingBtn.addEventListener('click', generateEnding);
        })
        .catch(error => console.error('Error loading data:', error));
});
