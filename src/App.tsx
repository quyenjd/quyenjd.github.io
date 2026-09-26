import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { VH } from './lib';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';

export default function App() {
  const scroller = useRef<HTMLDivElement>(null);

  // Keyboard: ↑/↓ move between snap stops (each section's start, plus its end
  // when it is taller than the viewport); Tab is disabled (focus order is not
  // meaningful here). The intended stop is tracked in `target` rather than
  // read live, so presses chain mid-animation and ↑ during a scroll down
  // returns to the stop being scrolled to. Scrolling itself is native CSS
  // `scroll-snap`.
  useEffect(() => {
    const el = scroller.current!;
    const stops = () =>
      ([...el.children] as HTMLElement[]).flatMap((s) => {
        const end = s.offsetTop + s.offsetHeight - el.clientHeight;
        return end > s.offsetTop + 1 ? [s.offsetTop, end] : [s.offsetTop];
      });
    let target = el.scrollTop;
    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        target = el.scrollTop;
      }, 150); // re-sync after wheel/touch scrolling
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') return e.preventDefault();
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      if ((e.target as HTMLElement).closest?.('[role="dialog"]')) return; // let open dialogs keep their keys
      e.preventDefault();
      const list = stops();
      const i = list.reduce((best, y, k) => (Math.abs(y - target) < Math.abs(list[best] - target) ? k : best), 0);
      const next = list[i + (e.key === 'ArrowDown' ? 1 : -1)];
      if (next === undefined) return;
      target = next;
      el.scrollTo({ top: next, behavior: 'smooth' });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(settle);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <Box
      ref={scroller}
      sx={{
        position: 'relative',
        height: VH,
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        '@media (hover: none) and (pointer: coarse)': { scrollSnapType: 'none' }, // touch devices: plain scrolling (iOS snap quirks)
      }}
    >
      <Hero />
      <Experience />
      <Projects />
      <Contact />
    </Box>
  );
}
