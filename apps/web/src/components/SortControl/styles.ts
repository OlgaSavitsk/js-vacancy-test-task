import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  field: {
    zIndex: 1,
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
}));
