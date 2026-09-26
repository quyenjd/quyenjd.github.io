import { Box, Container, Typography, type BoxProps, type ContainerProps } from '@mui/material';
import { VH } from '../lib';

type Props = BoxProps & { title?: string; maxWidth?: ContainerProps['maxWidth'] };

/** One full-height, scroll-snapped screen. With a `title`, content is pinned to the top; otherwise it is centered. */
export default function Section({ title, children, maxWidth = 'md', sx = [], ...props }: Props) {
  return (
    <Box
      component="section"
      {...props}
      sx={[
        {
          position: 'relative',
          minHeight: VH,
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: title ? 'flex-start' : 'center',
          py: { xs: 6, md: 10 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Container maxWidth={maxWidth} sx={title ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } : undefined}>
        {title && (
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
            {title}
          </Typography>
        )}
        {children}
      </Container>
    </Box>
  );
}
