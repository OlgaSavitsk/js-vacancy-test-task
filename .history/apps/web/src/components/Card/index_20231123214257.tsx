import { FC, memo } from 'react';
import { Group, Button, Card, Image, Text, ActionIcon, MantineTheme, Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';

import { Products } from 'types';

import queryClient from 'query-client';
import { productsApi } from 'resources/products';
import { userApi } from 'resources/user';
import { useDisclosure } from '@mantine/hooks';

interface CardProps {
  isCreate?: boolean;
  product: Products;
}

const CardProduct: FC<CardProps> = ({ isCreate, product }) => {
  const [opened, { close, open }] = useDisclosure(false);
  const { mutate: removeProduct } = productsApi.useRemoveProduct();

  const {
    mutate: addToCart,
  } = userApi.useAddToCart();

  const handlerProductRemove = async () => {
    await removeProduct(product._id);
  };

  const handlerAddToCart = async () => {
    await addToCart({ product: { ...product }, userId: product.userId }, {
      onSuccess: (data) => {
        queryClient.setQueryData(['cart'], data);
        showNotification({
          title: 'Success',
          message: 'Your product has been successfully add to cart.',
          color: 'green',
        });
      },
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        title="Are you shure you want to delete this product?"
      >
        <Group mt="xl">
          <Button variant="outline" color="pink" onClick={handlerProductRemove}>
            Delete
          </Button>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <Card shadow="sm" padding="lg" radius="lg" pb={isCreate ? 0 : 'lg'} withBorder>
        <Card.Section pos="relative">
          <Image
            src={product.photoUrl}
            width={isCreate ? 271 : 356}
            height={isCreate ? 174 : 218}
            alt="Product"
          />
          {isCreate && (
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
              onClick={open}
            >
              <IconTrash color="gray" />
            </ActionIcon>
          )}
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
          <Button variant="filled" color="blue" fullWidth mt="md" radius="md" size="md" onClick={handlerAddToCart}>
            Add to Cart
          </Button>
        )}
      </Card>
    </>
  );
};

export default memo(CardProduct);
