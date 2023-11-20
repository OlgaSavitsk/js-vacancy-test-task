import { FC, memo } from 'react';
import { ActionIcon, Badge, MantineTheme, rem } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface PillProps extends React.ComponentPropsWithoutRef<'div'> {
  value: {
    price?: (string | null)[] | undefined;
  } | {
    searchValue?: string | undefined;
  };
  onRemove?(): void;
}

const Pill: FC<PillProps> = ({ value, onRemove }) => {
  const [paymentFrom, paymentTo] = value.price || [];
  const paymentRange = (
    <>
      {paymentFrom && `$${paymentFrom}`}
      {paymentTo && `-$${paymentTo}`}
    </>
  );
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
      {value.searchValue ? value.searchValue : paymentRange}
    </Badge>
  );
};
export default memo(Pill);
