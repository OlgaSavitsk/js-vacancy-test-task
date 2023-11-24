import { createStyles, MantineTheme, rem } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  cart: {
    '&[data-active]': {
      backgroundColor: theme.colors.gray[2],
      color: 'var(--mantine-color-dark)',
    },
  },

  dropdown: {
    position: 'absolute',
    top: rem(60),
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));
