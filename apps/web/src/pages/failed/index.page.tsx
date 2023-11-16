import { useCallback } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { NextPage } from 'next';
import { Stack, Title, Text, Button } from '@mantine/core';

import { RoutePath } from 'routes';
import { CrossMarkIcon } from 'public/icons';

const FailedPage: NextPage = () => {
  const handleClick = useCallback(() => {
    router.push(RoutePath.Cart);
  }, []);

  return (
    <>
      <Head>
        <title>Payment Failed</title>
      </Head>
      <Stack sx={{
        width: '328px',
        height: '100vh',
        display: 'flex',
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <CrossMarkIcon />
        <Title order={2}>Payment Failed</Title>
        <Text
          component="p"
          sx={(theme) => ({
            color: theme.colors.gray[5],
            margin: '20px 0 24px',
          })}
        >
          Sorry, your payment failed.
          {' '}
          <br />
          Would you like to try again?
        </Text>
        <Button
          type="submit"
          size="md"
          onClick={handleClick}
        >
          Back to Cart
        </Button>
      </Stack>
    </>
  );
};

export default FailedPage;
