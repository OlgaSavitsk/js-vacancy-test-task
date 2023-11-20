import { FC, memo, useCallback } from 'react';
import { Input } from '@mantine/core';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Control, Controller, FieldValues, useFormContext, UseFormRegister } from 'react-hook-form';
import { useDebouncedState } from '@mantine/hooks';
import styles from './styles';

interface NumberInput extends NumericFormatProps {
  suffix?: string,
  data?: string,
  label?: string,
  placeholder?: string,
  name?: 'payment_from' | 'payment_to',
  register?: UseFormRegister<FieldValues>,
  control?: Control<FieldValues>,
  setDebouncedValue: (val: string) => void,
}

const NestedInput: FC<NumberInput> = memo(
  ({ register, control, name, suffix, placeholder, label, data, setDebouncedValue }) => {
    const [debouncedPaymentTo, setDebounced] = useDebouncedState('', 1000);

    const handleTyping = useCallback(() => {
      setDebouncedValue(debouncedPaymentTo);
    }, [debouncedPaymentTo, setDebouncedValue]);

    console.log(debouncedPaymentTo);

    return (
      <Controller
        {...register!(name!)}
        control={control}
        name={name!}
        render={({ field: { onChange, value } }) => (
          <Input.Wrapper label={label}>
            <Input
              component={NumericFormat}
              suffix={suffix}
              data-elem={data}
              icon={placeholder}
              styles={(theme) => styles(theme)}
              onChange={onChange}
              value={value}
            />
          </Input.Wrapper>
        )}
      />
    );
  },
);

const NestedInputContainer: FC<NumberInput> = (props) => {
  const methods = useFormContext();

  return <NestedInput {...methods} {...props} />;
};

export default NestedInputContainer;
