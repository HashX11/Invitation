"use client";

import { useEffect, useRef, useState } from "react";

function Flourish({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 180 30" fill="none" aria-hidden="true"><path d="M8 15c37 0 47-17 82 0 35-17 45 0 82 0M40 14c4-15 18-16 18-5s-13 10-18 5m100 0c-4-15-18-16-18-5s13 10 18 5" stroke="currentColor" strokeWidth="1"/><path d="m90 5 6 10-6 10-6-10 6-10Z" fill="currentColor"/></svg>;
}

function Birds() {
  return <div className="birds" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <svg key={i} className={`bird bird-${i}`} viewBox="0 0 80 48" fill="none"><path className="bird-left-wing" d="M39 25C27 7 13 5 2 13c12 2 22 13 29 21" fill="currentColor"/><path className="bird-right-wing" d="M42 25C53 6 67 5 79 13 66 16 57 24 49 34" fill="currentColor"/><path d="M30 25c8-5 19-5 27 3-7 5-15 7-22 3l-9 4 4-10Z" fill="currentColor"/><path d="M53 25c8-7 15-6 20-3l-14 6" fill="currentColor"/><circle cx="62" cy="23" r="1.2" fill="#fff"/></svg>)}</div>;
}

function Fountain() {
  return <svg className="fountain" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="stream" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" stopOpacity=".08"/><stop offset=".5" stopColor="#fffef1" stopOpacity=".95"/><stop offset="1" stopColor="#fff" stopOpacity=".08"/></linearGradient></defs>
    {Array.from({ length: 9 }, (_, i) => <g key={i}><path d={`M${718 + i * 13.4} 662 Q${710 + i * 14.8} 701 ${689 + i * 18} 743`} className="stream stream-upper" style={{ animationDelay: `${-.13 * i}s` }}/><circle cx={696 + i * 17} cy={687 + (i % 4) * 10} r={1.5 + i % 3 * .35} className="water-drop" style={{ animationDelay: `${-.16 * i}s` }}/></g>)}
    {Array.from({ length: 13 }, (_, i) => <g key={`lower-${i}`}><path d={`M${675 + i * 16} 746 Q${659 + i * 18} 804 ${642 + i * 22} 855`} className="stream stream-lower" style={{ animationDelay: `${-.13 * i}s` }}/><circle cx={651 + i * 19} cy={783 + (i % 5) * 8} r={1.4 + i % 2 * .5} className="water-drop lower-drop" style={{ animationDelay: `${-.11 * i}s` }}/></g>)}
    <path d="M772 640Q770 605 772 594M770 641Q760 604 742 625M775 641Q788 603 802 625" className="crown-jet"/><ellipse cx="773" cy="743" rx="88" ry="7" className="bowl-shimmer"/><ellipse cx="772" cy="853" rx="75" ry="8" className="ripple"/><ellipse cx="772" cy="853" rx="75" ry="8" className="ripple ripple-late"/></svg>;
}


