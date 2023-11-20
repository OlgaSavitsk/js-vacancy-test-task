import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from 'react-query';
import Head from 'next/head';
import { showNotification } from '@mantine/notifications';
import { Button, TextInput, Stack, Title, NumberInput } from '@mantine/core';

import { handleError } from 'utils';
import { productsApi } from 'resources/products';
import { accountApi } from 'resources/account';
import { FC, useState } from 'react';
import PhotoUpload from './components/PhotoUpload';

const schema = z.object({
  title: z.string().min(1, 'Please enter Title').max(100),
  price: z.number(),
});

interface UpdateParams extends z.infer<typeof schema> {
  userId: string,
  photoUrl: string,
}

interface NewProductProps {
  onClose: () => void
}

const NewProduct: FC<NewProductProps> = ({ onClose }: NewProductProps) => {
  const queryClient = useQueryClient();
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<number | ''>(0);

  const { data: account } = accountApi.useGet();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
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
    userId: account!._id,
    photoUrl: photoUrl! }, {
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], data);
      showNotification({
        title: 'Success',
        message: 'Your product has been successfully create.',
        color: 'green',
      });
      onClose();
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Create new product</title>
      </Head>
      <Stack
        sx={{ width: '694px', paddingTop: '48px' }}
        spacing={32}
      >
        <Title order={4}>Create new product</Title>
        <PhotoUpload onUpload={(val) => setPhotoUrl(val)} />
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '34px' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={20}>
            <TextInput
              {...register('title')}
              label="Title of the product"
              placeholder="Enter title of the product..."
              labelProps={{
                'data-invalid': !!errors.title,
              }}
              error={errors.title?.message}
            />
            <NumberInput
              {...register('price')}
              label="Price"
              placeholder="Enter price of the product"
              labelProps={{
                'data-invalid': !!errors.price,
              }}
              onChange={set}
              hideControls
              error={errors.price?.message}
            />
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
