/* =====================================================
   THE KINGDOM OF MINH HẰNG — Interactions
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Storybook Intro ---------- */
  const bookIntro = document.getElementById('book-intro');
  const book = document.getElementById('storybook');
  const skipBtn = document.getElementById('skip-intro');
  const bgm = document.getElementById('bgm');
  const musicBox = document.getElementById('music-box');
  const musicStatus = document.getElementById('music-status');

  function startMusic(){
    bgm.volume = 0.55;
    bgm.play().catch(() => {
      // Autoplay blocked — the music box still lets the user press play manually
      musicStatus.textContent = 'Tap to play';
      musicBox.classList.add('paused');
    });
  }

  function openBook(){
    if (book.classList.contains('open')) return;
    book.classList.add('open');
    startMusic();
    setTimeout(() => {
      bookIntro.classList.add('hidden');
    }, 3000);
  }

  book.addEventListener('click', openBook);
  skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openBook();
  });

  // Auto open after a gentle pause if the visitor doesn't interact
  setTimeout(() => {
    if (!bookIntro.classList.contains('hidden')) {
      // just a soft hint pulse, don't force-open (keeps autoplay policies happy)
      book.style.animation = 'pulseGlow 2s ease-in-out infinite';
    }
  }, 4000);

  /* ---------- Music toggle ---------- */
  const musicToggleBtn = document.getElementById('music-toggle');
  musicToggleBtn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play();
      musicStatus.textContent = 'Now Playing';
      musicBox.classList.remove('paused');
    } else {
      bgm.pause();
      musicStatus.textContent = 'Paused';
      musicBox.classList.add('paused');
    }
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });
  document.querySelectorAll('#nav-mobile a').forEach(link => {
    link.addEventListener('click', () => navMobile.classList.remove('open'));
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('[data-nav]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Fairy dust cursor ---------- */
  const canvas = document.getElementById('fairy-dust');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resizeCanvas(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const dustColors = ['#e8c874', '#d9b6ef', '#f3dfa6', '#e79fc4'];

  function spawnParticle(x, y){
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -Math.random() * 0.8 - 0.2,
      size: Math.random() * 2.5 + 1,
      life: 1,
      color: dustColors[Math.floor(Math.random() * dustColors.length)]
    });
  }

  let lastSpawn = 0;
  window.addEventListener('pointermove', (e) => {
    const now = Date.now();
    if (now - lastSpawn > 30) {
      spawnParticle(e.clientX, e.clientY);
      lastSpawn = now;
    }
  });

  function animateDust(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.018;
      if (p.life > 0) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    particles = particles.filter(p => p.life > 0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateDust);
  }
  animateDust();

});
