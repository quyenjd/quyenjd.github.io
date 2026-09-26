import GitHub from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Email from '@mui/icons-material/Email';
import X from '@mui/icons-material/X';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import Language from '@mui/icons-material/Language';
import Description from '@mui/icons-material/Description';

/** Icons usable as `"icon"` in profile.json. Add more from @mui/icons-material here. */
export const icons = {
  github: GitHub,
  linkedin: LinkedIn,
  email: Email,
  x: X,
  facebook: Facebook,
  instagram: Instagram,
  website: Language,
  resume: Description,
};

export type IconName = keyof typeof icons;
