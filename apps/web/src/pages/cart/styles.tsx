import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles(() => ({
  root: {
    background: 'transparent',
  },
  indicator: {
    background: 'transparent',
    boxShadow: 'none',
  },
  label: {
    fontSize: rem(20),
    fontWeight: 600,
    color: 'gray',
  },
}));
