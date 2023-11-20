import { createStyles, MantineTheme, rem } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  field: {
    
    width: '200px',
    '& input': {
      fontWeight: 500,
    },
    '& input[aria-controls]': {
      '& ~ div svg': {
        transform: 'rotate(180deg)',
      },
    },
  },
  button: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'end',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    borderRadius: '0.5rem',
    '&:before': {
      content: '"Reset All"',
      paddingRight: rem(7),
      letterSpacing: rem(0.5),
    },
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.colors.blue[3],
    },
    '&:active': {
      color: theme.colors.blue[5],
    },
  },
}));
