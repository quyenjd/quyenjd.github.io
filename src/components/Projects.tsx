import { useRef, useState, type TouchEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Stack,
  Typography,
  type SlideProps,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { projects } from '../data';
import type { Project } from '../data/types';
import { asset, Img, period, useSectionKeys, VH, youtubeId } from '../lib';
import Markdown from './Markdown';
import Section from './Section';

const SlideUp = (props: SlideProps) => <Slide direction="up" {...props} />;
const CLOSE_DRAG = 100; // px of downward swipe that dismisses the sheet
const LIFT = { transform: 'translateY(-4px)', boxShadow: 4 }; // look of the focused card

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [drag, setDrag] = useState<number | null>(null); // current swipe offset of the sheet
  const touch = useRef<{ y: number; ok: boolean } | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const open = (p: Project) => {
    setDrag(null);
    setSelected(p);
  };
  const close = () => setSelected(null);

  // One card is "focused" (lifted): set by mouse hover or Tab / Shift+Tab; Enter opens it.
  const list = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<number | null>(null);
  useSectionKeys(list, (e) => {
    if (selected) return;
    if (e.key === 'Tab') {
      const n = projects.length;
      const next = focused === null ? (e.shiftKey ? n - 1 : 0) : (focused + (e.shiftKey ? -1 : 1) + n) % n;
      setFocused(next);
      list.current?.children[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    if (e.key === 'Enter' && focused !== null) open(projects[focused]);
  });

  const onTouchStart = (e: TouchEvent) => {
    touch.current = { y: e.touches[0].clientY, ok: (content.current?.scrollTop ?? 0) <= 0 }; // only when content is scrolled to top
  };
  const onTouchMove = (e: TouchEvent) => {
    if (touch.current?.ok) setDrag(Math.max(0, e.touches[0].clientY - touch.current.y));
  };
  const onTouchEnd = () => {
    if ((drag ?? 0) > CLOSE_DRAG) close();
    else if (drag) setDrag(0);
    touch.current = null;
  };

  return (
    <Section title="Projects" sx={{ bgcolor: 'grey.50' }}>
      <Stack ref={list} spacing={2}>
        {projects.map((p, i) => (
          <Card
            key={p.title}
            variant="outlined"
            onPointerEnter={(e) => e.pointerType === 'mouse' && setFocused(i)} // not touch: a tap would leave it lifted
            sx={{ transition: 'transform .2s, box-shadow .2s', ...(focused === i && LIFT) }}
          >
            <CardActionArea onClick={() => open(p)} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2 }}>
              {p.logo && <Img src={asset(p.logo)} alt="" sx={{ width: { xs: 72, sm: 112 }, height: { xs: 72, sm: 112 }, flexShrink: 0 }} />}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h6" noWrap sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                  {p.title}
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                  {period(p.start, p.end)}
                </Typography>
                <Box sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  <Markdown variant="body2">{p.description}</Markdown>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Stack>

      {/* Bottom sheet at 80% height; swipe down to dismiss */}
      <Dialog
        open={!!selected}
        onClose={close}
        disableRestoreFocus // focus navigation is disabled, so don't hand focus back to the card
        slots={{ transition: SlideUp }}
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0, 0, 0, .25)' } },
          paper: {
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            style: drag === null ? undefined : { transform: `translateY(${drag}px)`, transition: drag ? 'none' : 'transform .2s' },
            sx: { m: 0, width: '100%', maxWidth: '100%', height: `calc(${VH} * 0.85)`, borderRadius: '16px 16px 0 0' },
          },
        }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
      >
        {selected && (
          <>
            <Box sx={{ position: 'relative', flexShrink: 0, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider' }} />
              <IconButton aria-label="Close" onClick={close} sx={{ position: 'absolute', top: 4, right: 8, zIndex: 1 }}>
                <Close />
              </IconButton>
            </Box>
            <DialogContent ref={content} sx={{ pt: 0, overscrollBehavior: 'contain' }}>
              <Container maxWidth="sm" disableGutters sx={{ pb: 4 }}>
                {selected.image &&
                  (youtubeId(selected.image) ? (
                    <Box sx={{ position: 'relative', pt: '56.25%', mb: 3, borderRadius: 1, overflow: 'hidden' }}>
                      <Box
                        component="iframe"
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId(selected.image)}`}
                        title={selected.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                      />
                    </Box>
                  ) : (
                    <Img src={asset(selected.image)} alt="" sx={{ width: '100%', height: 'auto', mb: 3 }} />
                  ))}
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                  {selected.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>{period(selected.start, selected.end)}</Typography>
                <Markdown>{selected.description}</Markdown>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 4 }}>
                  {selected.links.map(({ label, url }) => (
                    <Button
                      key={url}
                      variant="outlined"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      endIcon={<OpenInNew />}
                      sx={{ textTransform: 'none' }}
                    >
                      {label}
                    </Button>
                  ))}
                </Stack>
              </Container>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Section>
  );
}
