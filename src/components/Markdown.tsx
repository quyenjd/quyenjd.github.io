import { Box } from '@mui/material';
import type { TypographyVariant } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Markdown({ children, variant = 'body1' }: { children: string; variant?: TypographyVariant }) {
  return (
    <Box
      sx={{
        typography: variant,
        '& > *': { m: 0 },
        '& > * + *': { mt: 1.5 },
        '& ul, & ol': { pl: 2.5 },
        '& a': { color: 'inherit' },
      }}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{children}</ReactMarkdown>
    </Box>
  );
}
