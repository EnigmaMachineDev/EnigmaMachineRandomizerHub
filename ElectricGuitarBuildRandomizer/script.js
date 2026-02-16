document.addEventListener('DOMContentLoaded', () => {
    const bodyWoodEl = document.getElementById('body-wood');
    const bodyTopWoodEl = document.getElementById('body-top-wood');
    const neckWoodEl = document.getElementById('neck-wood');
    const fretboardWoodEl = document.getElementById('fretboard-wood');
    const fretTypeEl = document.getElementById('fret-type');
    const fretCountEl = document.getElementById('fret-count');
    const stringCountEl = document.getElementById('string-count');
    const scaleLengthEl = document.getElementById('scale-length');
    const pickupConfigEl = document.getElementById('pickup-config');
    const bridgeEl = document.getElementById('bridge');
    const hardwareFinishEl = document.getElementById('hardware-finish');
    const stringsEl = document.getElementById('strings');
    const stringGaugeEl = document.getElementById('string-gauge');
    const nutWidthEl = document.getElementById('nut-width');
    const nutMaterialEl = document.getElementById('nut-material');
    const finishEl = document.getElementById('finish');
    const paintEl = document.getElementById('paint');
    const neckProfileEl = document.getElementById('neck-profile');
    const headstockEl = document.getElementById('headstock');
    const tunersEl = document.getElementById('tuners');
    const buildSummary = document.getElementById('build-summary');
    const summaryText = document.getElementById('summary-text');

    const generateBuildBtn = document.getElementById('generate-build');

    let data = {};
    const STORAGE_KEY = 'electricGuitarBuildOptions';
    let options = {};

    const categoryMap = {
        'body-wood': 'Body Wood',
        'body-top-wood': 'Body Top Wood',
        'neck-wood': 'Neck Wood',
        'fretboard-wood': 'Fretboard Wood',
        'fret-type': 'Fret Type',
        'fret-count': 'Fret Count',
        'string-count': 'String Count',
        'scale-length': 'Scale Length',
        'pickup-config': 'Pickup Configuration',
        'bridge': 'Bridge',
        'hardware-finish': 'Hardware Finish',
        'strings': 'Strings',
        'string-gauge': 'String Gauge',
        'nut-width': 'Nut Width',
        'nut-material': 'Nut Material',
        'finish': 'Finish',
        'paint': 'Paint',
        'neck-profile': 'Neck Profile',
        'headstock': 'Headstock',
        'tuners': 'Tuners'
    };

    const elementMap = {
        'body-wood': bodyWoodEl,
        'body-top-wood': bodyTopWoodEl,
        'neck-wood': neckWoodEl,
        'fretboard-wood': fretboardWoodEl,
        'fret-type': fretTypeEl,
        'fret-count': fretCountEl,
        'string-count': stringCountEl,
        'scale-length': scaleLengthEl,
        'pickup-config': pickupConfigEl,
        'bridge': bridgeEl,
        'hardware-finish': hardwareFinishEl,
        'strings': stringsEl,
        'string-gauge': stringGaugeEl,
        'nut-width': nutWidthEl,
        'nut-material': nutMaterialEl,
        'finish': finishEl,
        'paint': paintEl,
        'neck-profile': neckProfileEl,
        'headstock': headstockEl,
        'tuners': tunersEl
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
    const stringCountDependentCategories = ['string-gauge', 'nut-width', 'headstock', 'scale-length'];

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
        const btw = bodyTopWoodEl.textContent;
        const nw = neckWoodEl.textContent;
        const fw = fretboardWoodEl.textContent;
        const ft = fretTypeEl.textContent;
        const fc = fretCountEl.textContent;
        const pc = pickupConfigEl.textContent;
        const sl = scaleLengthEl.textContent;
        const np = neckProfileEl.textContent;
        const br = bridgeEl.textContent;
        const hf = hardwareFinishEl.textContent;
        const fi = finishEl.textContent;
        const pa = paintEl.textContent;
        const st = stringsEl.textContent;
        const sg = stringGaugeEl.textContent;
        const nwi = nutWidthEl.textContent;
        const nm = nutMaterialEl.textContent;
        const hs = headstockEl.textContent;
        const tu = tunersEl.textContent;

        const topStr = btw !== 'None (Solid Body)' ? ` with a ${btw} top` : '';

        summaryText.textContent = `A ${sc} electric guitar with a ${bw} body${topStr} and ${nw} neck, ` +
            `featuring a ${fw} fretboard with ${ft} across ${fc}. ` +
            `Pickups: ${pc}. ` +
            `Scale: ${sl} with ${np} neck profile. ` +
            `${br} bridge with ${hf} hardware. ` +
            `${nwi} nut in ${nm}. ` +
            `${pa} paint with ${fi} finish. ` +
            `Strung with ${st} strings in ${sg}. ` +
            `${hs} headstock with ${tu} tuners.`;
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

    function copyResults() {
        const sections = document.querySelectorAll('.container > .section');
        const lines = [];
        sections.forEach(section => {
            if (section.style.display === 'none') return;
            const header = section.querySelector('.section-header h2');
            if (!header) return;
            const label = header.textContent.trim();
            const itemContainer = section.querySelector('.item-container');
            if (!itemContainer) return;
            // Check for list items
            const listItems = itemContainer.querySelectorAll('li');
            let value = '';
            if (listItems.length > 0) {
                const items = Array.from(listItems).map(li => li.textContent.trim());
                value = items.join(', ');
            } else {
                value = itemContainer.textContent.trim();
            }
            if (value) {
                lines.push(label + ': ' + value);
            }
        });
        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-results');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
    }

    document.getElementById('copy-results').addEventListener('click', copyResults);
});
