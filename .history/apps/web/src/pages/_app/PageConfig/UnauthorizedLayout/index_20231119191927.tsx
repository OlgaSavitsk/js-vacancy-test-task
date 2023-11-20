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
          <Title order={2}>Oops, there&apos;s nothing here yet!</Title>
          <Text
            component="p"
            sx={(theme) => ({
              color: theme.colors.gray[5],
              margin: '20px 0 24px',
              textAlign: 'center',
            })}
          >
            You haven&apos;t made any purchases yet.
            {' '}
            <br />
            Go to the marketplace and make purchases.
          </Text>
          <Button
            type="submit"
            size="md"
            onClick={handleClick}
          >
            Go to Marketplace
          </Button>
        </Stack>
        <Image
          alt="App Info"
          src="/images/ship.svg"
          height="100vh"
          p={32}
        />
      </MediaQuery>

    </SimpleGrid>
  );
};

export default UnauthorizedLayout;
