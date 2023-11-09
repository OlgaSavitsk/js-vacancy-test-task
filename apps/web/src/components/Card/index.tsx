import { Group, Button, Card, Image, Text, ActionIcon, MantineTheme } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { FC, memo } from 'react';
import { productsApi } from 'resources/products';
import { Products } from 'types';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  isCreate?: boolean;
  product: Products;
}

const CardProduct: FC<CardProps> = ({ isCreate, product }) => {
  const { mutate: removeProduct } = productsApi.useRemoveProduct();

  const handlerProductRemove = async () => {
    await removeProduct(product._id);
  };

  return (
    <Card shadow="sm" padding="lg" radius="lg" pb={isCreate ? 0 : 'lg'} withBorder>
      <Card.Section pos="relative">
        <Image
          src={product.photoUrl}
          width={isCreate ? 271 : 320}
          height={isCreate ? 174 : 218}
          alt="Product"
        />
        <ActionIcon
          size="lg"
          radius="md"
          variant="default"
          aria-label="Remove"
          sx={(theme: MantineTheme) => ({
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
          })}
          onClick={handlerProductRemove}
        >
          <IconTrash color="gray" />
        </ActionIcon>
      </Card.Section>

      <Text fw={700} pt={16}>{product.title}</Text>

      <Group position="apart" mt="md" mb="xs">
        <Text size="sm" color="dimmed">
          Price:
        </Text>
        <Text size="lg" fw={700}>
          {product.price}
        </Text>
      </Group>

      {!isCreate && (
        <Button variant="filled" color="blue" fullWidth mt="md" radius="md" size="md">
          Add to Cart
        </Button>
      )}

    </Card>
  );
};

export default memo(CardProduct);
