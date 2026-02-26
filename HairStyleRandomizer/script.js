document.addEventListener('DOMContentLoaded', () => {
    let data = {};

    fetch('randomizer.json')
        .then(r => r.json())
        .then(json => {
            data = json;
        })
        .catch(err => console.error('Error loading randomizer.json:', err));

    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const rerollHairBtn = document.getElementById('reroll-hair');
    const rerollBeardBtn = document.getElementById('reroll-beard');

    const resultsContainer = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    const hairNameEl = document.getElementById('hair-name');
    const hairDescEl = document.getElementById('hair-desc');
    const beardNameEl = document.getElementById('beard-name');
    const beardSection = document.getElementById('beard-section');
    const beardFilterGroup = document.getElementById('beard-filter-group');

    function getSelectedSex() {
        const checked = document.querySelector('input[name="sex"]:checked');
        return checked ? checked.value : 'men';
    }

    function getCheckedValues(selector) {
        return Array.from(document.querySelectorAll(selector))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }

    function getRandomElement(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getFilteredStyles() {
        const sex = getSelectedSex();
        const selectedLengths = getCheckedValues('.length-cb');
        const selectedTypes = getCheckedValues('.type-cb');

        if (!data[sex] || !data[sex].hairstyles) return [];

        return data[sex].hairstyles.filter(style => {
            const lengthMatch = style.lengths.some(l => selectedLengths.includes(l));
            const typeMatch = style.types.some(t => selectedTypes.includes(t));
            return lengthMatch && typeMatch;
        });
    }

    function getFilteredBeardStyles() {
        const selectedBeardLengths = getCheckedValues('.beard-length-cb');
        if (!data.men || !data.men.beardStyles) return [];

        return data.men.beardStyles.filter(style =>
            style.lengths.some(l => selectedBeardLengths.includes(l))
        );
    }

    function generateHairStyle() {
        const filtered = getFilteredStyles();
        if (filtered.length === 0) return null;
        return getRandomElement(filtered);
    }

    function generateBeardStyle() {
        const filtered = getFilteredBeardStyles();
        if (filtered.length === 0) return null;
        return getRandomElement(filtered);
    }

    function renderHairResult(style) {
        if (!style) {
            hairNameEl.textContent = 'No styles match your filters';
            hairDescEl.textContent = '';
            return;
        }
        hairNameEl.textContent = style.name;
        hairDescEl.textContent = style.description || '';
    }

    function renderBeardResult(style) {
        if (!style) {
            beardNameEl.textContent = 'No beard styles match your filters';
            return;
        }
        beardNameEl.textContent = style.name;
    }

    function updateBeardVisibility() {
        const sex = getSelectedSex();
        if (sex === 'men') {
            beardFilterGroup.classList.remove('hidden');
            beardSection.classList.remove('hidden');
        } else {
            beardFilterGroup.classList.add('hidden');
            beardSection.classList.add('hidden');
        }
    }

    function generate() {
        const filtered = getFilteredStyles();

        if (filtered.length === 0) {
            resultsContainer.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        const hairStyle = generateHairStyle();
        renderHairResult(hairStyle);

        const sex = getSelectedSex();
        if (sex === 'men') {
            const beardStyle = generateBeardStyle();
            renderBeardResult(beardStyle);
        }
    }

    generateBtn.addEventListener('click', generate);

    rerollHairBtn.addEventListener('click', () => {
        const style = generateHairStyle();
        if (style) {
            renderHairResult(style);
        }
    });

    rerollBeardBtn.addEventListener('click', () => {
        const style = generateBeardStyle();
        if (style) {
            renderBeardResult(style);
        }
    });

    document.querySelectorAll('input[name="sex"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateBeardVisibility();
        });
    });

    copyBtn.addEventListener('click', () => {
        const sex = getSelectedSex();
        const lines = [];

        const hairName = hairNameEl.textContent.trim();
        const hairDesc = hairDescEl.textContent.trim();
        if (hairName) {
            lines.push('Hairstyle: ' + hairName);
            if (hairDesc) lines.push('Description: ' + hairDesc);
        }

        if (sex === 'men') {
            const beardName = beardNameEl.textContent.trim();
            if (beardName) lines.push('Beard / Facial Hair: ' + beardName);
        }

        if (lines.length === 0) return;

        navigator.clipboard.writeText(lines.join('\n')).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
        });
    });

    updateBeardVisibility();
});
