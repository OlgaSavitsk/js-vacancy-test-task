import { ActionIcon, Badge, MantineTheme, rem } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { FC, memo } from 'react';

interface UsersListParams {
  searchValue?: string;
  filter?: {
    price?: {
      payment_from: string,
      payment_to: string,
    }
  };
}

interface PillProps extends React.ComponentPropsWithoutRef<'div'> {
  value: UsersListParams;
  onRemove?(): void;
}

const Pill: FC<PillProps> = ({ value, onRemove }) => {
  // const [paymentFrom, paymentTo] = value;
  const tags = useMemo(() => {
    return notes.flatMap((note) => {
      return note.tags.map((tag: Tag) => tag.label);
    });
  }, [notes]);

  return (
    <Badge
      color="gray"
      size="xl"
      h={36}
      variant="outline"
      sx={(theme: MantineTheme) => ({
        borderColor: theme.colors.gray[3],
        fontSize: '0.875rem',
        fontWeight: 500,
        backgroundColor: '#fff',
        color: theme.colors.dark[9],
        textTransform: 'none',
      })}
      rightSection={(
        <ActionIcon size="xs" color="gray" radius="xl" variant="filled" onClick={onRemove}>
          <IconX size={rem(16)} />
        </ActionIcon>
    )}
    >
      $
      {paymentFrom}
      -
      $
      {paymentTo}
    </Badge>
  );
};

export default memo(Pill);
