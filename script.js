/* ============================================================
   MAIN SCRIPT — Personal Website
   ============================================================ */

(function () {
  'use strict';

  // ── DOM References ──────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const loader       = $('#loader');
  const cursorGlow   = $('#cursor-glow');
  const canvas       = $('#particles');
  const ctx          = canvas.getContext('2d');
  const nav          = $('#nav');
  const clockEl      = $('#clock');
  const heroDateEl   = $('#hero-date');
  const musicBtn     = $('#music-btn');
  const themeBtn     = $('#theme-btn');
  const surpriseStar = $('#surprise-star');
  const letterModal  = $('#letter-modal');
  const lightbox     = $('#lightbox');
  const lightboxContent = $('.lightbox-content');

  // ── State ───────────────────────────────────────────────────
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX  = mouseX;
  let glowY  = mouseY;
  let isMobile = window.matchMedia('(pointer: coarse)').matches;
  let audioCtx = null;
  let isPlaying = false;

  // ============================================================
  //  1. PARTICLE SYSTEM
  // ============================================================
  const particles = [];
  const PARTICLE_COUNT = isMobile ? 40 : 80;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const colors = [
      `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--particle-color')}, `,
    ];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 0.4 + 0.1),
      opacity: Math.random() * 0.5 + 0.1,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      color: colors[0],
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      // Update position
      p.x += p.dx;
      p.y += p.dy;

      // Twinkle
      p.opacity += p.opacityDir * 0.003;
      if (p.opacity >= 0.6) p.opacityDir = -1;
      if (p.opacity <= 0.05) p.opacityDir = 1;

      // Reset if off screen
      if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
        p.x = Math.random() * canvas.width;
        p.y = canvas.height + 10;
        p.opacity = 0.05;
      }

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }

  // ============================================================
  //  2. MOUSE GLOW FOLLOWER
  // ============================================================
  function updateGlow() {
    if (isMobile) return;

    // Smooth lerp
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';

    requestAnimationFrame(updateGlow);
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursorGlow.classList.contains('visible')) {
      cursorGlow.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('visible');
  });

  // ============================================================
  //  3. CLOCK & DATE
  // ============================================================
  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateClock() {
    const now = new Date();
    clockEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }

  function updateDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const w = WEEKDAYS[now.getDay()];
    heroDateEl.textContent = y + '年' + m + '月' + d + '日  星期' + w;
  }

  // ============================================================
  //  4. SCROLL REVEAL (Intersection Observer)
  // ============================================================
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    $$('[data-reveal]').forEach((el) => observer.observe(el));
  }

  // ============================================================
  //  5. HERO REVEAL ON LOAD
  // ============================================================
  function revealHero() {
    const name = $('.hero-name');
    const tagline = $('.hero-tagline');
    // Slight delay for dramatic effect
    setTimeout(() => name.classList.add('revealed'), 200);
    setTimeout(() => tagline.classList.add('revealed'), 500);
  }

  // ============================================================
  //  6. QUOTE TYPEWRITER EFFECT
  // ============================================================
  function initTypewriter() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('typing');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    $$('.quote-item').forEach((el) => observer.observe(el));
  }

  // ============================================================
  //  7. GALLERY LIGHTBOX
  // ============================================================
  function initLightbox() {
    $$('.masonry-item').forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;

        lightboxContent.innerHTML = '';
        const clone = img.cloneNode(true);
        clone.removeAttribute('style');
        lightboxContent.appendChild(clone);

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    const lightboxClose = $('.lightbox-close');
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ============================================================
  //  8. LETTER MODAL (Surprise)
  // ============================================================
  function initLetter() {
    surpriseStar.addEventListener('click', () => {
      letterModal.classList.add('active');
      letterModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const letterClose = $('.letter-close');
    const letterBackdrop = $('.letter-backdrop');

    letterClose.addEventListener('click', closeLetter);
    letterBackdrop.addEventListener('click', closeLetter);
  }

  function closeLetter() {
    letterModal.classList.remove('active');
    letterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ============================================================
  //  9. DARK MODE TOGGLE
  // ============================================================
  function initTheme() {
    // Check saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ============================================================
  //  10. MUSIC TOGGLE — Rich ambient pad with reverb & progression
  // ============================================================

  // Chord progression (Hz): Am → Fmaj7 → Cmaj7 → G
  const CHORDS = [
    [220.00, 261.63, 329.63, 440.00],   // Am
    [174.61, 220.00, 261.63, 349.23],   // Fmaj7
    [261.63, 329.63, 392.00, 493.88],   // Cmaj7
    [196.00, 246.94, 293.66, 392.00],   // G
  ];
  const CHORD_DURATION = 8; // seconds per chord

  function createReverb(ctx) {
    const len = ctx.sampleRate * 3;
    const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  function createPadVoice(ctx, freq, dest) {
    const voices = [];
    // Two detuned triangle oscillators per note for width
    [-6, 6].forEach((detune) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = detune;

      const g = ctx.createGain();
      g.gain.value = 0;

      osc.connect(g);
      g.connect(dest);
      osc.start();
      voices.push({ osc, gain: g });
    });
    return voices;
  }

  function createAmbientMusic() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Master output
    const master = audioCtx.createGain();
    master.gain.value = 0;

    // Warm low-pass
    const lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 1200;
    lpf.Q.value = 0.7;

    // Reverb
    const reverb = createReverb(audioCtx);
    const reverbGain = audioCtx.createGain();
    reverbGain.gain.value = 0.45;

    // Dry/wet mix
    lpf.connect(master);          // dry
    lpf.connect(reverb);          // wet
    reverb.connect(reverbGain);
    reverbGain.connect(master);

    master.connect(audioCtx.destination);

    // Build pad voices for all chords
    const allVoices = [];
    CHORDS.forEach((chord) => {
      const chordVoices = [];
      chord.forEach((freq) => {
        // Main octave
        chordVoices.push(...createPadVoice(audioCtx, freq, lpf));
        // Sub octave (quieter)
        const subVoices = createPadVoice(audioCtx, freq / 2, lpf);
        subVoices.forEach((v) => { v.gain.gain.value = 0; });
        chordVoices.push(...subVoices);
      });
      allVoices.push(chordVoices);
    });

    // Slow filter LFO for movement
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(lpf.frequency);
    lfo.start();

    // Chord progression scheduler
    let currentChord = 0;

    function scheduleChord() {
      const now = audioCtx.currentTime;
      const chordVoices = allVoices[currentChord];
      const nextChord = (currentChord + 1) % CHORDS.length;
      const nextVoices = allVoices[nextChord];

      // Determine per-note gain: sub notes quieter
      const chordLen = CHORDS[currentChord].length;
      const totalVoicesPerChord = chordVoices.length / 1; // flat list

      chordVoices.forEach((v, i) => {
        // Every 4 voices = one note (2 detune × main/sub)
        const isSub = (i % 4) >= 2;
        const vol = isSub ? 0.025 : 0.06;
        v.gain.gain.cancelScheduledValues(now);
        v.gain.gain.setValueAtTime(v.gain.gain.value, now);
        v.gain.gain.linearRampToValueAtTime(vol, now + 2);
        // Fade out before next chord
        v.gain.gain.linearRampToValueAtTime(0, now + CHORD_DURATION - 1);
      });

      // Pre-fade in next chord
      nextVoices.forEach((v, i) => {
        const isSub = (i % 4) >= 2;
        const vol = isSub ? 0.025 : 0.06;
        v.gain.gain.cancelScheduledValues(now);
        v.gain.gain.setValueAtTime(0, now + CHORD_DURATION - 2);
        v.gain.gain.linearRampToValueAtTime(vol, now + CHORD_DURATION);
      });

      currentChord = nextChord;
    }

    // Start first chord immediately
    scheduleChord();
    // Schedule progression
    const progressionTimer = setInterval(scheduleChord, CHORD_DURATION * 1000);

    // Store timer for cleanup
    master._timer = progressionTimer;
    master._allVoices = allVoices;
    master._ctx = audioCtx;

    return master;
  }

  let masterGain = null;

  function initMusic() {
    musicBtn.addEventListener('click', () => {
      if (!audioCtx) {
        masterGain = createAmbientMusic();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (isPlaying) {
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
        isPlaying = false;
        musicBtn.classList.remove('playing');
      } else {
        masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 3);
        isPlaying = true;
        musicBtn.classList.add('playing');
      }
    });
  }

  // ============================================================
  //  11. NAV SCROLL BEHAVIOR
  // ============================================================
  function initNav() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (scrollY > 80) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }

      lastScroll = scrollY;
    }, { passive: true });
  }

  // ============================================================
  //  12. KEYBOARD SHORTCUTS
  // ============================================================
  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        closeLetter();
      }
    });
  }

  // ============================================================
  //  13. LOADING SCREEN
  // ============================================================
  function hideLoader() {
    setTimeout(() => {
      loader.classList.add('hidden');
      revealHero();
    }, 1200);
  }

  // ============================================================
  //  INITIALIZATION
  // ============================================================
  function init() {
    resizeCanvas();
    initParticles();
    drawParticles();
    updateGlow();
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);

    initReveal();
    initTypewriter();
    initLightbox();
    initLetter();
    initTheme();
    initMusic();
    initNav();
    initKeyboard();

    hideLoader();

    // Handle resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      isMobile = window.matchMedia('(pointer: coarse)').matches;
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
