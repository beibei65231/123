/**
 * 晨曦 Dawn - 清晨安静学习房间
 * 温暖木质 · 半透明玻璃拟态 · 沉浸式空间感
 */

(function() {
    'use strict';

    // ================================================
    // 场景配置 - 清晨自然风格
    // ================================================
    const SCENES = {
        'morning-sky': {
            name: '晨曦天空',
            image: 'https://images.unsplash.com/photo-1495195129352-aeb325a55b65?w=1920&q=80',
            dustColor: 'rgba(232, 200, 122, 0.4)'
        },
        'mountain': {
            name: '山景晨雾',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
            dustColor: 'rgba(200, 210, 220, 0.3)'
        },
        'forest': {
            name: '森林清晨',
            image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
            dustColor: 'rgba(180, 220, 160, 0.3)'
        },
        'rain': {
            name: '雨天窗边',
            image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1920&q=80',
            dustColor: 'rgba(180, 200, 220, 0.3)'
        },
        'cafe': {
            name: '咖啡馆',
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80',
            dustColor: 'rgba(232, 200, 122, 0.3)'
        },
        'library': {
            name: '图书馆',
            image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80',
            dustColor: 'rgba(200, 190, 175, 0.3)'
        },
        'city-dawn': {
            name: '都市黎明',
            image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
            dustColor: 'rgba(200, 200, 220, 0.3)'
        },
        'minimal-room': {
            name: '简约书房',
            image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920&q=80',
            dustColor: 'rgba(232, 200, 122, 0.35)'
        },
        'window-plants': {
            name: '窗边绿植',
            image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80',
            dustColor: 'rgba(180, 210, 160, 0.3)'
        }
    };

    // 音频源
    const AUDIO_SRC = {
        rain: 'https://cdn.pixabay.com/audio/2022/03/10/audio_8cb749c841.mp3',
        cafe: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff4bba.mp3',
        night: 'https://cdn.pixabay.com/audio/2021/08/04/audio_064bdfec7f.mp3',
        wind: 'https://cdn.pixabay.com/audio/2022/03/15/audio_9e5df6d0e4.mp3',
        fire: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8d8e0d8e5.mp3',
        waves: 'https://cdn.pixabay.com/audio/2021/08/04/audio_064bdfec7f.mp3',
        birds: 'https://cdn.pixabay.com/audio/2022/02/23/audio_f6b5ddc8c6.mp3',
        white: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff4bba.mp3',
        notify: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3'
    };

    // 预设配置 - 清晨主题
    const PRESETS = {
        morning: { birds: 30, wind: 15 },
        rainy: { rain: 70, wind: 20 },
        cafe: { cafe: 50, fire: 20 },
        focus: { night: 40, white: 30 },
        calm: { forest: 60, wind: 20, birds: 15 }
    };

    // ================================================
    // 应用状态
    // ================================================
    const state = {
        page: 'home',
        scene: 'morning-sky',
        settings: { brightness: 50, blur: 10 },
        audio: {
            channels: { rain: 0, cafe: 30, night: 20, wind: 0, fire: 0, waves: 0, birds: 0, white: 0 },
            masterVolume: 50,
            playing: false
        },
        timer: {
            duration: 25,
            remaining: 25 * 60,
            running: false,
            autoNext: false,
            restTime: 10,
            soundType: 'gentle'
        },
        stats: { todayMins: 0, todayPomo: 0, weekly: [0,0,0,0,0,0,0], streak: 0 },
        tasks: []
    };

    // ================================================
    // DOM 缓存
    // ================================================
    const $ = {};

    function cacheDOM() {
        $.bgPhoto = document.getElementById('bg-photo');
        $.dustContainer = document.getElementById('dust-particles');
        $.topHeader = document.getElementById('top-header');
        $.musicStatus = document.getElementById('music-status');
        $.navBtns = document.querySelectorAll('.nav-btn');
        $.pages = document.querySelectorAll('.page');
        $.startBtn = document.getElementById('start-btn');
        $.exploreBtn = document.getElementById('explore-btn');
        $.sceneCards = document.querySelectorAll('.scene-card');
        $.brightnessSlider = document.getElementById('brightness-slider');
        $.blurSlider = document.getElementById('blur-slider');
        $.brightnessVal = document.getElementById('brightness-val');
        $.blurVal = document.getElementById('blur-val');
        $.applySceneBtn = document.getElementById('apply-scene-btn');
        $.channelSliders = document.querySelectorAll('.channel-slider');
        $.masterVolume = document.getElementById('master-volume');
        $.volumeVal = document.getElementById('volume-val');
        $.playBtn = document.getElementById('play-btn');
        $.presetBtns = document.querySelectorAll('.preset-btn');
        $.timerProgress = document.getElementById('timer-progress');
        $.timerDisplay = document.getElementById('timer-display');
        $.timerLabel = document.getElementById('timer-label');
        $.presetTimes = document.querySelectorAll('.preset-time');
        $.timerStartBtn = document.getElementById('timer-start-btn');
        $.timerPauseBtn = document.getElementById('timer-pause-btn');
        $.timerResetBtn = document.getElementById('timer-reset-btn');
        $.autoToggle = document.getElementById('auto-toggle');
        $.restBtns = document.querySelectorAll('[data-rest]');
        $.soundBtns = document.querySelectorAll('[data-sound]');
        $.todayMinutes = document.getElementById('today-minutes');
        $.todayPomodoros = document.getElementById('today-pomodoros');
        $.planMinutes = document.getElementById('plan-minutes');
        $.planDone = document.getElementById('plan-done');
        $.planStreak = document.getElementById('plan-streak');
        $.taskInput = document.getElementById('task-input');
        $.taskPomo = document.getElementById('task-pomo');
        $.taskAddBtn = document.getElementById('task-add-btn');
        $.taskList = document.getElementById('task-list');
        $.clearDoneBtn = document.getElementById('clear-done-btn');
        $.toastBox = document.getElementById('toast-box');
        $.audios = {};
        ['rain', 'cafe', 'night', 'wind', 'fire', 'waves', 'birds', 'white', 'notify'].forEach(k => {
            $.audios[k] = document.getElementById('audio-' + k);
        });
    }

    // ================================================
    // 数据持久化
    // ================================================
    function loadState() {
        try {
            const saved = localStorage.getItem('dawn-state');
            if (saved) {
                const data = JSON.parse(saved);
                state.scene = data.scene || 'morning-sky';
                state.settings = data.settings || state.settings;
                state.audio.channels = data.channels || state.audio.channels;
                state.audio.masterVolume = data.masterVolume || 50;
                state.stats = data.stats || state.stats;
                state.tasks = data.tasks || [];
            }
        } catch(e) {}
        checkNewDay();
    }

    function saveState() {
        try {
            localStorage.setItem('dawn-state', JSON.stringify({
                scene: state.scene,
                settings: state.settings,
                channels: state.audio.channels,
                masterVolume: state.audio.masterVolume,
                stats: state.stats,
                tasks: state.tasks
            }));
        } catch(e) {}
    }

    function checkNewDay() {
        const today = new Date().toISOString().split('T')[0];
        const last = localStorage.getItem('dawn-date');
        if (last !== today) {
            if (last && state.stats.todayMins > 0) {
                const idx = getDayIndex();
                state.stats.weekly[idx === 0 ? 6 : idx - 1] = state.stats.todayMins;
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (last === yesterday.toISOString().split('T')[0] && state.stats.todayMins >= 30) {
                    state.stats.streak++;
                } else {
                    state.stats.streak = 1;
                }
            }
            state.stats.todayMins = 0;
            state.stats.todayPomo = 0;
            localStorage.setItem('dawn-date', today);
            saveState();
        }
    }

    function getDayIndex() {
        const d = new Date().getDay();
        return d === 0 ? 6 : d - 1;
    }

    // ================================================
    // 页面导航
    // ================================================
    function goTo(page) {
        state.page = page;
        $.navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));
        $.pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
        if (page === 'timer') updateTimerDisplay();
        if (page === 'plan') updatePlanDisplay();
    }

    // ================================================
    // 场景系统
    // ================================================
    function setScene(scene) {
        const config = SCENES[scene];
        if (!config) return;

        state.scene = scene;

        // 预加载图片
        const img = new Image();
        img.onload = () => {
            $.bgPhoto.src = config.image;
            $.bgPhoto.classList.add('active');
            createDustParticles(config.dustColor);
        };
        img.src = config.image;

        // 更新 UI
        $.sceneCards.forEach(card => card.classList.toggle('active', card.dataset.scene === scene));
    }

    function applySceneSettings() {
        const b = state.settings.brightness;
        const bl = state.settings.blur;
        $.bgPhoto.style.filter = `brightness(${b / 100}) blur(${bl}px)`;
        saveState();
        showToast('场景设置已应用');
    }

    // ================================================
    // 灰尘微粒效果
    // ================================================
    function createDustParticles(color) {
        if (!$.dustContainer) return;

        // 清除现有粒子
        $.dustContainer.innerHTML = '';

        // 创建新粒子
        const count = 20;
        for (let i = 0; i < count; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust';
            dust.style.left = Math.random() * 100 + '%';
            dust.style.animationDuration = (15 + Math.random() * 20) + 's';
            dust.style.animationDelay = Math.random() * 15 + 's';
            dust.style.width = (2 + Math.random() * 3) + 'px';
            dust.style.height = dust.style.width;
            dust.style.background = color || 'rgba(232, 200, 122, 0.4)';
            $.dustContainer.appendChild(dust);
        }
    }

    // ================================================
    // 顶部导航滚动效果
    // ================================================
    function initHeaderScroll() {
        const pageContainer = document.querySelector('.page-container');
        if (!pageContainer) return;

        pageContainer.addEventListener('scroll', () => {
            if (pageContainer.scrollTop > 20) {
                $.topHeader.classList.add('scrolled');
            } else {
                $.topHeader.classList.remove('scrolled');
            }
        });
    }

    // ================================================
    // 音频系统
    // ================================================
    function initAudio() {
        Object.keys(AUDIO_SRC).forEach(key => {
            if ($.audios[key] && AUDIO_SRC[key]) {
                $.audios[key].src = AUDIO_SRC[key];
                $.audios[key].volume = (state.audio.channels[key] || 0) / 100 * state.audio.masterVolume / 100;
            }
        });
    }

    function setChannelVolume(channel, val) {
        state.audio.channels[channel] = val;
        if ($.audios[channel]) {
            $.audios[channel].volume = val / 100 * state.audio.masterVolume / 100;
        }

        // 更新 UI
        const slider = document.querySelector(`.mixer-channel[data-channel="${channel}"] .channel-slider`);
        const levelFill = document.querySelector(`.mixer-channel[data-channel="${channel}"] .level-fill`);
        if (slider) slider.value = val;
        if (levelFill) levelFill.style.height = val + '%';

        saveState();
    }

    function togglePlay() {
        state.audio.playing = !state.audio.playing;

        const dot = $.musicStatus.querySelector('.status-dot');
        const text = $.musicStatus.querySelector('.status-text');

        if (state.audio.playing) {
            Object.keys(state.audio.channels).forEach(key => {
                if (state.audio.channels[key] > 0 && $.audios[key]) {
                    $.audios[key].play().catch(() => {});
                }
            });
            $.playBtn.classList.add('playing');
            $.playBtn.querySelector('.play-icon').textContent = '⏸';
            $.playBtn.querySelector('.play-text').textContent = '暂停';
            dot.classList.add('active');
            text.textContent = '音乐播放中';
        } else {
            Object.keys($.audios).forEach(key => {
                if ($.audios[key]) $.audios[key].pause();
            });
            $.playBtn.classList.remove('playing');
            $.playBtn.querySelector('.play-icon').textContent = '▶';
            $.playBtn.querySelector('.play-text').textContent = '播放';
            dot.classList.remove('active');
            text.textContent = '音乐关闭';
        }
    }

    function applyPreset(preset) {
        const config = PRESETS[preset];
        if (!config) return;

        // 先重置所有通道
        Object.keys(state.audio.channels).forEach(key => {
            setChannelVolume(key, 0);
        });

        // 应用预设
        Object.keys(config).forEach(key => {
            setChannelVolume(key, config[key]);
        });

        if (state.audio.playing) {
            Object.keys($.audios).forEach(key => $.audios[key]?.pause());
            Object.keys(state.audio.channels).forEach(key => {
                if (state.audio.channels[key] > 0) $.audios[key]?.play().catch(() => {});
            });
        }

        showToast('已应用预设');
    }

    // ================================================
    // 番茄钟
    // ================================================
    function updateTimerDisplay() {
        const m = Math.floor(state.timer.remaining / 60);
        const s = state.timer.remaining % 60;
        $.timerDisplay.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

        const progress = state.timer.remaining / (state.timer.duration * 60);
        $.timerProgress.style.strokeDashoffset = 754 * (1 - progress);

        $.todayMinutes.textContent = state.stats.todayMins;
        $.todayPomodoros.textContent = state.stats.todayPomo;
    }

    function startTimer() {
        if (state.timer.running) return;
        state.timer.running = true;

        $.timerStartBtn.classList.add('hidden');
        $.timerPauseBtn.classList.remove('hidden');
        $.timerLabel.textContent = '专注中';

        state.timer.interval = setInterval(() => {
            state.timer.remaining--;

            if (state.timer.remaining % 60 === 0 && state.timer.remaining > 0) {
                state.stats.todayMins++;
                state.stats.weekly[getDayIndex()] = state.stats.todayMins;
                updateTimerDisplay();
                saveState();
            }

            updateTimerDisplay();

            if (state.timer.remaining <= 0) {
                completeTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        state.timer.running = false;
        clearInterval(state.timer.interval);

        $.timerStartBtn.classList.remove('hidden');
        $.timerPauseBtn.classList.add('hidden');
        $.timerLabel.textContent = '已暂停';
    }

    function resetTimer() {
        pauseTimer();
        state.timer.remaining = state.timer.duration * 60;
        updateTimerDisplay();
        $.timerLabel.textContent = '准备开始';
    }

    function completeTimer() {
        pauseTimer();
        state.stats.todayPomo++;
        saveState();

        if (state.timer.soundType !== 'none' && $.audios.notify) {
            $.audios.notify.src = AUDIO_SRC.notify;
            $.audios.notify.play().catch(() => {});
        }

        showToast('专注完成！');

        state.timer.remaining = state.timer.duration * 60;
        updateTimerDisplay();
        $.timerLabel.textContent = '准备开始';

        // 自动开始休息
        if (state.timer.autoNext) {
            state.timer.duration = state.timer.restTime;
            state.timer.remaining = state.timer.restTime * 60;
            $.timerLabel.textContent = '休息时间';
            setTimeout(startTimer, 2000);
        }
    }

    function setDuration(m) {
        pauseTimer();
        state.timer.duration = m;
        state.timer.remaining = m * 60;
        updateTimerDisplay();
        $.timerLabel.textContent = '准备开始';
    }

    // ================================================
    // 任务系统
    // ================================================
    function addTask() {
        const text = $.taskInput.value.trim();
        if (!text) return;

        const pomos = parseInt($.taskPomo.value) || 2;

        state.tasks.unshift({
            id: Date.now(),
            text,
            pomos,
            done: 0,
            completed: false
        });

        $.taskInput.value = '';
        $.taskPomo.value = '2';

        renderTasks();
        saveState();
    }

    function toggleTask(id) {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
            updatePlanDisplay();
            saveState();
        }
    }

    function deleteTask(id) {
        state.tasks = state.tasks.filter(t => t.id !== id);
        renderTasks();
        saveState();
    }

    function clearDoneTasks() {
        state.tasks = state.tasks.filter(t => !t.completed);
        renderTasks();
        saveState();
    }

    function renderTasks() {
        $.taskList.innerHTML = '';

        state.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'done' : '';
            li.innerHTML = `
                <div class="task-check ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <span class="task-meta">${task.pomos}番茄</span>
                </div>
                <button class="task-delete" data-id="${task.id}">×</button>
            `;

            li.querySelector('.task-check').onclick = e => toggleTask(Number(e.currentTarget.dataset.id));
            li.querySelector('.task-delete').onclick = e => deleteTask(Number(e.currentTarget.dataset.id));

            $.taskList.appendChild(li);
        });
    }

    function updatePlanDisplay() {
        $.planMinutes.textContent = state.stats.todayMins;
        $.planDone.textContent = state.tasks.filter(t => t.completed).length;
        $.planStreak.textContent = state.stats.streak;

        const max = Math.max(...state.stats.weekly, 60);
        for (let i = 0; i < 7; i++) {
            const bar = document.getElementById('bar-' + i);
            if (bar) {
                const h = Math.max(4, (state.stats.weekly[i] / max) * 76);
                bar.style.height = h + 'px';
            }
        }
    }

    // ================================================
    // Toast
    // ================================================
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = msg;
        $.toastBox.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ================================================
    // 事件绑定
    // ================================================
    function bindEvents() {
        // 导航
        $.navBtns.forEach(btn => btn.onclick = () => goTo(btn.dataset.page));

        // 首页
        $.startBtn.onclick = () => goTo('timer');
        $.exploreBtn.onclick = () => goTo('scene');

        // 场景
        $.sceneCards.forEach(card => card.onclick = () => setScene(card.dataset.scene));

        $.brightnessSlider.oninput = e => {
            state.settings.brightness = e.target.value;
            $.brightnessVal.textContent = e.target.value + '%';
        };
        $.blurSlider.oninput = e => {
            state.settings.blur = e.target.value;
            $.blurVal.textContent = e.target.value + '%';
        };
        $.applySceneBtn.onclick = applySceneSettings;

        // 音频
        $.channelSliders.forEach(slider => {
            slider.oninput = e => setChannelVolume(e.target.closest('.mixer-channel').dataset.channel, e.target.value);
        });
        $.masterVolume.oninput = e => {
            state.audio.masterVolume = e.target.value;
            $.volumeVal.textContent = e.target.value + '%';
            Object.keys(state.audio.channels).forEach(key => {
                if ($.audios[key]) {
                    $.audios[key].volume = state.audio.channels[key] / 100 * e.target.value / 100;
                }
            });
            saveState();
        };
        $.playBtn.onclick = togglePlay;
        $.presetBtns.forEach(btn => btn.onclick = () => applyPreset(btn.dataset.preset));

        // 专注
        $.presetTimes.forEach(btn => {
            btn.onclick = () => {
                $.presetTimes.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                setDuration(Number(btn.dataset.time));
            };
        });
        $.timerStartBtn.onclick = startTimer;
        $.timerPauseBtn.onclick = pauseTimer;
        $.timerResetBtn.onclick = resetTimer;

        $.autoToggle.onclick = () => {
            state.timer.autoNext = !state.timer.autoNext;
            $.autoToggle.classList.toggle('active', state.timer.autoNext);
        };

        $.restBtns.forEach(btn => {
            btn.onclick = () => {
                $.restBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.timer.restTime = Number(btn.dataset.rest);
            };
        });

        $.soundBtns.forEach(btn => {
            btn.onclick = () => {
                $.soundBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.timer.soundType = btn.dataset.sound;
            };
        });

        // 任务
        $.taskAddBtn.onclick = addTask;
        $.taskInput.onkeypress = e => { if (e.key === 'Enter') addTask(); };
        $.clearDoneBtn.onclick = clearDoneTasks;

        // 窗口
        window.onresize = () => {
            createDustParticles(SCENES[state.scene]?.dustColor);
        };
    }

    // ================================================
    // 初始化
    // ================================================
    function init() {
        cacheDOM();
        loadState();
        initAudio();
        bindEvents();
        initHeaderScroll();

        // 初始化显示
        setScene(state.scene);
        updateTimerDisplay();
        renderTasks();
        updatePlanDisplay();

        // 应用保存的设置
        $.brightnessSlider.value = state.settings.brightness;
        $.blurSlider.value = state.settings.blur;
        $.brightnessVal.textContent = state.settings.brightness + '%';
        $.blurVal.textContent = state.settings.blur + '%';

        $.masterVolume.value = state.audio.masterVolume;
        $.volumeVal.textContent = state.audio.masterVolume + '%';

        // 音频通道 UI
        Object.keys(state.audio.channels).forEach(key => {
            const slider = document.querySelector(`.mixer-channel[data-channel="${key}"] .channel-slider`);
            const levelFill = document.querySelector(`.mixer-channel[data-channel="${key}"] .level-fill`);
            if (slider) slider.value = state.audio.channels[key];
            if (levelFill) levelFill.style.height = state.audio.channels[key] + '%';
        });

        // 恢复 toggle 状态
        $.autoToggle.classList.toggle('active', state.timer.autoNext);

        // 恢复休息时长按钮状态
        $.restBtns.forEach(btn => {
            btn.classList.toggle('active', Number(btn.dataset.rest) === state.timer.restTime);
        });

        // 恢复音效按钮状态
        $.soundBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sound === state.timer.soundType);
        });

        // 创建灰尘微粒
        createDustParticles(SCENES[state.scene]?.dustColor);
    }

    document.addEventListener('DOMContentLoaded', init);

})();
