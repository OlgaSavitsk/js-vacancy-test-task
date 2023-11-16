import { useState, useRef } from 'react';
import { NumberInputHandlers, Group, ActionIcon, NumberInput, rem } from '@mantine/core';

import queryClient from 'query-client';
import { userApi } from 'resources/user';

const NumberCell = ({ row, table }: any) => {
  const [value, setValue] = useState<number | ''>(row.original.quantity!);
  const handlers = useRef<NumberInputHandlers>();

  const {
    mutate: update,
  } = userApi.useUpdate();

  const handlerPrice = async (val: number) => {
    setValue(val);
    await update({ _id: row.original._id, quantity: val }, {
      onSuccess: (data) => {
        queryClient.setQueryData(['cart'], data);
        table.options.meta?.updatePrice(data);
      },
    });
  };

  return (
    <Group spacing={5} display="inline-flex">
      <ActionIcon fz={24} color="#CFCFCF" onClick={() => handlers.current?.decrement()}>
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={(val) => handlerPrice(val as number)}
        handlersRef={handlers}
        max={10}
        min={1}
        defaultValue={1}
        styles={{
          input: {
            width: rem(42),
            textAlign: 'center',
            fontSize: rem(16),
            border: 'none',
            padding: '0',
            backgroundColor: 'transparent',
          },
        }}
      />

      <ActionIcon fz={24} color="gray" onClick={() => handlers.current?.increment()}>
        +
      </ActionIcon>
    </Group>
  );
};

export default NumberCell;
