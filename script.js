/* ════════════════════════════════════════════
   OUSSAMA.DEV — Portfolio Scripts
   ════════════════════════════════════════════ */

/* ── 1. TYPEWRITER HERO ── */
const phrases = [
  "Building scalable Cloud & IoT systems that actually work.",
  "Automating workflows so humans focus on what matters.",
  "From hardware to cloud — end-to-end engineer.",
  "Turning complex ideas into elegant digital solutions."
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const twEl = document.getElementById('hero-typewriter');

function typeWriter() {
  if (!twEl) return;
  const current = phrases[phraseIndex];
  if (!deleting) {
    twEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeWriter, 2200);
      return;
    }
  } else {
    twEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 40 : 60);
}
typeWriter();

/* ── 2. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ── 3. COUNTER ANIMATION ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + (target >= 10 ? '+' : '');
      if (count >= target) clearInterval(timer);
    }, 40);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number')
  .forEach(el => counterObserver.observe(el));

/* ── 4. 3D CARD MOUSE TILT ── */
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateZ(8px) scale(1.01)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    card.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0) scale(1)';
  });
});

/* ── 5. PHOTO FRAME — Interactive 3D mouse parallax ── */
const photoFrame = document.querySelector('.photo-masterframe');
if (photoFrame) {
  photoFrame.addEventListener('mousemove', e => {
    const rect = photoFrame.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotY =  dx * 18;
    const rotX = -dy * 14;
    photoFrame.style.transform =
      `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(20px) scale(1.03)`;
    photoFrame.style.transition = 'transform 0.08s linear';
    // subtle parallax on the image itself
    const img = photoFrame.querySelector('img');
    if (img) {
      img.style.transform = `translateX(${dx * -6}px) translateY(${dy * -6}px) scale(1.04)`;
      img.style.transition = 'transform 0.08s linear';
    }
  });

  photoFrame.addEventListener('mouseleave', () => {
    photoFrame.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    photoFrame.style.animation = 'none';
    setTimeout(() => { photoFrame.style.animation = ''; }, 10);
    const img = photoFrame.querySelector('img');
    if (img) {
      img.style.transform = '';
      img.style.transition = 'transform 0.5s ease';
    }
  });
}

/* ── 6. PARTICLES CANVAS ── */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (let i = 0; i < 40; i++) {
    particles.push({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      size:   Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      color:  Math.random() > 0.5 ? '#c6a43f' : '#745b00'
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ── 7. NAV ACTIVE LINK ON SCROLL ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('text-amber-600', 'border-b-2', 'border-amber-500');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('text-amber-600', 'border-b-2', 'border-amber-500');
    }
  });
});
