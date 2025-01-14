import { NextPage } from 'next';
import router from 'next/router';
import Head from 'next/head';
import { useCallback } from 'react';
import {
  ActionIcon,
  rem,
  Skeleton,
  Stack,
  Title,
  UnstyledButton,
  Text,
  Paper,
  Flex,
  Container } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { Card } from 'components';
import { accountApi } from 'resources/account';
import { RoutePath } from 'routes';

const Products: NextPage = () => {
  const { data: account, isLoading: isListLoading } = accountApi.useGet();

  const handleClick = useCallback(() => {
    router.push(RoutePath.NewProduct);
  }, []);

  return (
    <>
      <Head>
        <title>Your Products</title>
      </Head>
      <Stack spacing="lg">
        <Title order={4}>Your Products</Title>
        <Flex
          gap="lg"
          align="flex-start"
          direction="row"
          wrap="wrap"
          justify={{ base: 'center', lg: 'flex-start' }}
        >
          <Paper
            w={271}
            radius="lg"
            withBorder
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '266px',
              '@media (max-width: 640px)': {
                maxWidth: '100%',
                width: '100%',
              },
            }}
          >
            <UnstyledButton
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: '12px',
              }}
              onClick={handleClick}
            >
              <ActionIcon size="xl" color="blue" radius="xl" variant="filled">
                <IconPlus size={rem(40)} />
              </ActionIcon>
              <Text size="lg" color="blue">
                New Product
              </Text>
            </UnstyledButton>
          </Paper>

          {account?.products ? (account.products.map((item) => (
            <Skeleton
              key={item._id}
              radius="lg"
              visible={isListLoading}
              width={271}
              sx={{
                '@media (max-width: 640px)': {
                  maxWidth: '100%',
                  width: '100%',
                },
              }}
            >
              <Card isCreate product={item} />
            </Skeleton>
          ))) : (
            <Container p={75}>
              <Text size="xl" color="grey">
                No results found, try to adjust your search.
              </Text>
            </Container>
          )}

        </Flex>
      </Stack>
    </>
  );
};

export default Products;
