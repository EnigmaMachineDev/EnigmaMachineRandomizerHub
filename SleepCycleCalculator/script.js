const CYCLE_MINUTES = 90;
const MIN_RECOMMENDED_CYCLES = 5;
const MAX_RECOMMENDED_CYCLES = 6;
const MAX_CYCLES = 6;

const btnBedtime = document.getElementById('btn-bedtime');
const btnWaketime = document.getElementById('btn-waketime');
const bedtimeGroup = document.getElementById('bedtime-group');
const waketimeGroup = document.getElementById('waketime-group');
const bedtimeInput = document.getElementById('bedtime-input');
const waketimeInput = document.getElementById('waketime-input');
const fallAsleepInput = document.getElementById('fallasleep-input');
const calculateBtn = document.getElementById('calculate-btn');
const resultsOutput = document.getElementById('results-output');

let mode = 'bedtime';

btnBedtime.addEventListener('click', () => {
    mode = 'bedtime';
    btnBedtime.classList.add('active');
    btnWaketime.classList.remove('active');
    bedtimeGroup.style.display = '';
    waketimeGroup.style.display = 'none';
    resultsOutput.innerHTML = '';
});

btnWaketime.addEventListener('click', () => {
    mode = 'waketime';
    btnWaketime.classList.add('active');
    btnBedtime.classList.remove('active');
    waketimeGroup.style.display = '';
    bedtimeGroup.style.display = 'none';
    resultsOutput.innerHTML = '';
});

calculateBtn.addEventListener('click', calculate);

function parseTimeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function formatMinutes(totalMinutes) {
    const mins = ((totalMinutes % 1440) + 1440) % 1440;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h < 12 ? 'AM' : 'PM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m.toString().padStart(2, '0');
    return `${displayH}:${displayM} ${period}`;
}

function formatDuration(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

function calculate() {
    const fallAsleep = parseInt(fallAsleepInput.value) || 0;

    if (mode === 'bedtime') {
        const bedtimeVal = bedtimeInput.value;
        if (!bedtimeVal) {
            showError('Please enter a bed time.');
            return;
        }
        const bedtimeMinutes = parseTimeToMinutes(bedtimeVal);
        const sleepStartMinutes = bedtimeMinutes + fallAsleep;
        renderResults(sleepStartMinutes, 'wake', bedtimeMinutes, fallAsleep);
    } else {
        const waketimeVal = waketimeInput.value;
        if (!waketimeVal) {
            showError('Please enter a wake time.');
            return;
        }
        const wakeMinutes = parseTimeToMinutes(waketimeVal);
        renderResults(wakeMinutes, 'bed', null, fallAsleep);
    }
}

function renderResults(anchorMinutes, direction, bedtimeMinutes, fallAsleep) {
    resultsOutput.innerHTML = '';

    const cards = [];

    for (let cycles = 1; cycles <= MAX_CYCLES; cycles++) {
        const cycleTotalMinutes = cycles * CYCLE_MINUTES;

        let targetMinutes;
        if (direction === 'wake') {
            targetMinutes = anchorMinutes + cycleTotalMinutes;
        } else {
            targetMinutes = anchorMinutes - cycleTotalMinutes - fallAsleep;
        }

        const isRecommended = cycles >= MIN_RECOMMENDED_CYCLES && cycles <= MAX_RECOMMENDED_CYCLES;

        cards.push({
            cycles,
            cycleTotalMinutes,
            targetMinutes,
            isRecommended
        });
    }

    let headerText;
    if (direction === 'wake') {
        headerText = `Bed time: <span>${formatMinutes(bedtimeMinutes)}</span> &nbsp;|&nbsp; Falls asleep: <span>${formatMinutes(anchorMinutes)}</span>`;
    } else {
        headerText = `Wake time: <span>${formatMinutes(anchorMinutes)}</span> &nbsp;|&nbsp; Fall asleep offset: <span>${fallAsleep} min</span>`;
    }

    const header = document.createElement('div');
    header.className = 'results-header';
    header.innerHTML = headerText;
    resultsOutput.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'results-grid';

    cards.forEach(({ cycles, cycleTotalMinutes, targetMinutes, isRecommended }) => {
        const card = document.createElement('div');
        card.className = 'cycle-card' + (isRecommended ? ' recommended' : '');

        const label = direction === 'wake' ? 'Wake up at' : 'Go to bed at';

        card.innerHTML = `
            <div class="cycle-left">
                <span class="cycle-label">${label}</span>
                <span class="cycle-time">${formatMinutes(targetMinutes)}</span>
            </div>
            <div class="cycle-right">
                <span class="cycle-count">${cycles} cycle${cycles > 1 ? 's' : ''}</span>
                <span class="cycle-duration">${formatDuration(cycleTotalMinutes)} of sleep</span>
                ${isRecommended ? '<span class="cycle-badge">Recommended</span>' : ''}
            </div>
        `;

        grid.appendChild(card);
    });

    resultsOutput.appendChild(grid);
}

function showError(msg) {
    resultsOutput.innerHTML = `<div class="error-message">${msg}</div>`;
}
