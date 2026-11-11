document.addEventListener('DOMContentLoaded', () => {
  const intro = document.querySelector('#intro');
  const celebration = document.querySelector('#celebration');
  const openGift = document.querySelector('#openGift');
  const blowButton = document.querySelector('#blowButton');
  const candles = document.querySelector('#candles');
  const hint = document.querySelector('#candleHint');
  const secretButton = document.querySelector('#secretButton');
  const secret = document.querySelector('#secret');
  const musicToggle = document.querySelector('#musicToggle');
  const musicLabel = document.querySelector('.music-label');
  const bgMusic = document.querySelector('#bgMusic');
  const musicFileInput = document.querySelector('#musicFileInput');
  const closeSecretButton = document.querySelector('.close-secret');

  if (!intro || !celebration || !openGift) return;

  const defaultMusicSources = ['music.m4a', 'music.mp3'];
  let defaultMusicIndex = 0;
  let hasCustomMusic = false;

  function loadDefaultMusic() {
    if (!bgMusic) return;
    if (defaultMusicIndex >= defaultMusicSources.length) {
      bgMusic.removeAttribute('src');
      bgMusic.load();
      return;
    }

    bgMusic.src = defaultMusicSources[defaultMusicIndex];
    bgMusic.load();
  }

  function setMusicState(isPlaying) {
    if (!musicToggle || !musicLabel) return;
    musicToggle.classList.toggle('playing', isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicLabel.textContent = isPlaying ? 'Pause' : (hasCustomMusic ? 'Musik' : 'Pilih musik');
  }

  function startMusic() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      setMusicState(true);
    }).catch(() => {
      setMusicState(false);
    });
  }

  function chooseMusicFile() {
    if (musicFileInput) musicFileInput.click();
  }

  if (musicFileInput) {
    musicFileInput.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file || !bgMusic) return;

      const objectUrl = URL.createObjectURL(file);
      bgMusic.src = objectUrl;
      bgMusic.load();
      hasCustomMusic = true;
      startMusic();
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', async () => {
      if (!bgMusic) {
        chooseMusicFile();
        return;
      }

      if (!bgMusic.src && !hasCustomMusic) {
        chooseMusicFile();
        return;
      }

      if (bgMusic.paused) {
        startMusic();
      } else {
        bgMusic.pause();
        setMusicState(false);
      }
    });
  }

  if (bgMusic) {
    bgMusic.addEventListener('error', () => {
      if (defaultMusicIndex < defaultMusicSources.length - 1 && !hasCustomMusic) {
        defaultMusicIndex += 1;
        loadDefaultMusic();
        return;
      }

      hasCustomMusic = false;
      setMusicState(false);
      if (musicLabel) musicLabel.textContent = 'Pilih musik';
    });
    bgMusic.addEventListener('play', () => setMusicState(true));
    bgMusic.addEventListener('pause', () => setMusicState(false));
    loadDefaultMusic();
  }

  openGift.addEventListener('click', () => {
    intro.classList.add('opened');
    celebration.classList.add('visible');
    celebration.setAttribute('aria-hidden', 'false');
    confetti(50);
    startMusic();
    window.scrollTo({ top: 0 });
  });

  if (blowButton) {
    blowButton.addEventListener('click', () => {
      if (candles && candles.classList.contains('out')) return;
      if (candles) candles.classList.add('out');
      if (hint) hint.textContent = 'Wish made. Semoga terkabul ✦';
      blowButton.textContent = 'Keinginanmu diterbangkan';
      confetti(90);
    });
  }

  if (secretButton && secret) {
    secretButton.addEventListener('click', () => {
      secret.classList.add('open');
      secret.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeSecretButton && secret) {
    closeSecretButton.addEventListener('click', closeSecret);
  }

  if (secret) {
    secret.addEventListener('click', event => { if (event.target === secret) closeSecret(); });
  }

  document.addEventListener('keydown', event => { if (event.key === 'Escape' && secret) closeSecret(); });

  function closeSecret() {
    if (!secret) return;
    secret.classList.remove('open');
    secret.setAttribute('aria-hidden', 'true');
  }

  function confetti(amount) {
    const colors = ['#b66e71', '#edb6a7', '#cda56a', '#fff2b6', '#d9a6bd'];
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--duration', `${2.5 + Math.random() * 2.8}s`);
      piece.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
      piece.style.animationDelay = `${Math.random() * .45}s`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 6000);
    }
  }

  const canvas = document.querySelector('#stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let sparks = [];

  function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    sparks = Array.from({ length: Math.min(35, Math.floor(innerWidth / 35)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + .3,
      a: Math.random() * .4 + .15,
      speed: Math.random() * .12 + .04
    }));
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach(s => {
      s.a += (Math.random() - .5) * .012;
      s.a = Math.max(.08, Math.min(.55, s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(185,151,116,${s.a})`;
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -2) s.y = canvas.height + 2;
    });
    requestAnimationFrame(drawStars);
  }

  addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawStars();
});
