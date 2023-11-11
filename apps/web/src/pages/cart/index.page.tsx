import { useState } from 'react';
import { Stack, Title, SegmentedControl, Container, Text, Group, Image, Button, CloseButton, Paper, Divider } from '@mantine/core';
import { ColumnDef } from '@tanstack/react-table';
import { NextPage } from 'next';
import Head from 'next/head';
import { NumberCell, Table } from 'components';
import { accountApi } from 'resources/account';
import { Products } from 'types';
import { userApi } from 'resources/user';
import { useStyles } from './styles';

interface Columns {
  cart: ColumnDef<Products, unknown>[],
  history: ColumnDef<Products, unknown>[],
}

const columns: Columns = {
  cart: [
    {
      accessorKey: 'item',
      header: 'Item',
      size: 520,
      cell: ({ row }) => (
        <Group spacing={25}>
          <Image height={80} width={80} src={row.original.photoUrl} radius={10} />
          <Text size="md" fw={600}>
            {row.original.title}
          </Text>
        </Group>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Unit Price',
      cell: ({ cell }) => (
        <span>
          {cell.getValue<number>().toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => <NumberCell price={row.original.price} />,
    },
    {
      accessorKey: 'remove',
      header: ' ',
      cell: ({ row }) => {
        const {
          mutate: removeFromCart,
        } = userApi.useRemoveFromCart();

        const handleRemove = async () => {
          await removeFromCart(row.original._id);
        };

        return (
          <Button
            leftIcon={<CloseButton size={20} />}
            variant="subtle"
            fz={16}
            color="gray"
            onClick={handleRemove}
          >
            Remove
          </Button>
        );
      },
    },
  ],
  history: [
    {
      accessorKey: 'item',
      header: 'Item',
      size: 520,
      cell: ({ row }) => (
        <Group spacing={25}>
          <Image height={80} width={80} src={row.original.photoUrl} radius={10} />
          <Text size="md" fw={600}>
            {row.original.title}
          </Text>
        </Group>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Unit Price',
      cell: ({ cell }) => (
        <span>
          {cell.getValue<number>().toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      accessorFn: (row) => {
        const sDay = new Date(row.createdOn!);
        return sDay;
      },
      cell: ({ cell }) => (
        <span>
          {cell.getValue<Date>()?.toLocaleDateString()}
        </span>
      ),
    },
  ],
};

const Cart: NextPage = () => {
  const { classes: { root, indicator, label } } = useStyles();
  const [section, setSection] = useState<'cart' | 'history'>('cart');
  const { data } = accountApi.useGet();

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
          {data?.cart ? (
            <>
              <Table
                columns={columns[section]}
                data={data?.cart}
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
                        1111
                      </Text>
                    </Group>

                    <Button variant="filled" color="blue" fullWidth radius="md" size="md">
                      Proceed to Ckeckout
                    </Button>
                  </Stack>
                </Paper>
              )}
            </>
          ) : (
            <Container p={75}>
              <Text size="xl" color="grey">
                No results found, try to adjust your search.
              </Text>
            </Container>
          )}
        </Group>
      </Stack>
    </>
  );
};

export default Cart;
