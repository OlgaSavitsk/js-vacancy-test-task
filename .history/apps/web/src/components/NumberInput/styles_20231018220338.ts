import { MantineTheme, rem } from '@mantine/core';

const styles = (
  theme: MantineTheme,
) => ({
  label: {
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: '1.25rem',
    marginBottom: rem(7),
  },

  input: {
    borderRadius: '0.5rem',
    '&:hover': {
      borderColor: theme.colors.blue[6],
    },
    '&[data-with-icon]': {
      paddingLeft: '3.55rem',
    },
    '&[data-elem]': {
      paddingLeft: '2.25rem',
    },
  },
  icon: {
    left: '10px',
    width: 'auto',
  },
});

export default styles;