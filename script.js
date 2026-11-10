const intro = document.getElementById('intro');
const chapters = document.getElementById('chapters');
const audio = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');
const seal = document.getElementById('seal');
const openPrompt = document.getElementById('openPrompt');
let opened = false;

function setMusicState(playing) {
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى');
}
audio.volume = .68;
audio.addEventListener('play', () => setMusicState(true));
audio.addEventListener('pause', () => setMusicState(false));
musicToggle.addEventListener('click', () => {
  if (audio.paused) audio.play().catch(() => setMusicState(false));
  else audio.pause();
});
function openInvitation() {
  if (opened) return;
  opened = true;
  seal.disabled = openPrompt.disabled = true;
  intro.classList.add('opening');
  audio.play().catch(() => setMusicState(false));
  window.setTimeout(() => {
    chapters.removeAttribute('inert');
    chapters.setAttribute('aria-hidden', 'false');
    chapters.classList.add('entered');
  }, 1320);
  window.setTimeout(() => {
    document.body.classList.remove('locked');
    intro.remove();
  }, 2120);
}
seal.addEventListener('click', openInvitation);
openPrompt.addEventListener('click', openInvitation);

const svgNS = 'http://www.w3.org/2000/svg';
for (const [id, count, upper] of [['upperJets', 9, true], ['lowerJets', 13, false]]) {
  const group = document.getElementById(id);
  for (let i = 0; i < count; i++) {
    const d = upper
      ? `M${718+i*13.5} 666 C${714+i*14} 691 ${704+i*16} 719 ${689+i*20} 739`
      : `M${675+i*16} 748 C${671+i*17} 783 ${654+i*20} 831 ${642+i*22} 854`;
    for (const cls of ['water-veil','water-glint']) {
      const path = document.createElementNS(svgNS,'path');
      path.setAttribute('d',d);
      path.setAttribute('class',cls);
      if (cls === 'water-glint') path.style.animationDelay = `${-i*.16}s`;
      group.appendChild(path);
    }
    if (i % 2 === 0) {
      const bead = document.createElementNS(svgNS,'circle');
      bead.setAttribute('r',upper ? '2' : '2.4');
      bead.setAttribute('class','water-bead');
      const motion = document.createElementNS(svgNS,'animateMotion');
      motion.setAttribute('path',d);
      motion.setAttribute('dur',`${upper ? 1.4+i*.05 : 1.1+i*.04}s`);
      motion.setAttribute('begin',`${-i*.2}s`);
      motion.setAttribute('repeatCount','indefinite');
      bead.appendChild(motion);
      group.appendChild(bead);
    }
  }
}

const birdSvg = `<svg viewBox="0 0 80 48" aria-hidden="true"><path class="wing-left" d="M39 25C27 7 13 5 2 13c12 2 22 13 29 21"/><path class="wing-right" d="M42 25C53 6 67 5 79 13 66 16 57 24 49 34"/><path d="M30 25c8-5 19-5 27 3-7 5-15 7-22 3l-9 4 4-10Z"/></svg>`;
const birds = document.querySelector('.birds');
for (let i = 0; i < 7; i++) {
  const bird = document.createElement('span');
  bird.className = 'bird';
  bird.innerHTML = birdSvg;
  bird.style.setProperty('--flight', `${20+i*1.3}s`);
  bird.style.setProperty('--delay', `${-i*3.1}s`);
  bird.style.top = `${9+(i*7)%12}%`;
  birds.appendChild(bird);
}

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }
}, {threshold:.12, rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    document.getElementById('garden').style.setProperty('--scroll', String(Math.min(window.scrollY, window.innerHeight)));
    ticking = false;
  });
}, {passive:true});

function updateCountdown() {
  const remaining = Math.max(0, Math.floor((Date.parse('2026-11-16T16:00:00Z') - Date.now()) / 1000));
  const values = [Math.floor(remaining/86400),Math.floor(remaining%86400/3600),Math.floor(remaining%3600/60),remaining%60];
  ['days','hours','minutes','seconds'].forEach((id,i) => document.getElementById(id).textContent = String(values[i]).padStart(2,'0'));
}
updateCountdown();
setInterval(updateCountdown, 1000);
