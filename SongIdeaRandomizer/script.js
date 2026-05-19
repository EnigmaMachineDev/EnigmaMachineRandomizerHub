document.addEventListener('DOMContentLoaded', () => {
    const bpmEl = document.getElementById('bpm');
    const timeSignatureEl = document.getElementById('time-signature');
    const keyEl = document.getElementById('key');
    const keyNotesEl = document.getElementById('key-notes');
    const genreEl = document.getElementById('genre');
    const moodEl = document.getElementById('mood');
    const focusInstrumentEl = document.getElementById('focus-instrument');
    const chordProgressionEl = document.getElementById('chord-progression');
    const songStructureEl = document.getElementById('song-structure');

    const generateSongBtn = document.getElementById('generate-song');

    let data = {};
    const STORAGE_KEY = 'songIdeaOptions';
    let options = {};

    const modeIntervals = {
        'Ionian':     [0, 2, 4, 5, 7, 9, 11],
        'Dorian':     [0, 2, 3, 5, 7, 9, 10],
        'Phrygian':   [0, 1, 3, 5, 7, 8, 10],
        'Lydian':     [0, 2, 4, 6, 7, 9, 11],
        'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
        'Aeolian':    [0, 2, 3, 5, 7, 8, 10],
        'Locrian':    [0, 1, 3, 5, 6, 8, 10]
    };
    const chromaticSharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chromaticFlats  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    // Semitones from mode root back to the parent Ionian (major) root
    const modeParentOffset = {
        'Ionian': 0, 'Dorian': 2, 'Phrygian': 4, 'Lydian': 5,
        'Mixolydian': 7, 'Aeolian': 9, 'Locrian': 11
    };
    // Parent major key indices that use flat accidentals: Db(1), Eb(3), F(5), Ab(8), Bb(10)
    const flatParentKeys = new Set([1, 3, 5, 8, 10]);
    const rootToIndex = {
        'C': 0, 'C#/Db': 1, 'D': 2, 'D#/Eb': 3, 'E': 4, 'F': 5,
        'F#/Gb': 6, 'G': 7, 'G#/Ab': 8, 'A': 9, 'A#/Bb': 10, 'B': 11
    };

    function getScaleNotes(root, mode) {
        const intervals = modeIntervals[mode];
        if (!intervals) return '';
        const rootIdx = rootToIndex[root];
        if (rootIdx === undefined) return '';
        const parentIdx = (rootIdx - (modeParentOffset[mode] || 0) + 12) % 12;
        const chromatic = flatParentKeys.has(parentIdx) ? chromaticFlats : chromaticSharps;
        return intervals.map(i => chromatic[(rootIdx + i) % 12]).join('  ');
    }

    const categoryMap = {
        'time-signature': 'time_signatures',
        'genre': 'genres',
        'mood': 'moods',
        'focus-instrument': 'focus_instruments',
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
            keyNotesEl.textContent = getScaleNotes(root, mode);
        } else if (root) {
            keyEl.textContent = root;
            keyNotesEl.textContent = '';
        } else if (mode) {
            keyEl.textContent = mode;
            keyNotesEl.textContent = '';
        } else {
            keyEl.textContent = 'N/A';
            keyNotesEl.textContent = '';
        }
    }

    function rollCategory(id) {
        const categoryKey = categoryMap[id];
        const el = elementMap[id];
        const items = getEnabledItems(categoryKey);
        const item = getRandomItem(items);
        el.textContent = item || 'N/A';
    }

    function rollChordProgression() {
        const length = Math.floor(Math.random() * 7) + 2;
        const degrees = [];
        for (let i = 0; i < length; i++) {
            degrees.push(Math.floor(Math.random() * 7) + 1);
        }
        chordProgressionEl.textContent = degrees.join('-');
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
        rollChordProgression();
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
            document.getElementById('reroll-chord-progression').addEventListener('click', rollChordProgression);
            document.getElementById('reroll-song-structure').addEventListener('click', rollStructure);
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
