import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Stage, type SceneKey } from './three/Stage';
import { useGame } from './game/store';
import { Loading, TitleScreen, GradeSelect, IslandHud, Summary } from './ui/Screens';
import { SectionShell, BackToIsland } from './ui/SectionShell';
import { TopRightControls, ProgressBadge, Toasts, SettingsModal } from './ui/Hud';
import { cx } from './ui/kit';
import type { SectionId } from './game/sections';

export function App() {
  const route = useGame((s) => s.route);
  const grade = useGame((s) => s.grade);
  const go = useGame((s) => s.go);
  const [ready, setReady] = useState(false);
  const [load, setLoad] = useState(0.1);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [settings, setSettings] = useState(false);

  // Wait for bundled fonts so 3D canvas labels draw with the brand typefaces.
  useEffect(() => {
    let alive = true;
    const t0 = performance.now();
    const tick = setInterval(() => setLoad((l) => Math.min(0.9, l + 0.06)), 120);
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load('800 40px "Baloo 2"'),
          document.fonts.load('900 40px "Baloo 2"'),
          document.fonts.load('700 20px Nunito'),
          document.fonts.load('800 20px Nunito'),
        ]).catch(() => undefined)
      : Promise.resolve();
    void fonts.then(() => {
      const wait = Math.max(0, 1100 - (performance.now() - t0));
      setTimeout(() => {
        if (!alive) return;
        clearInterval(tick);
        setLoad(1);
        setTimeout(() => alive && setReady(true), 250);
      }, wait);
    });
    return () => { alive = false; clearInterval(tick); };
  }, []);

  // Deep links for teachers: ?g=g45|g67|g89&s=s1..s13
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const g = q.get('g');
      const sec = q.get('s');
      if (g === 'g45' || g === 'g67' || g === 'g89') useGame.getState().setGrade(g);
      if (sec && /^s(1[0-3]|[1-9])$/.test(sec) && useGame.getState().grade) go({ name: 'section', id: sec as SectionId });
      else if (q.get('island') !== null && useGame.getState().grade) go({ name: 'island' });
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard: sections need a grade.
  useEffect(() => {
    if ((route.name === 'section' || route.name === 'island' || route.name === 'summary') && !grade) {
      go({ name: 'title' });
      setGradeOpen(true);
    }
  }, [route, grade, go]);

  const sceneKey: SceneKey = route.name === 'section' ? route.id : 'island';
  const variant = route.name === 'title' || route.name === 'summary' ? 'title' : route.name === 'section' ? route.id : undefined;
  const inSection = route.name === 'section';

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      {/* persistent 3D viewport — resizes with the layout */}
      <div
        className={cx(
          'absolute z-0 transition-[inset] duration-500',
          inSection ? 'inset-x-0 top-0 h-[40dvh] md:inset-y-0 md:left-0 md:right-[min(46vw,560px)] md:h-auto' : 'inset-0',
        )}
      >
        {ready && <Stage sceneKey={sceneKey} variant={variant} />}
      </div>

      {inSection && (
        <section
          className="absolute inset-x-0 bottom-0 top-[40dvh] z-20 overflow-hidden rounded-t-[28px] bg-cream shadow-[0_-10px_40px_-12px_rgba(15,36,89,0.35)] md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[min(46vw,560px)] md:rounded-none md:rounded-l-[32px]"
          aria-label="Activity panel"
        >
          <SectionShell id={route.id} />
        </section>
      )}

      {ready && route.name === 'title' && <TitleScreen onStart={() => (grade ? go({ name: 'island' }) : setGradeOpen(true))} />}
      {ready && route.name === 'island' && <IslandHud />}
      {ready && route.name === 'summary' && <Summary />}
      {ready && inSection && <BackToIsland />}

      {ready && (
        <>
          <TopRightControls onSettings={() => setSettings(true)} />
          {grade && route.name !== 'title' && <ProgressBadge onClick={() => go({ name: 'summary' })} />}
          <Toasts />
        </>
      )}

      <AnimatePresence>
        {gradeOpen && <GradeSelect onDone={() => { setGradeOpen(false); go({ name: 'island' }); }} onClose={() => setGradeOpen(false)} />}
      </AnimatePresence>
      <SettingsModal open={settings} onClose={() => setSettings(false)} />
      <AnimatePresence>{!ready && <Loading progress={load} />}</AnimatePresence>
    </div>
  );
}

export default App;
