document.addEventListener('DOMContentLoaded', () => {
    const timerNameInput = document.getElementById('timer-name');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const addTimerBtn = document.getElementById('add-timer');
    const timersContainer = document.getElementById('timers-container');
    const noTimersMessage = document.getElementById('no-timers-message');
    const notificationPrompt = document.getElementById('notification-prompt');
    const enableNotificationsBtn = document.getElementById('enable-notifications');
    const dismissNotificationsBtn = document.getElementById('dismiss-notifications');

    let timers = [];
    let timerIdCounter = 0;
    let notificationPermission = 'default';
    let wakeLock = null;

    const STORAGE_KEY = 'multiTimerApp_timers';
    const NOTIFICATION_DISMISSED_KEY = 'multiTimerApp_notificationDismissed';

    const alarmSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnMnBSl+zPLaizsIGGS56+ihUhELTKXh8bllHAU2j9b0z38qBSd6yfDckTsJE1yw6OyrWBUIQ5zd8sFuJAUuhM/z1YU1Bx1rwO7mnEoPDlOq5O+zYBoGPJPY88p2KAUme8rx3I4+CRZiturqpVQSC0mi4PK8aB8GM4nU8tGALAYjd8jv3ZI/CRJbr+fxsF4XCECa3PLEcSYELIHO8diJOQcZaLvt559NEAxPqOPwtmMcBjiP1/PMeS0GI3fH8N2RQAoUXrTp66hVFApGnt/yvmwhBTCG0fPTgjQGHW/A7eSaSQ0PVqzl77BeGQc9ltvyxnUoBSh+zPDaizsIGGS56+mjUREMTKPi8bllHAU1j9b0z4ArBSd6ye/ckTsJE1yw6OyrWRUIRJve8sFuJAUug8/y1oU2Bx1rwO7mnEoPDlOq5O+zYRsGPJLZ88p3KAUme8rx3I4+CRVht+rqpVQSC0mh4fK8aiAFM4nU8tGALAYjd8jv3ZI/CRJbr+fxsF4XCECa3PLEcSYGK4DN8tiIOQcZZ7zs56BODwxPpuPxtmQcBjiP1/PMeSwGI3fH8N+RQAoUXrTp66hVFApGnt/yv2wiBDCG0fPTgjQGHW/A7eSaSQ0PVqzl77BeGQc9ltrzxnUoBSh9y/HajDsIF2W56+mjUhEMTKPi8blnHAU1j9b0z4ArBSZ5ye/ckTwJElux6OyrWRUIRJve8sFuJAUug8/y1oU2Bx1rwO7mnEoPDlOq5O+zYRsGPJLZ88p3KAUme8rx3I4+CRVht+rqpVQSC0mh4fK8aiAFM4nU8tGALAYjd8jv3ZI/CRJbr+fxsF4XCECa3PLEcSYGK4DN8tiIOQcZZ7zs56BODwxPpuPxtmQcBjiP1/PMeSwGI3fH8N+RQAoUXrTp66hVFApGnt/yv2wiBDCG0fPTgjQGHW/A7eSaSQ0PVqzl77BeGQc9ltrzxnUoBSh9y/HajDsIF2W56+mjUhEMTKPi8blnHAU1j9b0z4ArBSZ5ye/ckTwJElux6OyrWRUIRJve8sFuJAUug8/y1oU2Bx1rwO7mnEoPDlOq5O+zYRsGPJLZ88p3KAUme8rx3I4+CRVht+rqpVQSC0mh4fK8aiAFM4nU8tGALAYjd8jv3ZI/CRJbr+fxsF4XCECa3PLEcSYGK4DN8tiIOQcZZ7zs56BODwxPpuPxtmQcBjiP1/PMeSwGI3fH8N+RQAoUXrTp66hVFApGnt/yv2wiBDCG0fPTgjQGHW/A7eSaSQ0PVqzl77BeGQc9ltrzxnUoBSh9y/HajDsIF2W56+mjUhEMTKPi8blnHAU1j9b0z4ArBSZ5ye/ckTwJElux6OyrWRUIRJve8sFuJAUug8/y1oU2Bx1rwO7mnEoPDlOq5O+zYRsGPJLZ88p3KAUme8rx3I4+CRVht+rqpVQSC0mh4fK8aiAFM4nU8tGALAYjd8jv3ZI/CRJbr+fxsF4XCECa3PLEcSYGK4DN8tiIOQcZZ7zs56BODwxPpuPxtmQcBjiP1/PMeSwGI3fH8N+RQAoUXrTp66hVFApGnt/yv2wiBDCG0fPTgjQGHW/A7eSaSQ0PVqzl77BeGQc9ltrzxnUoBSh9y/HajDsIF2W56+mjUhEMTKPi8blnHAU1j9b0z4ArBSZ5ye/ckTwJElux');

    loadTimers();
    checkNotificationPermission();
    requestWakeLock();

    addTimerBtn.addEventListener('click', addTimer);
    enableNotificationsBtn.addEventListener('click', requestNotificationPermission);
    dismissNotificationsBtn.addEventListener('click', dismissNotificationPrompt);

    timerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTimer();
    });

    [hoursInput, minutesInput, secondsInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTimer();
        });
    });

    function checkNotificationPermission() {
        if ('Notification' in window) {
            notificationPermission = Notification.permission;
            const dismissed = localStorage.getItem(NOTIFICATION_DISMISSED_KEY);
            
            if (notificationPermission === 'default' && !dismissed) {
                notificationPrompt.style.display = 'block';
            }
        }
    }

    async function requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            notificationPermission = permission;
            notificationPrompt.style.display = 'none';
        }
    }

    function dismissNotificationPrompt() {
        notificationPrompt.style.display = 'none';
        localStorage.setItem(NOTIFICATION_DISMISSED_KEY, 'true');
    }

    async function requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                wakeLock.addEventListener('release', () => {
                    console.log('Wake Lock released');
                });
            } catch (err) {
                console.log('Wake Lock not supported or denied:', err);
            }
        }
    }

    function addTimer() {
        const name = timerNameInput.value.trim() || 'Timer';
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (totalSeconds <= 0) {
            alert('Please enter a valid time duration');
            return;
        }

        const timer = {
            id: timerIdCounter++,
            name: name,
            totalSeconds: totalSeconds,
            remainingSeconds: totalSeconds,
            isRunning: false,
            isPaused: true,
            isExpired: false,
            startTime: 0,
            pausedTime: 0
        };

        timers.push(timer);
        saveTimers();
        renderTimers();

        timerNameInput.value = '';
        hoursInput.value = '0';
        minutesInput.value = '5';
        secondsInput.value = '0';
    }

    function pauseTimer(id) {
        const timer = timers.find(t => t.id === id);
        if (timer && !timer.isExpired) {
            timer.isPaused = true;
            timer.isRunning = false;
            timer.pausedTime = Date.now();
            saveTimers();
            renderTimers();
        }
    }

    function startTimer(id) {
        const timer = timers.find(t => t.id === id);
        if (timer && !timer.isExpired) {
            timer.isPaused = false;
            timer.isRunning = true;
            if (timer.startTime === 0) {
                timer.startTime = Date.now();
            } else {
                const pauseDuration = Date.now() - timer.pausedTime;
                timer.startTime += pauseDuration;
            }
            saveTimers();
            renderTimers();
        }
    }

    function deleteTimer(id) {
        timers = timers.filter(t => t.id !== id);
        saveTimers();
        renderTimers();
    }

    function resetTimer(id) {
        const timer = timers.find(t => t.id === id);
        if (timer) {
            timer.remainingSeconds = timer.totalSeconds;
            timer.isRunning = false;
            timer.isPaused = true;
            timer.isExpired = false;
            timer.startTime = 0;
            timer.pausedTime = 0;
            saveTimers();
            renderTimers();
        }
    }

    function updateTimers() {
        let needsFullRender = false;

        timers.forEach(timer => {
            if (timer.isRunning && !timer.isExpired) {
                const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
                timer.remainingSeconds = timer.totalSeconds - elapsed;

                if (timer.remainingSeconds <= 0) {
                    timer.remainingSeconds = 0;
                    timer.isExpired = true;
                    timer.isRunning = false;
                    onTimerExpire(timer);
                    needsFullRender = true;
                }
            }
        });

        if (needsFullRender) {
            saveTimers();
            renderTimers();
        } else {
            updateTimerDisplays();
        }
    }

    function updateTimerDisplays() {
        timers.forEach(timer => {
            const timerCard = timersContainer.querySelector(`[data-timer-id="${timer.id}"]`);
            if (timerCard) {
                const displayElement = timerCard.querySelector('.timer-display');
                if (displayElement) {
                    displayElement.textContent = formatTime(timer.remainingSeconds);
                }
            }
        });
    }

    function onTimerExpire(timer) {
        playAlarm();
        showNotification(timer.name);
    }

    function playAlarm() {
        let beepCount = 0;
        const totalBeeps = 5;
        const beepInterval = 500;
        
        function playBeep() {
            if (beepCount < totalBeeps) {
                alarmSound.currentTime = 0;
                alarmSound.play().catch(err => console.log('Audio play failed:', err));
                beepCount++;
                setTimeout(playBeep, beepInterval);
            }
        }
        
        playBeep();
    }

    function showNotification(timerName) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Expired!', {
                body: `${timerName} has finished`,
                icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn46yPC90ZXh0Pjwvc3ZnPg==',
                requireInteraction: true
            });
        }
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function renderTimers() {
        if (timers.length === 0) {
            timersContainer.innerHTML = '';
            noTimersMessage.style.display = 'block';
            return;
        }

        noTimersMessage.style.display = 'none';

        timersContainer.innerHTML = timers.map(timer => {
            const cardClass = timer.isExpired ? 'timer-card expired' : 
                            timer.isPaused ? 'timer-card paused' : 'timer-card';
            
            return `
                <div class="${cardClass}" data-timer-id="${timer.id}">
                    <div class="timer-name">${escapeHtml(timer.name)}</div>
                    <div class="timer-display">${formatTime(timer.remainingSeconds)}</div>
                    <div class="timer-controls">
                        ${timer.isExpired ? `
                            <button class="timer-btn" data-action="reset" data-timer-id="${timer.id}">Reset</button>
                        ` : `
                            ${timer.isPaused ? 
                                `<button class="timer-btn" data-action="start" data-timer-id="${timer.id}">${timer.startTime === 0 ? 'Start' : 'Resume'}</button>
                                <button class="timer-btn" data-action="reset" data-timer-id="${timer.id}">Reset</button>` :
                                `<button class="timer-btn" data-action="pause" data-timer-id="${timer.id}">Pause</button>`
                            }
                        `}
                        <button class="timer-btn delete" data-action="delete" data-timer-id="${timer.id}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function saveTimers() {
        const timersToSave = timers.map(timer => ({
            ...timer,
            savedAt: Date.now()
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timersToSave));
    }

    function loadTimers() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const loadedTimers = JSON.parse(saved);
                const now = Date.now();
                
                timers = loadedTimers.map(timer => {
                    if (timer.isRunning && !timer.isExpired) {
                        const timeSinceSave = now - timer.savedAt;
                        timer.startTime = now - (timer.totalSeconds - timer.remainingSeconds) * 1000 - timeSinceSave;
                    }
                    return timer;
                }).filter(timer => !timer.isExpired || timer.remainingSeconds === 0);

                if (timers.length > 0) {
                    timerIdCounter = Math.max(...timers.map(t => t.id)) + 1;
                }
            } catch (e) {
                console.error('Failed to load timers:', e);
                timers = [];
            }
        }
        renderTimers();
    }

    timersContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const timerId = parseInt(button.dataset.timerId);

        switch(action) {
            case 'start':
                startTimer(timerId);
                break;
            case 'pause':
                pauseTimer(timerId);
                break;
            case 'delete':
                deleteTimer(timerId);
                break;
            case 'reset':
                resetTimer(timerId);
                break;
        }
    });

    setInterval(updateTimers, 100);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateTimers();
        }
    });
});
