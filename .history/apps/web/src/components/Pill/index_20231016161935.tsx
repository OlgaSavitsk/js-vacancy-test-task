import { ActionIcon, Badge, MantineTheme, rem } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { FC, memo } from 'react';

interface PillProps extends React.ComponentPropsWithoutRef<'div'> {
  // value: string;
  onRemove?(): void;
}

const Pill: FC<PillProps> = ({ onRemove }) => (
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
    Badge with right section
  </Badge>
);

export default memo(Pill);