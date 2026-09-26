import { useEffect, useRef, type RefObject } from 'react';
import { styled } from '@mui/material/styles';

/** Resolve a path from the JSON files: absolute URLs pass through, others come from `public/`. */
export const asset = (path: string) => (/^https?:\/\//.test(path) ? path : `${process.env.PUBLIC_URL}/${path}`);

const month = (ym: string) => new Date(`${ym}-01T00:00:00`).toLocaleDateString('en', { month: 'short', year: 'numeric' });

/** "Jan 2024", "Jan 2024 – Mar 2025" or "Jan 2024 – Present" (see `end` in data/types.ts). */
export const period = (start: string, end?: string | null) =>
  end === undefined ? month(start) : `${month(start)} – ${end === null ? 'Present' : month(end)}`;

export const VH = 'var(--vh, 100vh)';

/** YouTube video id from a watch / youtu.be / shorts / embed URL, or null for anything else. */
export const youtubeId = (url: string) =>
  url.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1] ?? null;

/** Wrap hover styles in this so they only apply on devices that can hover (touch devices leave :hover stuck after a tap). */
export const HOVER = '@media (hover: hover)';

/** Every image on the page: corner-rounded, cropped to cover. */
export const Img = styled('img')(({ theme }) => ({
  display: 'block',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

/** Calls `onKey` for keydown events while the <section> containing `ref` is at least half on screen. */
export function useSectionKeys(ref: RefObject<HTMLElement | null>, onKey: (e: KeyboardEvent) => void) {
  const latest = useRef(onKey);
  useEffect(() => {
    latest.current = onKey;
  });
  useEffect(() => {
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.intersectionRatio >= 0.5;
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current!.closest('section')!);
    const handler = (e: KeyboardEvent) => visible && latest.current(e);
    window.addEventListener('keydown', handler);
    return () => {
      io.disconnect();
      window.removeEventListener('keydown', handler);
    };
  }, [ref]);
}
