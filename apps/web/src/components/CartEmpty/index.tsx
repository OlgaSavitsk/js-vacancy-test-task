import { FC, useCallback } from 'react';
import Head from 'next/head';
import router from 'next/router';

import { Stack, Title, Text, Button } from '@mantine/core';

import { RoutePath } from 'routes';
import { EmptyIcon } from 'public/icons';

const CartEmpty: FC = () => {
  const handleClick = useCallback(() => {
    router.push(RoutePath.Home);
  }, []);

  return (
    <>
      <Head>
        <title>Empty Cart</title>
      </Head>
      <Stack sx={{
        width: '480px',
        height: '100vh',
        display: 'flex',
        margin: 'auto',
        alignItems: 'center',
      }}
      >
        <EmptyIcon />
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
    </>
  );
};

export default CartEmpty;
