import { Button, CloseButton, Image, Group, Text, MediaQuery } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';

import { NumberCell } from 'components';
import { userApi } from 'resources/user';
import { Products } from 'types';

interface Columns {
  cart: ColumnDef<Products, unknown>[];
  history: ColumnDef<Products, unknown>[];
}

const columns: Columns = {
  cart: [
    {
      accessorKey: 'item',
      header: 'Item',
      size: 520,
      cell: ({ row }) => (
        <Group spacing={25}>
          <Image
            height={80}
            width={80}
            src={row.original.photoUrl}
            radius={10}
          />
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
      cell: NumberCell,
    },
    {
      accessorKey: '',
      header: ' ',
      cell: ({ row }) => {
        const { mutate: removeFromCart } = userApi.useRemoveFromCart();

        const handleRemove = async () => {
          await removeFromCart(row.original._id);
        };

        return (
          <>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Button
                leftIcon={<CloseButton size={20} />}
                variant="subtle"
                fz={16}
                color="gray"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: 'flex' }}>
              <Button
                leftIcon={<IconTrash size={20} />}
                variant="subtle"
                fz={16}
                color="gray"
                onClick={handleRemove}
                display="none"
              />
            </MediaQuery>
          </>
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
          <Image
            height={80}
            width={80}
            src={row.original.photoUrl}
            radius={10}
          />
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
        <span>{cell.getValue<Date>()?.toLocaleDateString()}</span>
      ),
    },
  ],
};

export default columns;
