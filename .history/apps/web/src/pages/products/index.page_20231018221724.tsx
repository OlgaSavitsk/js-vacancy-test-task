import { ActionIcon, rem, Skeleton, Stack, Title, UnstyledButton, Text, Paper, Flex } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Card } from 'components';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { userApi } from 'resources/user';
import { RoutePath } from 'routes';

// eslint-disable-next-line arrow-body-style
const Products: NextPage = () => {
  // const [params, setParams] = useState({});
  // const { data, isLoading: isListLoading } = userApi.useList(params);
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
            component={Link}
            href={RoutePath.Profile}
            withBorder
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '266px',
              '@media (max-width: 755px)': {
                maxWidth: '100%',
                width: '100%',
              },
            }}
          >
            <UnstyledButton sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '12px' }}>
              <ActionIcon size="xl" color="blue" radius="xl" variant="filled">
                <IconPlus size={rem(40)} />
              </ActionIcon>
              <Text size="lg" color="blue">
                New Product
              </Text>
            </UnstyledButton>
          </Paper>

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton
              key={`sklton-${String(item)}`}
              radius="lg"
              visible={isListLoading}
              width={271}
              sx={{
                '@media (max-width: 755px)': {
                  maxWidth: '100%',
                  width: '100%',
                },
              }}
            >
              <CardProduct isCreate />
            </Skeleton>

          ))}

        </Flex>
      </Stack>
    </>
  );
};

export default Products;
