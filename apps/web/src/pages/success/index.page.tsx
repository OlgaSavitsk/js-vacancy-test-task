import { useCallback, useLayoutEffect } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { NextPage } from 'next';

import { Stack, Title, Text, Button } from '@mantine/core';

import { RoutePath } from 'routes';
import { PartyIcon } from 'public/icons';
import { productsApi } from 'resources/products';

const SuccessPage: NextPage = () => {
  const {
    mutate: updateProduct,
  } = productsApi.useUpdatePaymentProduct();

  const handleClick = useCallback(() => {
    router.push(RoutePath.Cart);
  }, []);

  useLayoutEffect(() => {
    async function fetchData() {
      await updateProduct({ product: null });
    }
    fetchData();
  }, [updateProduct]);

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
        <Title order={2}>Payment Successfull</Title>
        <Text
          component="p"
          sx={(theme) => ({
            color: theme.colors.gray[5],
            margin: '20px 0 24px',
          })}
        >
          Hooray, you have completed your payment!
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

export default SuccessPage;
