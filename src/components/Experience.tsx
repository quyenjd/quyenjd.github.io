import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { Box, ButtonBase, Collapse, IconButton, Paper, Stack, Typography } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { keyframes } from '@mui/material/styles';
import { companies } from '../data';
import type { Company } from '../data/types';
import { asset, HOVER, Img, period, useSectionKeys } from '../lib';
import Markdown from './Markdown';
import Section from './Section';

const ABOVE = 48; // px reserved above the dot for the company name
const DOT = 14;
const ITEM_GAP = 16; // px between companies on the horizontal timeline
const GAP = 3; // theme spacing between roles
const SLIDE = '.45s cubic-bezier(.4, 0, .2, 1)';
const SWIPE = 30; // px of horizontal swipe that switches company
// Shared by both timelines: dots pop on hover and shrink on press.
const DOT_SX = {
  width: DOT,
  height: DOT,
  borderRadius: '50%',
  transition: 'transform .25s cubic-bezier(.34, 1.56, .64, 1), background-color .2s, border-color .2s',
};
const DOT_HOVER = { '&:hover .dot': { transform: 'scale(1.35)' } }; // put inside a [HOVER] block
const DOT_PRESS = { '&:active .dot': { transform: 'scale(.9)' } };

const slideIn = (dir: number) =>
  keyframes({ from: { opacity: 0, transform: `translateX(${dir * 100}%)` }, to: { opacity: 1, transform: 'none' } });
const slideOut = (dir: number) =>
  keyframes({ from: { opacity: 1, transform: 'none' }, to: { opacity: 0, transform: `translateX(${-dir * 100}%)` } });

const span = (c: Company) => period(c.roles[c.roles.length - 1].start, c.roles[0].end);

type PanelProps = { company: Company; open: number; onSelect: (i: number) => void };

// Height of the title/period box: title (body1: 16px × 1.5) + period (body2: 14px × 1.43) + 2 × 4px padding.
const HEADER = 16 * 1.5 + 14 * 1.43 + 2 * 4;
const DOT_TOP = (HEADER - DOT) / 2; // centers the dot on that box

