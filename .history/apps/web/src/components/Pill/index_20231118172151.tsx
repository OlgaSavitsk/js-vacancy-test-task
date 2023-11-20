import { ActionIcon, Badge, MantineTheme, rem } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { FC, memo, useMemo } from 'react';

interface PillProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string | {
    payment_from: string | null,
    payment_to: string
  } | null;
  onRemove?(): void;
}

const Pill: FC<PillProps> = ({ value, onRemove }) => {
  const [paymentFrom, paymentTo] = value;

  // const tags = useMemo(() => value.flatMap((val) => val), [value]);

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
      {typeof value === 'string' ? value : value?.payment_from}
    </Badge>
  );
};

export default memo(Pill);
