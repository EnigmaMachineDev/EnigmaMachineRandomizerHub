document.addEventListener('DOMContentLoaded', () => {
    const endingEl = document.getElementById('ending');
    const skillTreeEl = document.getElementById('skill-tree');

    const rerollEndingBtn = document.getElementById('reroll-ending');
    const rerollSkillTreeBtn = document.getElementById('reroll-skill-tree');
    const generateLoadoutBtn = document.getElementById('generate-loadout');

    let endingsData;
    let skillTreesData;

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const STORAGE_KEY = 'sekiroOptions';
    let options = {};

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

    function getEnabledItems(category, items) {
        if (!items) return [];
        return items.filter(item => isEnabled(category, item));
    }

    function generateEnding() {
        if (!endingsData) return;
        const enabledEndings = getEnabledItems('endings', endingsData);
        if (enabledEndings.length === 0) {
            endingEl.textContent = 'No endings enabled';
            return;
        }
        const randomEnding = getRandomElement(enabledEndings);
        endingEl.textContent = randomEnding;
    }

    function generateSkillTree() {
        if (!skillTreesData) return;
        const enabledSkillTrees = getEnabledItems('skillTrees', skillTreesData);
        if (enabledSkillTrees.length === 0) {
            skillTreeEl.textContent = 'No skill trees enabled';
            return;
        }
        const randomSkillTree = getRandomElement(enabledSkillTrees);
        skillTreeEl.textContent = randomSkillTree;
    }

    function randomizeAll() {
        generateEnding();
        generateSkillTree();
    }

    loadOptions();

    fetch('randomizer.json')
        .then(res => res.json())
        .then(data => {
            endingsData = data.endings;
            skillTreesData = data.skillTrees;

            loadOptions();
            randomizeAll();

            rerollEndingBtn.addEventListener('click', generateEnding);
            rerollSkillTreeBtn.addEventListener('click', generateSkillTree);
            generateLoadoutBtn.addEventListener('click', randomizeAll);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Failed to load necessary data. Please check the console for more details and ensure the .json file is present and correctly formatted.');
        });

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
