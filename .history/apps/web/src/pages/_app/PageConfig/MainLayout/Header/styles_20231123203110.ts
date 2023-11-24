import { createStyles, MantineTheme, rem } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  menu: {
    flexGrow: 1,
    gap: '1.7rem',
    letterSpacing: rem(0.5),
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },

  link: {
    display: 'block',
    lineHeight: 1.5,
    padding: '0.5rem 1.38rem',
    borderRadius: '20px',
    textDecoration: 'none',
    color: '#A3A3A3',
    fontSize: 'var(--mantine-font-size-sm)',
    fontWeight: 500,

    '&:hover': {
      color: theme.colors.blue[6],
    },
    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
    '&[data-active]': {
      backgroundColor: theme.colors.gray[2],
      color: 'var(--mantine-color-dark)',
    },
  },
  cart: {
    '&[data-active]': {
      backgroundColor: theme.colors.gray[2],
      color: 'var(--mantine-color-dark)',
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
