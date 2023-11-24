import { useMemo, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Title, SegmentedControl, Text, Group, Button, Paper, Divider } from '@mantine/core';
import { loadStripe } from '@stripe/stripe-js';

import { accountApi } from 'resources/account';
import { productsApi } from 'resources/products';
import config from 'config';
import { handleError } from 'utils';
import { Table } from 'components';
import CartEmpty from 'components/CartEmpty';
import { Products } from 'types';
import columns from './columns';
import { useStyles } from './styles';

const stripePromise = loadStripe(
  config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const Cart: NextPage = () => {
  const { classes: { root, indicator, label } } = useStyles();
  const [section, setSection] = useState<'cart' | 'history'>('cart');
  const [updatedPrice, setUpdatedCart] = useState<Products[]>([]);
  const { data: account } = accountApi.useGet();
  const { mutate: payment } = productsApi.usePaymentProduct();

  const dataCart = useMemo(
    () => (updatedCart.length ? updatedCart : account!.cart),
    [account, updatedCart],
  );

  console.log('dataCart', account, updatedCart);

  const total = useMemo(
    () => dataCart
      .reduce((sum, product) => sum + (product.price! * product.quantity!), 0),
    [dataCart],
  );

  const createCheckOutSession = async () => {
    const stripe = await stripePromise;
    payment(dataCart, {
      onSuccess: async (data) => {
        const result = await stripe!.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (result.error) {
          handleError(result.error);
        }
      },
    });
  };

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <Stack>
        <Title order={4}>Cart</Title>
        <nav>
          <div>
            <SegmentedControl
              value={section}
              onChange={(value: 'cart' | 'history') => setSection(value)}
              transitionTimingFunction="ease"
              classNames={{ root, indicator, label }}
              data={[
                { label: 'My Cart', value: 'cart' },
                { label: 'History', value: 'history' },
              ]}
            />
          </div>
        </nav>
        <Group position="apart" align="start" spacing={78} noWrap>
          {dataCart.length ? (
            <>
              <Table
                columns={columns[section]}
                data={dataCart}
                onCartChange={(val) => setUpdatedCart(val)}
              />
              {section === 'cart' && (
                <Paper radius="xs" p="md" w={315}>
                  <Stack spacing={32}>
                    <Title order={4}>Summary</Title>
                    <Divider />
                    <Group position="apart">
                      <Text size="sm" color="dimmed">
                        Price:
                      </Text>
                      <Text size="lg" fw={700}>
                        $
                        {total}
                      </Text>
                    </Group>

                    <Button onClick={createCheckOutSession} variant="filled" color="blue" fullWidth radius="md" size="md">
                      Proceed to Ckeckout
                    </Button>
                  </Stack>
                </Paper>
              )}
            </>
          ) : (
            <CartEmpty />
          )}
        </Group>
      </Stack>
    </>
  );
};

export default Cart;
