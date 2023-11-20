import { FC, ReactElement } from 'react';

import { SimpleGrid, Image, MediaQuery } from '@mantine/core';

import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();

  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}
    >

      <div className={classes.wrapper}>
        <main className={classes.content}>
          {children}
        </main>
      </div>

      <MediaQuery
        smallerThan="sm"
        styles={{ display: 'none' }}
      >
        <Stack sx={{
          width: '480px',

          height: '100vh',
          display: 'flex',
          margin: 'auto',
          alignItems: 'center',
        }}
        >
          <Title order={2}>Sell and buy products super quickly!</Title>
          <Text
            component="p"
            sx={(theme) => ({
              color: theme.colors.gray[5],
              margin: '20px 0 24px',
              textAlign: 'center',
            })}
          >
            Save your time, we take care of all the processing.
          </Text>
        </Stack>
      </MediaQuery>

    </SimpleGrid>
  );
};

export default UnauthorizedLayout;
