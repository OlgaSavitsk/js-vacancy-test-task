import { NumberInputHandlers, Group, ActionIcon, NumberInput, rem } from '@mantine/core';
import { useState, useRef, memo } from 'react';
import { cartHelper } from 'services';

interface NumberCellProps {
  price: number | undefined;
  // onCalculate: (totalSum: number) => void;
}

const NumberCell = ({ price }: NumberCellProps) => {
  const [value, setValue] = useState<number>(1);
  const handlers = useRef<NumberInputHandlers>();

  const handlerPrice = (val: any) => {
    setValue(val);
    cartHelper.calculate(price!, value);
    console.log('price', cartHelper.calculate(price!, value));
  };

  return (
    <Group spacing={5} display="inline-flex">
      <ActionIcon fz={24} color="#CFCFCF" onClick={() => handlers.current?.decrement()}>
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={(val) => handlerPrice(val)}
        handlersRef={handlers}
        max={10}
        min={1}
        styles={{ input: {
          width: rem(42),
          textAlign: 'center',
          fontSize: rem(16),
          border: 'none',
          padding: '0',
          backgroundColor: 'transparent' } }}
      />

      <ActionIcon fz={24} color="gray" onClick={() => handlers.current?.increment()}>
        +
      </ActionIcon>
    </Group>
  );
};

export default memo(NumberCell);
