document.addEventListener('DOMContentLoaded', () => {
    const mediumEl = document.getElementById('medium');
    const canvasEl = document.getElementById('canvas');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollMediumBtn = document.getElementById('reroll-medium');
    const rerollCanvasBtn = document.getElementById('reroll-canvas');

    let mediums = [];
    const STORAGE_KEY = 'artworkMediaOptions';
    let options = {};
    const canvasSizes = ['Small', 'Medium', 'Large'];

    function getRandomValue(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function loadOptions() { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { try { options = JSON.parse(saved); } catch (e) { } } }
    function isEnabled(category, name) { if (!options[category]) return true; if (!options[category].hasOwnProperty(name)) return true; return options[category][name]; }
    function getEnabledItems(category) { if (category === 'mediums' && Array.isArray(mediums)) { return mediums.filter(item => isEnabled(category, item.name)); } if (category === 'canvasSizes') { return canvasSizes.filter(size => isEnabled(category, size)); } return []; }

    fetch('mediums.json')
        .then(response => response.json())
        .then(data => {
            mediums = data;
            loadOptions();
            generateMedium();
            generateCanvasSize();
        })
        .catch(error => console.error('Error fetching mediums:', error));

    function generateMedium() {
        if (!mediums || !Array.isArray(mediums) || mediums.length === 0) return;

        const enabledMediums = getEnabledItems('mediums');
        if (!enabledMediums || enabledMediums.length === 0) {
            mediumEl.textContent = 'No mediums selected';
            return;
        }

        const rollMedium = (excludeMixedMedia = false) => {
            let availableMediums = getEnabledItems('mediums');
            if (excludeMixedMedia) {
                availableMediums = availableMediums.filter(m => m.name !== "Mixed Media");
            }
            if (availableMediums.length === 0) return "No mediums available";
            const randomIndex = Math.floor(Math.random() * availableMediums.length);
            const medium = availableMediums[randomIndex];
            let text = medium.name;
            if (medium.options && medium.options.length > 0) {
                const randomOptionIndex = Math.floor(Math.random() * medium.options.length);
                text += ` - ${medium.options[randomOptionIndex]}`;
            }
            return text;
        };

        let displayText = "";

        const selectedMedium = getRandomValue(enabledMediums);

        if (selectedMedium.name === "Mixed Media") {
            const randomOptionIndex = Math.floor(Math.random() * selectedMedium.options.length);
            const selectedOption = selectedMedium.options[randomOptionIndex];

            if (selectedOption === "Free For All") {
                displayText = "Mixed Media";
            } else {
                const numRolls = parseInt(selectedOption);
                if (!isNaN(numRolls) && numRolls > 0) {
                    let rolledMedia = [];
                    for (let i = 0; i < numRolls; i++) {
                        rolledMedia.push(rollMedium(true)); // Exclude Mixed Media for sub-rolls
                    }
                    displayText = `Mixed Media - ${rolledMedia.join(", ")}`;
                } else {
                    displayText = `Mixed Media - ${selectedOption}`;
                }
            }
        } else {
            displayText = selectedMedium.name;
            if (selectedMedium.options && selectedMedium.options.length > 0) {
                const randomOptionIndex = Math.floor(Math.random() * selectedMedium.options.length);
                displayText += ` - ${selectedMedium.options[randomOptionIndex]}`;
            }
        }

        mediumEl.textContent = displayText;
    }

    function generateCanvasSize() {
        const enabledSizes = getEnabledItems('canvasSizes');
        if (enabledSizes.length === 0) {
            canvasEl.textContent = 'No canvas sizes selected';
            return;
        }
        const size = getRandomValue(enabledSizes);
        canvasEl.textContent = size;
    }

    generateLoadoutBtn.addEventListener('click', () => {
        generateMedium();
        generateCanvasSize();
    });

    rerollMediumBtn.addEventListener('click', generateMedium);
    rerollCanvasBtn.addEventListener('click', generateCanvasSize);
});