/** Logo header + vertical role timeline for one company. */
function CompanyPanel({ company, open, onSelect }: PanelProps) {
  const single = company.roles.length === 1; // nothing to collapse: always expanded, not clickable
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 } }}>
      <Stack sx={{ alignItems: 'center', mb: 3 }}>
        <Img src={asset(company.logo)} alt={company.name} sx={{ width: 72, height: 72 }} />
      </Stack>
      {company.roles.map((role, i) => {
        const isOpen = single || open === i;
        const last = i === company.roles.length - 1;
        return (
          <Box key={role.start} sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ position: 'relative', width: DOT, flexShrink: 0 }}>
              <ButtonBase
                disableRipple
                aria-label={role.title}
                onClick={() => onSelect(i)}
                sx={{
                  ...DOT_SX,
                  ...DOT_PRESS,
                  [HOVER]: DOT_HOVER,
                  mt: `${DOT_TOP}px`,
                  bgcolor: isOpen ? 'primary.main' : 'divider',
                  zIndex: 1,
                  '&::after': { content: '""', position: 'absolute', inset: -8 },
                }}
                className="dot"
              />
              {!last && (
                <Box sx={{ position: 'absolute', top: DOT_TOP + DOT, bottom: -DOT_TOP, left: DOT / 2 - 1, width: 2, bgcolor: 'divider' }} />
              )}
            </Box>
            <Box sx={{ flex: 1, pb: last ? 0 : GAP }}>
              <ButtonBase
                disableRipple
                disabled={isOpen}
                onClick={() => onSelect(i)}
                sx={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  mx: -1,
                  transition: 'background-color .2s',
                  [HOVER]: { '&:hover': { bgcolor: 'action.hover' } },
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{role.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {period(role.start, role.end)}
                </Typography>
              </ButtonBase>
              <Collapse in={isOpen}>
                <Box sx={{ mt: 1.5 }}>
                  <Markdown variant="body2">{role.description}</Markdown>
                </Box>
              </Collapse>
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
}

export default function Experience() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null); // panel sliding out, if any
  const [dir, setDir] = useState(1); // 1 = moved right on the timeline, -1 = left
  const [open, setOpen] = useState<Record<number, number>>({}); // expanded role per company (always exactly one)
  const openAt = (i: number) => open[i] ?? 0;

  const rail = useRef<HTMLDivElement>(null);

  // Wrapper height follows the active panel so switching animates between different heights.
  const current = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    const el = current.current!;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  const select = (i: number) => {
    const el = rail.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (el && item) el.scrollTo({ left: item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
    if (i === active || i < 0 || i >= companies.length) return;
    setDir(i > active ? 1 : -1);
    setPrev(active);
    setActive(i);
  };

  // ←/→ switch company, Tab / Shift+Tab cycle its roles.
  const chevron = (step: -1 | 1) => (
    <IconButton
      aria-label={step < 0 ? 'Previous company' : 'Next company'}
      disabled={step < 0 ? active === 0 : active === companies.length - 1}
      onClick={() => select(active + step)}
      sx={{ display: { xs: 'none', md: 'inline-flex' } }}
    >
      {step < 0 ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  );

  // Touch: a horizontal swipe on the panel switches company.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const t = touch.current;
    touch.current = null;
    if (!t) return;
    const dx = e.changedTouches[0].clientX - t.x;
    const dy = e.changedTouches[0].clientY - t.y;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > 2 * Math.abs(dy)) select(active + (dx < 0 ? 1 : -1));
  };

  useSectionKeys(rail, (e) => {
    if (e.key === 'ArrowLeft') select(active - 1);
    if (e.key === 'ArrowRight') select(active + 1);
    if (e.key === 'Tab') {
      const n = companies[active].roles.length;
      setOpen({ ...open, [active]: (openAt(active) + (e.shiftKey ? -1 : 1) + n) % n });
    }
  });

  return (
    <Section title="Experience">
      {/* Horizontal company timeline */}
      <Box
        ref={rail}
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${companies.length}, minmax(max-content, 1fr))`, // never wrap names or periods
          columnGap: `${ITEM_GAP}px`,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {companies.map((c, i) => {
          const isActive = i === active;
          return (
            <ButtonBase
              key={c.name}
              component="div"
              disableRipple
              onClick={() => select(i)}
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start', // ButtonBase centers by default; a taller neighbour would shift the dot
                borderRadius: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: ABOVE + DOT / 2 - 1,
                  height: 2,
                  left: i === 0 ? '50%' : -ITEM_GAP / 2, // bridge the gap to the neighbour
                  right: i === companies.length - 1 ? '50%' : -ITEM_GAP / 2,
                  bgcolor: 'divider',
                },
                [HOVER]: { '&:hover .name': { color: 'text.primary' }, ...DOT_HOVER },
                ...DOT_PRESS,
              }}
            >
              <Box sx={{ height: ABOVE, display: 'flex', alignItems: 'center' }}>
                <Typography
                  className="name"
                  sx={{
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? 'text.primary' : 'text.secondary',
                    transition: 'color .2s',
                  }}
                >
                  {c.name}
                </Typography>
              </Box>
              <Box
                className="dot"
                sx={{
                  ...DOT_SX,
                  border: 2,
                  borderColor: isActive ? 'primary.main' : 'divider',
                  bgcolor: isActive ? 'primary.main' : 'background.paper',
                  zIndex: 1,
                }}
              />
              {/* always rendered so the column width never changes with the active item */}
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', pt: 0.5, whiteSpace: 'nowrap', visibility: isActive ? 'visible' : 'hidden' }}
              >
                {span(c)}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>

      {/* Panel flanked by prev/next chevrons on desktop; on touch devices swipe left/right instead */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
        {chevron(-1)}
        <Box
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          sx={{
            flex: 1,
            minWidth: 0,
            position: 'relative',
            overflow: 'hidden',
            touchAction: 'pan-y', // the browser owns vertical scrolling; horizontal swipes reach us cleanly
            height,
            transition: prev === null ? 'none' : `height ${SLIDE}`,
          }}
        >
          {prev !== null && (
            <Box
              key={`${prev}-${active}`}
              onAnimationEnd={() => setPrev(null)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: 'none',
                animation: `${slideOut(dir)} ${SLIDE} forwards`,
              }}
            >
              <CompanyPanel company={companies[prev]} open={openAt(prev)} onSelect={() => {}} />
            </Box>
          )}
          <Box key={active} ref={current} sx={{ animation: `${slideIn(dir)} ${SLIDE}` }}>
            <CompanyPanel company={companies[active]} open={openAt(active)} onSelect={(i) => setOpen({ ...open, [active]: i })} />
          </Box>
        </Box>
        {chevron(1)}
      </Box>
    </Section>
  );
}
