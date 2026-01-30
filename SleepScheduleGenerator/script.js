document.addEventListener('DOMContentLoaded', () => {
    const sleepDurationInput = document.getElementById('sleep-duration');
    const windDownInput = document.getElementById('wind-down');
    const wakeUpInput = document.getElementById('wake-up');
    const sleepTypeSelect = document.getElementById('sleep-type');
    const awakeTimesContainer = document.getElementById('awake-times-container');
    const addAwakeTimeBtn = document.getElementById('add-awake-time');
    const generateBtn = document.getElementById('generate-schedule');
    const scheduleOutput = document.getElementById('schedule-output');

    addAwakeTimeBtn.addEventListener('click', addAwakeTimeEntry);
    generateBtn.addEventListener('click', generateSchedule);

    function addAwakeTimeEntry() {
        const entry = document.createElement('div');
        entry.className = 'awake-time-entry';
        
        const timeRangeInputs = document.createElement('div');
        timeRangeInputs.className = 'time-range-inputs';
        
        const startInput = document.createElement('input');
        startInput.type = 'time';
        startInput.className = 'awake-time-start';
        startInput.value = '09:00';
        
        const separator = document.createElement('span');
        separator.className = 'time-separator';
        separator.textContent = 'to';
        
        const endInput = document.createElement('input');
        endInput.type = 'time';
        endInput.className = 'awake-time-end';
        endInput.value = '17:00';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-time-btn';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => {
            entry.remove();
            updateRemoveButtons();
        });
        
        timeRangeInputs.appendChild(startInput);
        timeRangeInputs.appendChild(separator);
        timeRangeInputs.appendChild(endInput);
        entry.appendChild(timeRangeInputs);
        entry.appendChild(removeBtn);
        awakeTimesContainer.appendChild(entry);
        
        updateRemoveButtons();
    }

    function updateRemoveButtons() {
        const entries = awakeTimesContainer.querySelectorAll('.awake-time-entry');
        entries.forEach((entry, index) => {
            const btn = entry.querySelector('.remove-time-btn');
            btn.disabled = entries.length === 1;
        });
    }

    function parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60) % 24;
        const mins = Math.floor(minutes % 60);
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    function formatDuration(hours) {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    }

    function calculateSleepCycles(hours) {
        const cycles = hours / 1.5;
        return cycles.toFixed(1);
    }

    function getAwakeRanges() {
        const entries = awakeTimesContainer.querySelectorAll('.awake-time-entry');
        const ranges = [];
        
        entries.forEach(entry => {
            const startInput = entry.querySelector('.awake-time-start');
            const endInput = entry.querySelector('.awake-time-end');
            
            if (startInput && endInput) {
                const start = parseTime(startInput.value);
                const end = parseTime(endInput.value);
                ranges.push({ start, end });
            }
        });
        
        return ranges.sort((a, b) => a.start - b.start);
    }

    function findAvailableGaps(awakeRanges, wakeUp = 0) {
        if (awakeRanges.length === 0) {
            return [{ start: 0, end: 1440, duration: 1440 }];
        }
        
        const gaps = [];
        
        for (let i = 0; i < awakeRanges.length; i++) {
            const currentRange = awakeRanges[i];
            const nextRange = awakeRanges[(i + 1) % awakeRanges.length];
            
            let gapStart = currentRange.end;
            let gapEnd = (nextRange.start - wakeUp + 1440) % 1440;
            
            if (i === awakeRanges.length - 1) {
                const firstGapEnd = (awakeRanges[0].start - wakeUp + 1440) % 1440;
                if (gapStart < 1440) {
                    let duration;
                    if (firstGapEnd >= gapStart) {
                        duration = firstGapEnd - gapStart;
                    } else {
                        duration = (1440 - gapStart) + firstGapEnd;
                    }
                    gaps.push({ start: gapStart, end: firstGapEnd, duration, wrapsAround: firstGapEnd < gapStart });
                }
            } else {
                let duration;
                if (gapEnd >= gapStart) {
                    duration = gapEnd - gapStart;
                } else {
                    duration = (1440 - gapStart) + gapEnd;
                }
                if (duration > 0) {
                    gaps.push({ start: gapStart, end: gapEnd, duration, wrapsAround: gapEnd < gapStart });
                }
            }
        }
        
        return gaps.sort((a, b) => b.duration - a.duration);
    }

    function generateMonophasicSchedules(sleepDuration, windDown, wakeUp, awakeRanges) {
        const sleepMinutes = sleepDuration * 60;
        const totalMinutes = sleepMinutes + windDown;
        const gaps = findAvailableGaps(awakeRanges, wakeUp);
        const schedules = [];
        
        const hasValidGap = gaps.some(gap => gap.duration >= totalMinutes);
        if (!hasValidGap) {
            return null;
        }
        
        for (const gap of gaps) {
            if (gap.duration >= totalMinutes) {
                const options = [];
                
                const latestStart = gap.wrapsAround 
                    ? (gap.start + gap.duration - totalMinutes) % 1440
                    : gap.end - totalMinutes;
                
                for (let offset = 0; offset <= Math.min(gap.duration - totalMinutes, 180); offset += 60) {
                    const sleepStart = (gap.start + offset) % 1440;
                    const bedtime = (sleepStart - windDown + 1440) % 1440;
                    const wakeTime = (sleepStart + sleepMinutes) % 1440;
                    const fullyAwakeTime = (wakeTime + wakeUp) % 1440;
                    
                    options.push({
                        periods: [{
                            bedtime: formatTime(bedtime),
                            sleepStart: formatTime(sleepStart),
                            wakeTime: formatTime(wakeTime),
                            fullyAwakeTime: formatTime(fullyAwakeTime),
                            duration: sleepDuration
                        }],
                        totalSleep: sleepDuration
                    });
                }
                
                schedules.push(...options);
                if (schedules.length >= 5) break;
            }
        }
        
        return schedules.length > 0 ? schedules.slice(0, 5) : null;
    }

    function generateBiphasicSchedules(sleepDuration, windDown, wakeUp, awakeRanges) {
        const coreSleep = sleepDuration * 0.7;
        const napSleep = sleepDuration * 0.3;
        
        const coreMinutes = coreSleep * 60;
        const napMinutes = napSleep * 60;
        const coreTotalMinutes = coreMinutes + windDown;
        const napTotalMinutes = napMinutes + windDown;
        
        const gaps = findAvailableGaps(awakeRanges, wakeUp);
        const schedules = [];
        
        if (awakeRanges.length === 0) {
            const coreBedtime = (23 * 60) - windDown;
            const coreSleepStart = 23 * 60;
            const coreWakeTime = (coreSleepStart + coreMinutes) % 1440;
            const coreFullyAwakeTime = (coreWakeTime + wakeUp) % 1440;
            
            const napBedtime = (14 * 60) - windDown;
            const napSleepStart = 14 * 60;
            const napWakeTime = napSleepStart + napMinutes;
            const napFullyAwakeTime = napWakeTime + wakeUp;
            
            schedules.push({
                periods: [
                    {
                        bedtime: formatTime(coreBedtime),
                        sleepStart: formatTime(coreSleepStart),
                        wakeTime: formatTime(coreWakeTime),
                        fullyAwakeTime: formatTime(coreFullyAwakeTime),
                        duration: coreSleep
                    },
                    {
                        bedtime: formatTime(napBedtime),
                        sleepStart: formatTime(napSleepStart),
                        wakeTime: formatTime(napWakeTime),
                        fullyAwakeTime: formatTime(napFullyAwakeTime),
                        duration: napSleep
                    }
                ],
                totalSleep: sleepDuration
            });
            return schedules;
        }
        
        if (gaps.length < 2) {
            return null;
        }
        
        const validCoreGaps = gaps.filter(gap => gap.duration >= coreTotalMinutes);
        const validNapGaps = gaps.filter(gap => gap.duration >= napTotalMinutes);
        
        if (validCoreGaps.length === 0 || validNapGaps.length === 0) {
            return null;
        }
        
        for (let i = 0; i < gaps.length && schedules.length < 3; i++) {
            for (let j = 0; j < gaps.length && schedules.length < 3; j++) {
                if (i === j) continue;
                
                const coreGap = gaps[i];
                const napGap = gaps[j];
                
                if (coreGap.duration >= coreTotalMinutes && napGap.duration >= napTotalMinutes) {
                    const coreSleepStart = coreGap.start;
                    const coreBedtime = (coreSleepStart - windDown + 1440) % 1440;
                    const coreWakeTime = (coreSleepStart + coreMinutes) % 1440;
                    const coreFullyAwakeTime = (coreWakeTime + wakeUp) % 1440;
                    
                    const napSleepStart = napGap.start;
                    const napBedtime = (napSleepStart - windDown + 1440) % 1440;
                    const napWakeTime = (napSleepStart + napMinutes) % 1440;
                    const napFullyAwakeTime = (napWakeTime + wakeUp) % 1440;
                    
                    schedules.push({
                        periods: [
                            {
                                bedtime: formatTime(coreBedtime),
                                sleepStart: formatTime(coreSleepStart),
                                wakeTime: formatTime(coreWakeTime),
                                fullyAwakeTime: formatTime(coreFullyAwakeTime),
                                duration: coreSleep
                            },
                            {
                                bedtime: formatTime(napBedtime),
                                sleepStart: formatTime(napSleepStart),
                                wakeTime: formatTime(napWakeTime),
                                fullyAwakeTime: formatTime(napFullyAwakeTime),
                                duration: napSleep
                            }
                        ],
                        totalSleep: sleepDuration
                    });
                }
            }
        }
        
        return schedules.length > 0 ? schedules : null;
    }

    function generatePolyphasicSchedules(sleepDuration, windDown, wakeUp, awakeRanges) {
        const numPeriods = 4;
        const sleepPerPeriod = sleepDuration / numPeriods;
        const minutesPerPeriod = sleepPerPeriod * 60;
        const totalPerPeriod = minutesPerPeriod + windDown;
        
        const gaps = findAvailableGaps(awakeRanges, wakeUp);
        const schedules = [];
        
        if (awakeRanges.length === 0) {
            const periods = [];
            const interval = 1440 / numPeriods;
            
            for (let i = 0; i < numPeriods; i++) {
                const sleepStart = i * interval;
                const bedtime = (sleepStart - windDown + 1440) % 1440;
                const wakeTime = (sleepStart + minutesPerPeriod) % 1440;
                const fullyAwakeTime = (wakeTime + wakeUp) % 1440;
                
                periods.push({
                    bedtime: formatTime(bedtime),
                    sleepStart: formatTime(sleepStart),
                    wakeTime: formatTime(wakeTime),
                    fullyAwakeTime: formatTime(fullyAwakeTime),
                    duration: sleepPerPeriod
                });
            }
            
            schedules.push({
                periods,
                totalSleep: sleepDuration,
                warning: 'Polyphasic sleep schedules require strict adherence and may not be suitable for everyone. Consult with a healthcare provider before attempting.'
            });
            return schedules;
        }
        
        const validGaps = gaps.filter(gap => gap.duration >= totalPerPeriod);
        
        if (validGaps.length < numPeriods) {
            return null;
        }
        
        for (let attempt = 0; attempt < 3 && schedules.length < 3; attempt++) {
            const periods = [];
            const usedGaps = validGaps.slice(attempt, attempt + numPeriods);
            
            if (usedGaps.length < numPeriods) break;
            
            for (let i = 0; i < numPeriods; i++) {
                const gap = usedGaps[i];
                const offset = attempt * 30;
                const sleepStart = (gap.start + offset) % 1440;
                const bedtime = (sleepStart - windDown + 1440) % 1440;
                const wakeTime = (sleepStart + minutesPerPeriod) % 1440;
                const fullyAwakeTime = (wakeTime + wakeUp) % 1440;
                
                periods.push({
                    bedtime: formatTime(bedtime),
                    sleepStart: formatTime(sleepStart),
                    wakeTime: formatTime(wakeTime),
                    fullyAwakeTime: formatTime(fullyAwakeTime),
                    duration: sleepPerPeriod
                });
            }
            
            periods.sort((a, b) => parseTime(a.sleepStart) - parseTime(b.sleepStart));
            
            schedules.push({
                periods,
                totalSleep: sleepDuration,
                warning: 'Polyphasic sleep schedules require strict adherence and may not be suitable for everyone. Consult with a healthcare provider before attempting.'
            });
        }
        
        return schedules.length > 0 ? schedules : null;
    }

    function generateSchedule() {
        const sleepDuration = parseFloat(sleepDurationInput.value);
        const windDown = parseInt(windDownInput.value);
        const wakeUp = parseInt(wakeUpInput.value);
        const sleepType = sleepTypeSelect.value;
        const awakeRanges = getAwakeRanges();
        
        if (!sleepDuration || sleepDuration <= 0) {
            displayError('Please enter a valid sleep duration.');
            return;
        }
        
        if (windDown < 0) {
            displayError('Wind down time cannot be negative.');
            return;
        }
        
        if (wakeUp < 0) {
            displayError('Wake up time cannot be negative.');
            return;
        }
        
        let schedules;
        
        switch (sleepType) {
            case 'monophasic':
                schedules = generateMonophasicSchedules(sleepDuration, windDown, wakeUp, awakeRanges);
                break;
            case 'biphasic':
                schedules = generateBiphasicSchedules(sleepDuration, windDown, wakeUp, awakeRanges);
                break;
            case 'polyphasic':
                schedules = generatePolyphasicSchedules(sleepDuration, windDown, wakeUp, awakeRanges);
                break;
            default:
                displayError('Invalid sleep type selected.');
                return;
        }
        
        if (!schedules || schedules.length === 0) {
            const sleepTypeName = {
                'monophasic': 'monophasic',
                'biphasic': 'biphasic',
                'polyphasic': 'polyphasic'
            }[sleepType];
            displayError(`No available schedules found. Your required awake time ranges do not leave enough continuous time for ${formatDuration(sleepDuration)} of ${sleepTypeName} sleep (including ${windDown} minutes wind-down time and ${wakeUp} minutes wake-up time). Please adjust your awake time ranges or reduce your sleep duration.`);
            return;
        }
        
        displaySchedules(schedules, sleepType, windDown, wakeUp);
    }

    function displayError(message) {
        scheduleOutput.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${message}
            </div>
        `;
        scheduleOutput.classList.remove('empty');
    }

    function displaySchedules(schedules, sleepType, windDown, wakeUp) {
        const sleepTypeName = {
            'monophasic': 'Monophasic',
            'biphasic': 'Biphasic',
            'polyphasic': 'Polyphasic'
        }[sleepType];
        
        let html = `
            <div class="schedule-header">
                <h2>${sleepTypeName} Sleep Schedule Options</h2>
                <div class="schedule-info">
                    Found ${schedules.length} schedule option${schedules.length > 1 ? 's' : ''} | 
                    Total Sleep: ${formatDuration(schedules[0].totalSleep)} | 
                    Wind Down: ${windDown} min | Wake Up: ${wakeUp} min
                </div>
            </div>
        `;
        
        if (schedules[0].warning) {
            html += `
                <div class="warning-message">
                    <strong>⚠ Warning:</strong> ${schedules[0].warning}
                </div>
            `;
        }
        
        html += '<div class="schedule-options-container">';
        
        schedules.forEach((schedule, index) => {
            html += `
                <div class="schedule-option">
                    <div class="option-number">Option ${index + 1}</div>
            `;
            
            schedule.periods.forEach(period => {
                html += `
                    <div class="sleep-period">
                        <div class="sleep-period-details">
                            <div class="detail-item">
                                <span class="detail-label">Wind Down Time</span>
                                <span class="detail-value">${period.bedtime}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Sleep Time</span>
                                <span class="detail-value">${period.sleepStart}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Wake Up Time</span>
                                <span class="detail-value">${period.wakeTime}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fully Awake Time</span>
                                <span class="detail-value">${period.fullyAwakeTime}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Sleep Duration</span>
                                <span class="detail-value">${formatDuration(period.duration)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Sleep Cycles</span>
                                <span class="detail-value">${calculateSleepCycles(period.duration)} cycles</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        
        scheduleOutput.innerHTML = html;
        scheduleOutput.classList.remove('empty');
    }

    updateRemoveButtons();
});
