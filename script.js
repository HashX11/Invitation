const intro = document.getElementById('intro');
const chapters = document.getElementById('chapters');
const audio = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');
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
const letter = document.querySelector('#letterFilm');
const garden = document.querySelector('#gardenFilm');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('#openLetter').addEventListener('click', async () => {
  intro.classList.add('unfold');
  audio.play().catch(() => setMusicState(false));
  if (!reduced) {
    await new Promise(resolve => {
      letter.onended = resolve;
      letter.play().catch(resolve);
      setTimeout(resolve, 4700);
    });
  }
  chapters.removeAttribute('inert');
  chapters.setAttribute('aria-hidden','false');
  chapters.classList.add('entered');
  intro.classList.add('dissolve');
  const settle = () => {
    chapters.classList.add('settled');
    document.body.classList.remove('locked');
  };
  garden.onended = settle;
  if (reduced) settle();
  else garden.play().catch(settle);
  setTimeout(settle, 4400);
  setTimeout(() => intro.remove(),650);
}, {once:true});

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
