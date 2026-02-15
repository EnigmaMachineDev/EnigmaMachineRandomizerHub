document.addEventListener('DOMContentLoaded', () => {
    const bodyWoodEl = document.getElementById('body-wood');
    const neckWoodEl = document.getElementById('neck-wood');
    const fretboardWoodEl = document.getElementById('fretboard-wood');
    const fretTypeEl = document.getElementById('fret-type');
    const stringCountEl = document.getElementById('string-count');
    const scaleLengthEl = document.getElementById('scale-length');
    const pickupConfigEl = document.getElementById('pickup-config');
    const pickupTypeEl = document.getElementById('pickup-type');
    const bridgeEl = document.getElementById('bridge');
    const stringSpacingEl = document.getElementById('string-spacing');
    const hardwareFinishEl = document.getElementById('hardware-finish');
    const stringsEl = document.getElementById('strings');
    const nutWidthEl = document.getElementById('nut-width');
    const finishEl = document.getElementById('finish');
    const paintEl = document.getElementById('paint');
    const neckProfileEl = document.getElementById('neck-profile');
    const headstockEl = document.getElementById('headstock');
    const buildSummary = document.getElementById('build-summary');
    const summaryText = document.getElementById('summary-text');

    const generateBuildBtn = document.getElementById('generate-build');

    let data = {};
    const STORAGE_KEY = 'bassGuitarBuildOptions';
    let options = {};

    const categoryMap = {
        'body-wood': 'Body Wood',
        'neck-wood': 'Neck Wood',
        'fretboard-wood': 'Fretboard Wood',
        'fret-type': 'Fret Type',
        'string-count': 'String Count',
        'scale-length': 'Scale Length',
        'pickup-config': 'Pickup Configuration',
        'pickup-type': 'Pickup Type',
        'bridge': 'Bridge',
        'string-spacing': 'String Spacing',
        'hardware-finish': 'Hardware Finish',
        'strings': 'Strings',
        'nut-width': 'Nut Width',
        'finish': 'Finish',
        'paint': 'Paint',
        'neck-profile': 'Neck Profile',
        'headstock': 'Headstock'
    };

    const elementMap = {
        'body-wood': bodyWoodEl,
        'neck-wood': neckWoodEl,
        'fretboard-wood': fretboardWoodEl,
        'fret-type': fretTypeEl,
        'string-count': stringCountEl,
        'scale-length': scaleLengthEl,
        'pickup-config': pickupConfigEl,
        'pickup-type': pickupTypeEl,
        'bridge': bridgeEl,
        'string-spacing': stringSpacingEl,
        'hardware-finish': hardwareFinishEl,
        'strings': stringsEl,
        'nut-width': nutWidthEl,
        'finish': finishEl,
        'paint': paintEl,
        'neck-profile': neckProfileEl,
        'headstock': headstockEl
    };

    function getRandomItem(items) {
        if (!items || items.length === 0) return null;
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

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    // Categories that depend on String Count
    const stringCountDependentCategories = ['string-spacing', 'nut-width', 'headstock'];

    function getCurrentStringCount() {
        return stringCountEl.textContent || '';
    }

    function isHeadless() {
        return headstockEl.textContent === 'Headless';
    }

    function getEnabledItems(category, stringCountFilter) {
        if (!data[category]) return [];
        return data[category].filter(item => {
            if (!isEnabled(category, item.name)) return false;
            if (stringCountFilter && item.for) {
                return item.for.includes(stringCountFilter);
            }
            // Filter bridges by headless compatibility
            if (category === 'Bridge' && item.hasOwnProperty('headless')) {
                return item.headless === isHeadless();
            }
            return true;
        });
    }

    function setItem(el, item) {
        if (!item) {
            el.textContent = 'N/A';
            return;
        }
        el.textContent = item.name;
    }

    function rollCategory(id) {
        const category = categoryMap[id];
        const el = elementMap[id];
        const scFilter = stringCountDependentCategories.includes(id) ? getCurrentStringCount() : null;
        const items = getEnabledItems(category, scFilter);
        setItem(el, getRandomItem(items));
    }

    function rollDependentCategories() {
        stringCountDependentCategories.forEach(id => rollCategory(id));
    }

    function updateSummary() {
        const sc = stringCountEl.textContent;
        const bw = bodyWoodEl.textContent;
        const nw = neckWoodEl.textContent;
        const fw = fretboardWoodEl.textContent;
        const ft = fretTypeEl.textContent;
        const pc = pickupConfigEl.textContent;
        const pt = pickupTypeEl.textContent;
        const sl = scaleLengthEl.textContent;
        const np = neckProfileEl.textContent;
        const br = bridgeEl.textContent;
        const ss = stringSpacingEl.textContent;
        const hf = hardwareFinishEl.textContent;
        const fi = finishEl.textContent;
        const pa = paintEl.textContent;
        const st = stringsEl.textContent;
        const hs = headstockEl.textContent;

        summaryText.textContent = `A ${sc} bass with a ${bw} body and ${nw} neck, ` +
            `featuring a ${fw} fretboard with ${ft}. ` +
            `Electronics: ${pc} in ${pt} configuration. ` +
            `Scale: ${sl} with ${np} neck profile. ` +
            `${br} bridge at ${ss} string spacing with ${hf} hardware. ` +
            `${pa} paint with ${fi} finish. ` +
            `Strung with ${st} strings. ${hs} headstock layout.`;
        buildSummary.style.display = 'block';
    }

    function randomizeAll() {
        // Roll string count first so dependent categories can filter
        rollCategory('string-count');
        // Roll headstock before bridge so bridge can filter by headless
        rollCategory('headstock');
        Object.keys(categoryMap).forEach(id => {
            if (id !== 'string-count' && id !== 'headstock') rollCategory(id);
        });
        updateSummary();
    }

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();

            generateBuildBtn.addEventListener('click', randomizeAll);

            // Set up individual reroll buttons
            Object.keys(categoryMap).forEach(id => {
                const btn = document.getElementById('reroll-' + id);
                if (btn) {
                    btn.addEventListener('click', () => {
                        rollCategory(id);
                        // If string count changed, re-roll dependent categories
                        if (id === 'string-count') {
                            rollDependentCategories();
                            rollCategory('bridge');
                        }
                        // If headstock changed, re-roll bridge for compatibility
                        if (id === 'headstock') {
                            rollCategory('bridge');
                        }
                        updateSummary();
                    });
                }
            });
        })
        .catch(error => console.error('Error loading data:', error));
});
