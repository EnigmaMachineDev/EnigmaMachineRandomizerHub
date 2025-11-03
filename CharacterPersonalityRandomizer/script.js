document.addEventListener('DOMContentLoaded', () => {
    const identityEl = document.getElementById('identity');
    const personalityEl = document.getElementById('personality');
    const personalityLinkEl = document.getElementById('personality-link');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollIdentityBtn = document.getElementById('reroll-identity');
    const rerollPersonalityBtn = document.getElementById('reroll-personality');

    let data = {};
    const STORAGE_KEY = 'characterPersonalityOptions';
    let options = {};
    let namesData = null;
    let personalityData = null;

    function getRandomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                options = JSON.parse(saved);
            } catch (e) { }
        }
    }

    function isEnabled(category, name) {
        if (!options[category]) return true;
        if (!options[category].hasOwnProperty(name)) return true;
        return options[category][name];
    }

    function getEnabledItems(category) {
        if (!data[category]) return [];
        return data[category].filter(item => isEnabled(category, item));
    }

    function generateIdentity() {
        if (!namesData) return;

        const sex = getRandomValue(['Male', 'Female']);
        const firstName = sex === 'Male'
            ? getRandomValue(namesData.firstName.male)
            : getRandomValue(namesData.firstName.female);
        const lastName = getRandomValue(namesData.lastNames);

        identityEl.innerHTML = `<strong>Name:</strong> ${firstName} ${lastName}<br><strong>Sex:</strong> ${sex}`;
    }

    function generatePersonality() {
        if (!personalityData) return;

        const alignment = getRandomValue(personalityData.alignment);
        const personalityType = getRandomValue(personalityData.personalityType);

        personalityEl.textContent = `${alignment} - ${personalityType.name}`;
        personalityLinkEl.href = personalityType.link;
    }

    loadOptions();

    Promise.all([
        fetch('names.json').then(res => res.json()),
        fetch('randomizer.json').then(res => res.json())
    ]).then(([names, personality]) => {
        namesData = names;
        personalityData = personality;

        generateIdentity();
        generatePersonality();

        generateLoadoutBtn.addEventListener('click', () => {
            generateIdentity();
            generatePersonality();
        });

        rerollIdentityBtn.addEventListener('click', generateIdentity);
        rerollPersonalityBtn.addEventListener('click', generatePersonality);
    }).catch(error => console.error('Error loading data:', error));
});