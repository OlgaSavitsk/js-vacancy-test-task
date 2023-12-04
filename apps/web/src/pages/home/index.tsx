import { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Text,
  Container,
  UnstyledButton,
  SelectItem,
  Grid,
  CloseButton,
  Paper,
  LoadingOverlay,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconX } from '@tabler/icons-react';

import { Card, NumberInput, PaginationComponent, Pill, SortControl } from 'components';
import { productsApi } from 'resources/products';
import { useStyles } from './styles';

export interface UsersListParams {
  page?: number;
  perPage?: number;
  searchValue?: string | undefined;
  sort?: {
    createdOn: 'asc' | 'desc';
  };
  price?: {
    paymentFrom: string | null,
    paymentTo: string | null,
  } | undefined
}

const selectOptions: SelectItem[] = [
  {
    value: 'newest',
    label: 'Sort by newest',
  },
  {
    value: 'oldest',
    label: 'Sort by oldest',
  },
];

const PER_PAGE = 6;

const schema = z.object({
  paymentFrom: z.string().transform((val) => val.replace(/[^\d.-]/g, '')).nullable(),
  paymentTo: z.string().transform((val) => val.replace(/[^\d.-]/g, '')).nullable(),
});

type FormInputData = z.input<typeof schema>;
type FormOutputData = z.output<typeof schema>;
type FilterParams = FormOutputData | string;

const Home: NextPage = () => {
  const { classes: { button } } = useStyles();
  const methods = useForm<FormInputData, FormOutputData>({
    defaultValues: { paymentFrom: '', paymentTo: '' },
    resolver: zodResolver(schema),
  });

  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState(selectOptions[0].value);
  const [params, setParams] = useState<UsersListParams>({});
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleSort = useCallback((val: string) => {
    setSortBy(val);
    setParams((prev) => ({
      ...prev,
      sort: val === 'newest' ? { createdOn: 'desc' } : { createdOn: 'asc' },
    }));
  }, []);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const handleReset = useCallback(() => {
    methods.reset();
    setParams((prev) => ({ ...prev, price: undefined }));
  }, [methods]);

  const onSubmit = ({ paymentFrom, paymentTo }: FormOutputData) => {
    setParams((prev) => ({
      ...prev,
      price: {
        paymentFrom: paymentFrom || null,
        paymentTo: paymentTo || null,
      },
    }));
    if (!paymentFrom && !paymentTo) {
      setParams((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleRemove = useCallback((
    pillValue: FilterParams,
  ) => (Object.values(params!).forEach((value) => {
    if (value === pillValue && typeof pillValue === 'string') {
      setSearch('');
    } else if (value === pillValue) {
      methods.reset();
      setParams((prev) => ({ ...prev, price: undefined }));
    }
  })), [methods, params]);

  useLayoutEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      searchValue: debouncedSearch || undefined,
      perPage: PER_PAGE,
    }));
  }, [debouncedSearch]);

  const { data, isLoading: isListLoading } = productsApi.useList(params);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Stack spacing="lg">
        <Grid gutter={28}>
          <Grid.Col span="content">
            <Skeleton
              radius="sm"
              visible={isListLoading}
              width="auto"
              sx={{ overflow: !isListLoading ? 'initial' : 'overflow' }}
            >
              <Paper
                maw={315}
                p="lg"
                radius="md"
                withBorder
                sx={{
                  alignSelf: 'start',
                  '@media (max-width: 755px)': {
                    maxWidth: '100%',
                  },
                }}
              >
                <FormProvider {...methods}>
                  <form onChange={methods.handleSubmit(onSubmit)}>
                    <Group sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <Title weight={700} fz={20}>
                        Filters
                      </Title>
                      <CloseButton
                        className={button}
                        aria-label="Close modal"
                        iconSize={16}
                        type="button"
                        onClick={handleReset}
                      />
                    </Group>
                    <Grid align="flex-end">
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Price"
                          name="paymentFrom"
                          placeholder="From:"
                          suffix="$"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <NumberInput
                          name="paymentTo"
                          placeholder="To:"
                          suffix="$"
                          data="salary-to-input"
                        />
                      </Grid.Col>
                    </Grid>
                  </form>
                </FormProvider>
              </Paper>
            </Skeleton>
          </Grid.Col>
          <Grid.Col span="auto">
            <Stack>
              <Skeleton
                height={42}
                radius="sm"
                visible={isListLoading}
                width="auto"
                sx={{ flexGrow: 0.25 }}
              >
                <TextInput
                  size="md"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Type to search..."
                  icon={<IconSearch size={16} />}
                  rightSection={search ? (
                    <UnstyledButton
                      onClick={() => setSearch('')}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <IconX color="gray" />
                    </UnstyledButton>
                  ) : null}
                />
              </Skeleton>
              <Group position="apart">
                <Stack>
                  <Skeleton
                    radius="sm"
                    visible={isListLoading}
                    width="auto"
                  >
                    {data && (
                    <Title order={5}>
                      {data.count}
                      {' '}
                      result
                      {data.count! === 1 ? '' : 's'}
                    </Title>
                    )}
                    {Object.values({ price: params.price, searchValue: params.searchValue })
                      .map((item) => (
                        item && (
                          <Pill
                            value={item}
                            onRemove={() => handleRemove(item)}
                          />
                        )
                      ))}
                  </Skeleton>
                </Stack>
                <SortControl
                  selectOptions={selectOptions}
                  sortBy={sortBy}
                  onChange={handleSort}
                />
              </Group>
              {data?.products.length ? (
                <Grid
                  gutter={20}
                  sx={{
                    '@media (max-width: 755px)': {
                      justifyContent: 'center',
                      width: '100%',
                    },
                  }}
                >
                  {data.products.map((item) => (
                    <Grid.Col sm={12} md={6} lg={4}>
                      <Skeleton
                        key={item._id}
                        radius="sm"
                        visible={isListLoading}
                        width="auto"
                        height="auto"
                        sx={{
                          '@media (max-width: 755px)': {
                            display: 'flex',
                            justifyContent: 'center',
                          },
                        }}
                      >
                        <Card product={item} />
                      </Skeleton>
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <Group pos="relative">
                  <LoadingOverlay visible={isListLoading} overlayBlur={2} loaderProps={{ size: 'lg', variant: 'dots' }} />
                  {!isListLoading && (
                    <Container p={75}>
                      <Text size="xl" color="grey">
                        No results found, try to adjust your search.
                      </Text>
                    </Container>
                  )}
                </Group>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
        <PaginationComponent
          dataCount={data?.count}
          onPageChange={setParams}
          perPage={PER_PAGE}
        />
      </Stack>
    </>
  );
};

export default Home;
