import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles(() => ({
  root: {
    background: 'transparent',
    gap: 32,
    padding: 0,
  },
  indicator: {
    background: 'transparent',
    boxShadow: 'none',
  },
  label: {
    fontSize: rem(20),
    fontWeight: 600,
    color: 'gray',
    padding: 0,
  },
}));
