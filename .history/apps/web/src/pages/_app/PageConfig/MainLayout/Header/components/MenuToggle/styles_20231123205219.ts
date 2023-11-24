import { createStyles, MantineTheme, rem } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  cart: {
    '&[data-active]': {
      backgroundColor: theme.colors.gray[2],
      color: 'var(--mantine-color-dark)',
    },
  },
}));
