import { FC, useCallback } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { Stack, Title, Text, Button } from '@mantine/core';

import { RoutePath } from 'routes';
import { PartyIcon } from 'public/icons';

const CartEmpty: FC = () => {
  const handleClick = useCallback(() => {
    router.push(RoutePath.Home);
  }, []);

  return (
    <>
      <Head>
        <title>Payment Successfull</title>
      </Head>
      <Stack sx={{
        width: '480px',
        height: '100vh',
        display: 'flex',
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <PartyIcon />
        <Title order={2}>Oops, there's nothing here yet!</Title>
        <Text
          component="p"
          sx={(theme) => ({
            color: theme.colors.gray[5],
            margin: '20px 0 24px',
          })}
        >
          You haven't made any purchases yet.</br>
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
