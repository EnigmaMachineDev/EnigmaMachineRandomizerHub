document.addEventListener('DOMContentLoaded', () => {
    const buildFocusEl = document.getElementById('build-focus');
    const attackFocusEl = document.getElementById('attack-focus');
    const armorEl = document.getElementById('armor');
    const primarySignEl = document.getElementById('primary-sign');
    const secondarySignEl = document.getElementById('secondary-sign');
    const tertiarySignEl = document.getElementById('tertiary-sign');
    const regionEl = document.getElementById('region');
    const romanceEl = document.getElementById('romance');
    const ciriEl = document.getElementById('ciri');
    const radovidEl = document.getElementById('radovid');
    const politicsEl = document.getElementById('politics');
    const keiraEl = document.getElementById('keira');
    const baronEl = document.getElementById('baron');
    const alignmentEl = document.getElementById('alignment');
    const hairEl = document.getElementById('hair');
    const beardEl = document.getElementById('beard');
    const difficultyEl = document.getElementById('difficulty');

    const rerollBuildFocusBtn = document.getElementById('reroll-build-focus');
    const rerollAttackFocusBtn = document.getElementById('reroll-attack-focus');
    const rerollArmorBtn = document.getElementById('reroll-armor');
    const rerollPrimarySignBtn = document.getElementById('reroll-primary-sign');
    const rerollSecondarySignBtn = document.getElementById('reroll-secondary-sign');
    const rerollTertiarySignBtn = document.getElementById('reroll-tertiary-sign');
    const rerollRegionBtn = document.getElementById('reroll-region');
    const rerollRomanceBtn = document.getElementById('reroll-romance');
    const rerollCiriBtn = document.getElementById('reroll-ciri');
    const rerollRadovidBtn = document.getElementById('reroll-radovid');
    const rerollPoliticsBtn = document.getElementById('reroll-politics');
    const rerollKeiraBtn = document.getElementById('reroll-keira');
    const rerollBaronBtn = document.getElementById('reroll-baron');
    const rerollAlignmentBtn = document.getElementById('reroll-alignment');
    const rerollHairBtn = document.getElementById('reroll-hair');
    const rerollBeardBtn = document.getElementById('reroll-beard');
    const rerollDifficultyBtn = document.getElementById('reroll-difficulty');
    const generateBuildBtn = document.getElementById('generate-build');

    let data = {};
    const STORAGE_KEY = 'witcher3Options';
    let options = {};

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();
        });

    function getRandomItem(items) {
        if (!items || items.length === 0) return 'N/A';
        return items[Math.floor(Math.random() * items.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) {}
        }
    }

    function isEnabled(categoryName, itemName) {
        if (!options[categoryName]) return true;
        if (!options[categoryName].hasOwnProperty(itemName)) return true;
        return options[categoryName][itemName];
    }

    function getEnabledOptions(categoryName) {
        const category = data.categories.find(cat => cat.name === categoryName);
        if (!category) return [];
        
        return category.options.filter(option => {
            const optionName = option.name || option;
            return isEnabled(categoryName, optionName);
        });
    }

    function setItem(element, item) {
        element.textContent = item;
    }

    function rollBuildFocus() {
        const enabled = getEnabledOptions('Build Focus');
        if (enabled.length === 0) {
            setItem(buildFocusEl, 'No builds selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(buildFocusEl, item);
    }

    function rollAttackFocus() {
        const enabled = getEnabledOptions('Attack Focus');
        if (enabled.length === 0) {
            setItem(attackFocusEl, 'No attack focus selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(attackFocusEl, item);
    }

    function rollArmor() {
        const enabled = getEnabledOptions('Armor Set');
        if (enabled.length === 0) {
            setItem(armorEl, 'No armor sets selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(armorEl, item);
    }

    function rollPrimarySign() {
        const enabled = getEnabledOptions('Primary Sign');
        if (enabled.length === 0) {
            setItem(primarySignEl, 'No signs selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(primarySignEl, item);
    }

    function rollSecondarySign() {
        const enabled = getEnabledOptions('Secondary Sign');
        if (enabled.length === 0) {
            setItem(secondarySignEl, 'No signs selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(secondarySignEl, item);
    }

    function rollTertiarySign() {
        const enabled = getEnabledOptions('Tertiary Sign');
        if (enabled.length === 0) {
            setItem(tertiarySignEl, 'No signs selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(tertiarySignEl, item);
    }

    function rollRegion() {
        const enabled = getEnabledOptions('Region Order');
        if (enabled.length === 0) {
            setItem(regionEl, 'No region orders selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(regionEl, item);
    }

    function rollRomance() {
        const enabled = getEnabledOptions('Romance Choice');
        if (enabled.length === 0) {
            setItem(romanceEl, 'No romance options selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(romanceEl, item);
    }

    function rollCiri() {
        const enabled = getEnabledOptions('Ciri\'s Fate');
        if (enabled.length === 0) {
            setItem(ciriEl, 'No options selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(ciriEl, item);
    }

    function rollRadovid() {
        const enabled = getEnabledOptions('Radovid\'s Fate');
        if (enabled.length === 0) {
            setItem(radovidEl, 'No options selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(radovidEl, item);
    }

    function rollPolitics() {
        const enabled = getEnabledOptions('Nilfgaard vs Temeria');
        if (enabled.length === 0) {
            setItem(politicsEl, 'No options selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(politicsEl, item);
    }

    function rollKeira() {
        const enabled = getEnabledOptions('Keira Metz\'s Fate');
        if (enabled.length === 0) {
            setItem(keiraEl, 'No options selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(keiraEl, item);
    }

    function rollBaron() {
        const enabled = getEnabledOptions('Bloody Baron Questline');
        if (enabled.length === 0) {
            setItem(baronEl, 'No options selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(baronEl, item);
    }

    function rollAlignment() {
        const enabled = getEnabledOptions('Moral Alignment');
        if (enabled.length === 0) {
            setItem(alignmentEl, 'No alignments selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(alignmentEl, item);
    }

    function rollHair() {
        const enabled = getEnabledOptions('Hair Style');
        if (enabled.length === 0) {
            setItem(hairEl, 'No hair styles selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(hairEl, item);
    }

    function rollBeard() {
        const enabled = getEnabledOptions('Beard Style');
        if (enabled.length === 0) {
            setItem(beardEl, 'No beard styles selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(beardEl, item);
    }

    function rollDifficulty() {
        const enabled = getEnabledOptions('Difficulty');
        if (enabled.length === 0) {
            setItem(difficultyEl, 'No difficulties selected');
            return;
        }
        const item = getRandomItem(enabled);
        setItem(difficultyEl, item);
    }

    function randomizeAll() {
        rollBuildFocus();
        rollAttackFocus();
        rollArmor();
        rollPrimarySign();
        rollSecondarySign();
        rollTertiarySign();
        rollRegion();
        rollRomance();
        rollCiri();
        rollRadovid();
        rollPolitics();
        rollKeira();
        rollBaron();
        rollAlignment();
        rollHair();
        rollBeard();
        rollDifficulty();
    }

    rerollBuildFocusBtn.addEventListener('click', rollBuildFocus);
    rerollAttackFocusBtn.addEventListener('click', rollAttackFocus);
    rerollArmorBtn.addEventListener('click', rollArmor);
    rerollPrimarySignBtn.addEventListener('click', rollPrimarySign);
    rerollSecondarySignBtn.addEventListener('click', rollSecondarySign);
    rerollTertiarySignBtn.addEventListener('click', rollTertiarySign);
    rerollRegionBtn.addEventListener('click', rollRegion);
    rerollRomanceBtn.addEventListener('click', rollRomance);
    rerollCiriBtn.addEventListener('click', rollCiri);
    rerollRadovidBtn.addEventListener('click', rollRadovid);
    rerollPoliticsBtn.addEventListener('click', rollPolitics);
    rerollKeiraBtn.addEventListener('click', rollKeira);
    rerollBaronBtn.addEventListener('click', rollBaron);
    rerollAlignmentBtn.addEventListener('click', rollAlignment);
    rerollHairBtn.addEventListener('click', rollHair);
    rerollBeardBtn.addEventListener('click', rollBeard);
    rerollDifficultyBtn.addEventListener('click', rollDifficulty);
    generateBuildBtn.addEventListener('click', randomizeAll);
});
