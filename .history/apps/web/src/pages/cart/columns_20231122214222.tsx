import { Button, CloseButton, Image, Group, Text } from '@mantine/core';
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
      accessorKey: 'remove',
      header: ' ',
      cell: ({ row }) => {
        const { mutate: removeFromCart } = userApi.useRemoveFromCart();

        const handleRemove = async () => {
          await removeFromCart(row.original._id, {
            on
          });
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
