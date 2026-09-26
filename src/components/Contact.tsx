import { Box, IconButton, Stack, Typography } from '@mui/material';
import { contact } from '../data';
import { asset } from '../lib';
import { icons } from './Icons';
import ScrollHint from './ScrollHint';
import Section from './Section';

export default function Contact() {
  return (
    <Section
      sx={{
        bgcolor: 'grey.900',
        color: 'common.white',
        textAlign: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -24,
          backgroundImage: `url(${asset(contact.background)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          opacity: 0.45,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          {contact.title}
        </Typography>
        <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {contact.links.map(({ icon, label, url }) => {
            const Icon = icons[icon];
            return (
              <IconButton key={url} href={url} target="_blank" rel="noreferrer" aria-label={label} color="inherit" size="large">
                <Icon fontSize="large" />
              </IconButton>
            );
          })}
        </Stack>
      </Box>
      <ScrollHint direction="up" />
      {contact.hiddenText && <span style={{ display: 'none' }}>{contact.hiddenText}</span>}
    </Section>
  );
}
