import { Group, Button, Card, Image, Text } from '@mantine/core';
import { FC, memo } from 'react';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  isCreate?: boolean;
  // onRemove?(): void;
}

const CardProduct: FC<CardProps> = ({ isCreate }) => (
  <Card shadow="sm" padding="lg" radius="lg" pb={isCreate ? 0 : 'lg'} withBorder>
    <Card.Section>
      <Image
        src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
        height={isCreate ? 174 : 218}
        alt="Norway"
      />
    </Card.Section>

    <Text fw={700} pt={16}>DJI Air 3</Text>

    <Group position="apart" mt="md" mb="xs">
      <Text size="sm" color="dimmed">
        Price:
      </Text>
      <Text size="lg" fw={700}>
        $1500
      </Text>
    </Group>

    {!isCreate && (
    <Button variant="filled" color="blue" fullWidth mt="md" radius="md" size="md">
      Add to Cart
    </Button>
    )}

  </Card>
);

export default memo(CardProduct);
