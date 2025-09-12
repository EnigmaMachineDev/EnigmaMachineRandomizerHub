document.addEventListener('DOMContentLoaded', () => {
    const identityEl = document.getElementById('identity');
    const personalityEl = document.getElementById('personality');
    const personalityLinkEl = document.getElementById('personality-link');

    const generateLoadoutBtn = document.getElementById('generate-loadout');
    const rerollIdentityBtn = document.getElementById('reroll-identity');
    const rerollPersonalityBtn = document.getElementById('reroll-personality');

    let namesData = null;
    let personalityData = null;

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function generateIdentity() {
        if (!namesData) return;

        const sex = getRandomElement(['Male', 'Female']);
        const firstName = sex === 'Male'
            ? getRandomElement(namesData.firstName.male)
            : getRandomElement(namesData.firstName.female);
        const lastName = getRandomElement(namesData.lastNames);

        identityEl.innerHTML = `<strong>Name:</strong> ${firstName} ${lastName}<br><strong>Sex:</strong> ${sex}`;
    }

    function generatePersonality() {
        if (!personalityData) return;

        const alignment = getRandomElement(personalityData.alignment);
        const personalityType = getRandomElement(personalityData.personalityType);

        personalityEl.textContent = `${alignment} - ${personalityType.name}`;
        personalityLinkEl.href = personalityType.link;
    }

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