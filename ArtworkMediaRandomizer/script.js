document.addEventListener('DOMContentLoaded', () => {
    const mediumEl = document.getElementById('medium');
    const canvasEl = document.getElementById('canvas');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollMediumBtn = document.getElementById('reroll-medium');
    const rerollCanvasBtn = document.getElementById('reroll-canvas');

    let mediums = [];

    fetch('mediums.json')
        .then(response => response.json())
        .then(data => {
            mediums = data;
            generateMedium();
            generateCanvasSize();
        })
        .catch(error => console.error('Error fetching mediums:', error));

    function generateMedium() {
        if (mediums.length === 0) return;

        const rollMedium = (excludeMixedMedia = false) => {
            let availableMediums = mediums;
            if (excludeMixedMedia) {
                availableMediums = mediums.filter(m => m.name !== "Mixed Media");
            }
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
        const selectedMedium = mediums[Math.floor(Math.random() * mediums.length)];

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
        const surfaceSizeRoll = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        let surfaceSizeText = "";
        if (surfaceSizeRoll === 1) {
            surfaceSizeText = "Small";
        } else if (surfaceSizeRoll === 2) {
            surfaceSizeText = "Medium";
        } else {
            surfaceSizeText = "Large";
        }
        canvasEl.textContent = surfaceSizeText;
    }

    generateLoadoutBtn.addEventListener('click', () => {
        generateMedium();
        generateCanvasSize();
    });

    rerollMediumBtn.addEventListener('click', generateMedium);
    rerollCanvasBtn.addEventListener('click', generateCanvasSize);
});
