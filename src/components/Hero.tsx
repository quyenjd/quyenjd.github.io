import { Stack, Typography } from '@mui/material';
import Place from '@mui/icons-material/Place';
import Work from '@mui/icons-material/Work';
import { profile } from '../data';
import { asset, Img } from '../lib';
import Markdown from './Markdown';
import ScrollHint from './ScrollHint';
import Section from './Section';

export default function Hero() {
  return (
    <Section sx={{ bgcolor: 'grey.900', color: 'common.white' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>
        <Img src={asset(profile.avatar)} alt={profile.name} sx={{ width: { xs: 180, md: 260 }, height: { xs: 180, md: 260 } }} />
        <Stack spacing={2} sx={{ alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            {profile.name}
          </Typography>
          <Stack spacing={0.5} sx={{ opacity: 0.75, mt: -1, alignSelf: 'stretch' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Place fontSize="small" />
              <Typography variant="body2">{profile.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Work fontSize="small" />
              <Typography variant="body2">{profile.role}</Typography>
            </Stack>
          </Stack>
          <Markdown>{profile.bio}</Markdown>
        </Stack>
      </Stack>
      <ScrollHint direction="down" />
    </Section>
  );
}
