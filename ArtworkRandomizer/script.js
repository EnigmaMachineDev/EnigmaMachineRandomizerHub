document.addEventListener('DOMContentLoaded', () => {
    const mediumEl = document.getElementById('medium');
    const subjectEl = document.getElementById('subject');
    const canvasEl = document.getElementById('canvas');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollMediumBtn = document.getElementById('reroll-medium');
    const rerollSubjectBtn = document.getElementById('reroll-subject');
    const rerollCanvasBtn = document.getElementById('reroll-canvas');

    let mediums = [];
    let subjects = [];
    const STORAGE_KEY = 'artworkRandomizerOptions';
    let options = {};
    const canvasSizes = ['Small', 'Medium', 'Large'];

    function getRandomValue(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function loadOptions() { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { try { options = JSON.parse(saved); } catch (e) { } } }
    function isEnabled(category, name) { if (!options[category]) return true; if (!options[category].hasOwnProperty(name)) return true; return options[category][name]; }
    function getEnabledItems(category) { if (category === 'mediums' && Array.isArray(mediums)) { return mediums.filter(item => isEnabled(category, item.name)); } if (category === 'subjects' && Array.isArray(subjects)) { return subjects.filter(item => isEnabled(category, item.name)); } if (category === 'canvasSizes') { return canvasSizes.filter(size => isEnabled(category, size)); } return []; }

    fetch('randomizer.json')
        .then(response => response.json())
        .then(data => {
            mediums = data.mediums;
            subjects = data.subjects;
            loadOptions();
            generateMedium();
            generateSubject();
            generateCanvasSize();
        })
        .catch(error => console.error('Error fetching randomizer data:', error));

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

    function generateSubject() {
        const enabledSubjects = getEnabledItems('subjects');
        if (enabledSubjects.length === 0) {
            subjectEl.textContent = 'No subjects selected';
            return;
        }
        const subject = getRandomValue(enabledSubjects);
        subjectEl.textContent = subject.name;
    }

    generateLoadoutBtn.addEventListener('click', () => {
        generateMedium();
        generateSubject();
        generateCanvasSize();
    });

    rerollMediumBtn.addEventListener('click', generateMedium);
    rerollSubjectBtn.addEventListener('click', generateSubject);
    rerollCanvasBtn.addEventListener('click', generateCanvasSize);
});
