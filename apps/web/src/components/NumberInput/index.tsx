import { FC, memo } from 'react';
import { Control, Controller, FieldValues, useFormContext, UseFormRegister } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Input } from '@mantine/core';

import styles from './styles';

interface NumberInput extends NumericFormatProps {
  suffix?: string,
  data?: string,
  label?: string,
  placeholder?: string,
  name?: 'paymentFrom' | 'paymentTo' | 'price',
  register?: UseFormRegister<FieldValues>,
  control?: Control<FieldValues>,
}

const NestedInput: FC<NumberInput> = memo(
  ({ register, control, name, suffix, placeholder, label, data }) => (
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
  ),
);

const NestedInputContainer: FC<NumberInput> = (props) => {
  const methods = useFormContext();

  return <NestedInput {...methods} {...props} />;
};

export default NestedInputContainer;
