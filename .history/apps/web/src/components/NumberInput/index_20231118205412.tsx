import { FC, memo } from 'react';
import { Input } from '@mantine/core';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Control, Controller, FieldValues, useFormContext, UseFormRegister } from 'react-hook-form';
// import { useDebouncedState } from '@mantine/hooks';
import styles from './styles';

interface NumberInput extends NumericFormatProps {
  suffix?: string,
  data?: string,
  label?: string,
  placeholder?: string,
  name?: 'payment_from' | 'payment_to',
  register?: UseFormRegister<FieldValues>,
  control?: Control<FieldValues>,
  // setDebouncedValue: (val: string) => void,
}

const NestedInput: FC<NumberInput> = memo(
  ({ register, control, name, suffix, placeholder, label, data }) => (
    <Controller
      {...register!(name!)}
      control={control}
      name={name!}
      render={({ field: { onChange, value, ref } }) => (
        <Input.Wrapper label={label}>
          <Input
            component={NumericFormat}
            suffix={suffix}
            data-elem={data}
            icon={placeholder}
            styles={(theme) => styles(theme)}
            onChange={onChange}
            value={value}
            onChange={(value) => {
              props.onChange(value);
              changeHandler(value, name);
            }}
          />
        </Input.Wrapper>
      )}
    />
  )
  ,
);

const NestedInputContainer: FC<NumberInput> = (props) => {
  const methods = useFormContext();

  return <NestedInput {...methods} {...props} />;
};

export default NestedInputContainer;