export default function Home() {
  const [opened, setOpened] = useState(false);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [guest, setGuest] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const world = useRef<HTMLElement>(null);

  useEffect(() => { setGuest(new URLSearchParams(location.search).get("to")?.trim().slice(0, 120) || ""); }, []);
  useEffect(() => { document.body.classList.toggle("letter-closed", !entered); return () => document.body.classList.remove("letter-closed"); }, [entered]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [entered]);
  useEffect(() => {
    let pending = false;
    const scroll = () => { if (pending) return; pending = true; requestAnimationFrame(() => { world.current?.style.setProperty("--travel", String(Math.min(scrollY, innerHeight))); pending = false; }); };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  const play = () => { if (!audio.current) return; audio.current.volume = .7; void audio.current.play().catch(() => setPlaying(false)); };
  const open = () => { if (opened) return; setOpened(true); play(); setTimeout(() => setEntered(true), 1650); };
  return <main className={`experience ${opened ? "opening" : ""} ${entered ? "entered" : ""}`}>
    <audio ref={audio} src="/assets/original-music.mp3" preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button className="music" onClick={() => playing ? audio.current?.pause() : play()} aria-label={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"} aria-pressed={playing}><span className={playing ? "music-bars active" : "music-bars"}><i/><i/><i/><i/></span>{playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}</button>
    {!entered && <div className="intro">
      <div className="envelope-back" aria-hidden="true" />
      <div className="letter"><div className="letter-edge"/><p>بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ</p><Flourish className="letter-flourish"/><span className="letter-label">دعوة إلى عقد قران</span><h1>سامح <em>و</em> زينة</h1><time dir="ltr">16 · 11 · 2026</time></div>
      <div className="envelope-front" aria-hidden="true" />
      <button className="seal" onClick={open} disabled={opened} aria-label="افتح الدعوة"><span>س <i>✦</i> ز<small>افتح الدعوة</small></span></button>
      <button className="open-prompt" onClick={open} disabled={opened}>المس الختم لتبدأ الحكاية <span aria-hidden="true">↟</span></button>
    </div>}
    <div className="chapters" aria-hidden={!entered} inert={!entered}>
      <section className="world" ref={world}><div className="garden garden-back"/><div className="garden garden-left"/><div className="garden garden-right"/><div className="garden garden-front"/><div className="world-wash"/><Fountain/><Birds/><div className="fireflies" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i}/>)}</div><div className="world-title"><p>في حديقةٍ من الفرح</p><h2>سامح <em>و</em> زينة</h2><Flourish/><span>يجمعهما وعدٌ، وتزهر حولهما الحكاية</span></div><a href="#scripture" className="scroll-cue">اكتشف الدعوة <i/></a></section>
      <section className="scripture" id="scripture" dir="rtl"><div className="scripture-paper"><p className="scripture-label reveal">آية المودّة</p><Flourish className="reveal"/><p className="scripture-text reveal">﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ ﴾</p><p className="surah reveal">سورة الروم · الآية ٢١</p></div></section>
      <section className="story" id="invitation" dir="rtl"><p className="index reveal" dir="ltr">01 / THE INVITATION</p><p className="verse reveal">بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ</p><Flourish className="reveal"/>{guest && <p className="guest reveal">دعوة خاصة إلى <strong>{guest}</strong></p>}<p className="small reveal">بكل محبة وسرور، تتشرف</p><div className="parents reveal"><p><small>والدة العريس</small>السيدة ندى مرقباوي</p><i>✦</i><p><small>والدة العروس</small>السيدة ابتسام الأحمد</p></div><p className="small reveal">بدعوتكم لمشاركتنا فرحة عقد قران</p><h2 className="names reveal"><span>سامح <small>القاضي</small></span><em>و</em><span>زينة <small>بكري</small></span></h2><p className="father reveal">زينة، كريمة المرحوم سمير بكري، رحمه الله</p><p className="closing reveal">بحضوركم تكتمل فرحتنا</p></section>
      <section className="details" dir="rtl"><p className="index reveal" dir="ltr">02 / THE CELEBRATION</p><p className="details-intro reveal">ننتظركم يوم الإثنين</p><h2 className="date reveal"><span>16</span><em>نوفمبر</em><span>2026</span></h2><p className="time reveal">الساعة السادسة مساءً</p><Flourish className="reveal"/><p className="venue reveal">أكواريوس توريستيك ريزورت</p><p className="location reveal">المنية، لبنان</p><div className="actions reveal"><a href="/wedding.ics" download="sameh-zeina.ics">حمّل الموعد للتقويم <span aria-hidden="true">↙</span></a><a href="https://maps.app.goo.gl/Dc7q4NEhz87pzo817" target="_blank" rel="noopener noreferrer">اتجاهات المكان <span aria-hidden="true">↗</span></a></div></section>
      <section className="prayer" dir="rtl"><p className="prayer-intro reveal">ولا تنسونا من صالح دعائكم</p><Flourish className="reveal"/><p className="prayer-text reveal">﴿ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا ﴾</p><p className="surah reveal">سورة الفرقان · الآية ٧٤</p></section>
      <footer className="footer" dir="rtl"><p>الحمد لله الذي بنعمته تتم الصالحات</p><Flourish/><strong>سامح <em>و</em> زينة</strong><small>16 . 11 . 2026</small></footer>
    </div>
  </main>;
}
