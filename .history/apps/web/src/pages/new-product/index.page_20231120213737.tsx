import { FC, useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from 'react-query';
import router from 'next/router';
import Head from 'next/head';

import { showNotification } from '@mantine/notifications';
import { Button, TextInput, Stack, Title, NumberInput, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { productsApi } from 'resources/products';
import { accountApi } from 'resources/account';
import { handleError } from 'utils';
import { RoutePath } from 'routes';
import PhotoUpload from './components/PhotoUpload';

const schema = z.object({
  title: z.string().min(1, 'Please enter Title').max(100),
  price: z.union([z.number(), z.string().min(1, 'Please enter Price')]),
  photoUrl: z.string().min(1, 'Photo field is required'),
});

type UpdateParams = z.infer<typeof schema> & {
  userId: string,
  credentials?: string
};

interface NewProductProps {
  onClose: () => void
}

const NewProduct: FC<NewProductProps> = () => {
  const queryClient = useQueryClient();
  // const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [value, setPrice] = useState<number | ''>('');

  const { data: account } = accountApi.useGet();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    setError,
  } = useForm<UpdateParams>({
    resolver: zodResolver(schema),
  });

  const {
    mutate: create,
    isLoading: isUpdateLoading,
  } = productsApi.useCreate<UpdateParams>();

  const onSubmit = (
    submitData: UpdateParams,
  ) => create({
    ...submitData,
    price: value,
    userId: account!._id,
  }, {
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], data);
      showNotification({
        title: 'Success',
        message: 'Your product has been successfully create.',
        color: 'green',
      });
      router.push(RoutePath.Products);
    },
    onError: (e) => handleError(e, setError),
  });

  console.log(errors);

  return (
    <>
      <Head>
        <title>Create new product</title>
      </Head>
      <Stack
        sx={{ width: '694px' }}
        spacing={32}
      >
        <Title order={4}>Create new product</Title>
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '34px' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={20}>
            <Controller
              {...register('photoUrl', { required: 'Photo field is required' })}
              control={control}
              name="photoUrl"
              render={() => (
                <PhotoUpload
                  onUpload={(val) => setValue('photoUrl', val)}
                  error={errors.photoUrl?.message}
                />
              )}
            />
            {errors!.credentials && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {errors!.credentials.message}
            </Alert>
            )}
            <TextInput
              {...register('title')}
              label="Title of the product"
              placeholder="Enter title of the product..."
              labelProps={{
                'data-invalid': !!errors.title,
              }}
              error={errors.title?.message}
            />
            {errors!.credentials && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {errors!.credentials.message}
            </Alert>
            )}
            <NumberInput
              {...register('price')}
              label="Price"
              placeholder="Enter price of the product"
              labelProps={{
                'data-invalid': !!errors.price,
              }}
              value={value}
              onChange={setPrice}
              max={1000}
              min={1}
              hideControls
              error={errors.price?.message}
            />
            {errors!.credentials && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {errors!.credentials.message}
            </Alert>
            )}
          </Stack>
          <div style={{ alignSelf: 'self-end' }}>
            <Button
              type="submit"
              loading={isUpdateLoading}
            >
              Upload Product
            </Button>
          </div>
        </form>
      </Stack>
    </>
  );
};

export default NewProduct;
