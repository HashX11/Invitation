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
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Always reveal the fountain, including after Safari restores a previous scroll.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function showFountainTop() {
  window.scrollTo({top:0, left:0, behavior:'instant'});
  document.getElementById('garden').style.setProperty('--scroll', '0');
}
window.addEventListener('pageshow', () => {
  if (document.body.classList.contains('locked')) showFountainTop();
});
async function openInvitation(event) {
  if (intro.classList.contains('opening')) return;
  event.currentTarget.blur();
  showFountainTop();
  audio.play().catch(() => setMusicState(false));
  intro.classList.add('opening');
  chapters.removeAttribute('inert');
  chapters.setAttribute('aria-hidden', 'false');
  // One synchronized timeline: release the wax, part the paper, enter the garden.
  const animations = [];
  function motion(selector, frames, duration, delay = 0, easing = 'cubic-bezier(.22,.61,.36,1)') {
    const element = document.querySelector(selector);
    const animation = element.animate(frames, {
      duration: reduced ? 1 : duration, delay: reduced ? 0 : delay,
      easing, fill: 'both'
    });
    animations.push(animation);
    return animation;
  }
  motion('.wax', [
    {transform:'rotate(-7deg) scale(1)', opacity:1},
    {transform:'rotate(2deg) scale(1.08)', opacity:1, offset:.4},
    {transform:'rotate(-12deg) scale(.88)', opacity:0}
  ], 560);
  motion('#openPrompt', [{opacity:1}, {opacity:0}], 300);
  motion('.address', [{opacity:1, transform:'translateY(0)'}, {opacity:0, transform:'translateY(-14px)'}], 700, 120);
  motion('.paper-hinge', [
    {transform:'translateY(0) rotateX(0deg)', opacity:1},
    {transform:'translateY(-18%) rotateX(48deg)', opacity:1, offset:.62},
    {transform:'translateY(-42%) rotateX(72deg)', opacity:0}
  ], 2200, 280);
  motion('.paper-body', [
    {transform:'translateY(0)', opacity:1},
    {transform:'translateY(24%)', opacity:1, offset:.55},
    {transform:'translateY(70%)', opacity:0}
  ], 2300, 350);
  motion('.camera', [{transform:'scale(1.12)'}, {transform:'scale(1.015)'}], 3300, 200);
  motion('.rose-title', [{opacity:0, transform:'translateY(18px)'}, {opacity:1, transform:'translateY(0)'}], 1200, 1500);
  motion('.continue', [{opacity:0, transform:'translateY(10px)'}, {opacity:1, transform:'translateY(0)'}], 900, 2100);
  await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  chapters.classList.add('entered', 'settled');
  intro.remove();
  animations.forEach(animation => animation.cancel());
  document.body.classList.remove('locked');
  showFountainTop();
}
document.querySelectorAll('#openLetter, #openPrompt').forEach(button => {
  button.addEventListener('click', openInvitation, {once:true});
});

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
