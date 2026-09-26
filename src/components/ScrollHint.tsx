import { IconButton } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';

const bounce = (px: number) => keyframes({ '0%, 100%': { transform: 'none' }, '50%': { transform: `translateY(${px}px)` } });

/** Bouncing chevron at the bottom of a section: `down` scrolls to the next section, `up` back to the top. */
export default function ScrollHint({ direction }: { direction: 'down' | 'up' }) {
  const down = direction === 'down';
  return (
    <IconButton
      aria-label={down ? 'Scroll down' : 'Back to top'}
      color="inherit"
      onClick={(e) => {
        const section = e.currentTarget.closest('section')!;
        if (down) section.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
        else section.parentElement!.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      sx={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        ml: '-20px',
        opacity: 0.7,
        animation: `${bounce(down ? 8 : -8)} 1.6s ease-in-out infinite`,
      }}
    >
      {down ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
    </IconButton>
  );
}
