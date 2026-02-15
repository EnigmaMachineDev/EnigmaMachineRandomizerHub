document.addEventListener('DOMContentLoaded', () => {
    const bpmEl = document.getElementById('bpm');
    const timeSignatureEl = document.getElementById('time-signature');
    const keyEl = document.getElementById('key');
    const genreEl = document.getElementById('genre');
    const moodEl = document.getElementById('mood');
    const focusInstrumentEl = document.getElementById('focus-instrument');
    const chordProgressionEl = document.getElementById('chord-progression');
    const songStructureEl = document.getElementById('song-structure');

    const generateSongBtn = document.getElementById('generate-song');

    let data = {};
    const STORAGE_KEY = 'songIdeaOptions';
    let options = {};

    const categoryMap = {
        'time-signature': 'time_signatures',
        'genre': 'genres',
        'mood': 'moods',
        'focus-instrument': 'focus_instruments',
        'chord-progression': 'chord_progressions',
        'song-structure': 'song_structures',
        'root-note': 'root_notes',
        'mode': 'modes'
    };

    const elementMap = {
        'time-signature': timeSignatureEl,
        'genre': genreEl,
        'mood': moodEl,
        'focus-instrument': focusInstrumentEl,
        'chord-progression': chordProgressionEl,
        'song-structure': songStructureEl
    };

    function getRandomItem(items) {
        if (!items || items.length === 0) return null;
        return items[Math.floor(Math.random() * items.length)];
    }

    function getRandomBpm() {
        let min = data.bpm.min;
        let max = data.bpm.max;
        // Use saved BPM range from options if available
        if (options.bpm_range) {
            min = options.bpm_range.min || min;
            max = options.bpm_range.max || max;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    function getEnabledItems(categoryKey) {
        const items = data[categoryKey];
        if (!items || !Array.isArray(items)) return [];
        return items.filter(item => isEnabled(categoryKey, item));
    }

    function rollBpm() {
        bpmEl.textContent = getRandomBpm() + ' BPM';
    }

    function rollKey() {
        const enabledRoots = getEnabledItems('root_notes');
        const enabledModes = getEnabledItems('modes');
        const root = getRandomItem(enabledRoots);
        const mode = getRandomItem(enabledModes);
        if (root && mode) {
            keyEl.textContent = root + ' ' + mode;
        } else if (root) {
            keyEl.textContent = root;
        } else if (mode) {
            keyEl.textContent = mode;
        } else {
            keyEl.textContent = 'N/A';
        }
    }

    function rollCategory(id) {
        const categoryKey = categoryMap[id];
        const el = elementMap[id];
        const items = getEnabledItems(categoryKey);
        const item = getRandomItem(items);
        el.textContent = item || 'N/A';
    }

    function rollStructure() {
        const items = getEnabledItems('song_structures');
        const item = getRandomItem(items);
        songStructureEl.textContent = item || 'N/A';
    }

    function randomizeAll() {
        rollBpm();
        rollCategory('time-signature');
        rollKey();
        rollCategory('genre');
        rollCategory('mood');
        rollCategory('focus-instrument');
        rollCategory('chord-progression');
        rollStructure();
    }

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadOptions();
            randomizeAll();

            generateSongBtn.addEventListener('click', randomizeAll);

            // Individual reroll buttons
            document.getElementById('reroll-bpm').addEventListener('click', rollBpm);
            document.getElementById('reroll-time-signature').addEventListener('click', () => rollCategory('time-signature'));
            document.getElementById('reroll-key').addEventListener('click', rollKey);
            document.getElementById('reroll-genre').addEventListener('click', () => rollCategory('genre'));
            document.getElementById('reroll-mood').addEventListener('click', () => rollCategory('mood'));
            document.getElementById('reroll-focus-instrument').addEventListener('click', () => rollCategory('focus-instrument'));
            document.getElementById('reroll-chord-progression').addEventListener('click', () => rollCategory('chord-progression'));
            document.getElementById('reroll-song-structure').addEventListener('click', rollStructure);
        })
        .catch(error => console.error('Error loading data:', error));
});
