import { FC, memo } from 'react';
import { Input } from '@mantine/core';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Control, Controller, FieldValues, useFormContext, UseFormRegister } from 'react-hook-form';
import { useDebouncedValue } from '@mantine/hooks';
import { register } from 'mixpanel-browser';
import styles from './styles';

interface NumberInput extends NumericFormatProps {
  suffix?: string,
  data?: string,
  label?: string,
  placeholder?: string,
  name?: 'payment_from' | 'payment_to',
  register?: UseFormRegister<FieldValues>,
  control?: Control<FieldValues>,
}

const NestedInput: FC<NumberInput> = memo(
  ({ register, control, name, suffix, placeholder, label, data }) => {
    const [debouncedPaymentTo] = useDebouncedValue(methods.getValues().payment_to, 500, { leading: true });
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
              onChange={omchange}
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
