import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from 'react-query';
import { NextPage } from 'next';
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
  title: z.string().min(1, 'Please enter Title').max(50),
  price: z.union([z.number(), z.string()]).pipe(z.coerce.number().gte(1, 'Please enter Title')),
  photoUrl: z.string({
    required_error: 'Photo field is required',
  }),
});

export type UpdateParams = z.infer<typeof schema> & {
  userId: string,
  credentials?: string
};

const NewProduct: NextPage = () => {
  const queryClient = useQueryClient();
  const [price, setPrice] = useState<number | ''>(0);

  const { data: account } = accountApi.useGet();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
    price: price as number,
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
            <PhotoUpload
              register={register}
              onUpload={(val) => setValue('photoUrl', val)}
              error={getValues().photoUrl ? '' : errors.photoUrl?.message}
            />
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
              onChange={setPrice}
              min={0}
              max={10000}
              hideControls
              labelProps={{
                'data-invalid': errors.price,
              }}
              error={price ? '' : errors.price?.message}
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
