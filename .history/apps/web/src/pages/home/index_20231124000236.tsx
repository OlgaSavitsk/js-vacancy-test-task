import { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Select,
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
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconX, IconChevronDown, IconArrowsDownUp } from '@tabler/icons-react';

import { Card, NumberInput, PaginationComponent, Pill } from 'components';

import { productsApi } from 'resources/products';
import { useStyles } from './styles';

interface UsersListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: 'asc' | 'desc';
  };
  price?: {
    paymentFrom: string | null,
    paymentTo: string | null,
  }
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
  paymentFrom: z.string().nullable(),
  paymentTo: z.string().nullable(),
});

export type SalaryParams = z.infer<typeof schema>;

const paymentValue = z.object({
  price: z.array(z.string().nullable()).optional(),
  searchValue: z.string().optional(),
});

export type PaymentRangeValue = z.infer<typeof paymentValue>;

const Home: NextPage = () => {
  const { classes: { field, button } } = useStyles();
  const methods = useForm<SalaryParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentFrom: '',
      paymentTo: '',
    },
  });

  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState(selectOptions[0].value);
  const [params, setParams] = useState<UsersListParams>({});
  const [filterDate, setFilterDate] = useState<PaymentRangeValue>({});
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
    setParams((prev) => ({
      ...prev,
      price: undefined,
    }));
  }, [methods]);

  const onSubmit = ({ paymentFrom, paymentTo }: SalaryParams) => {
    setParams((prev) => ({
      ...prev,
      price: {
        paymentFrom: paymentFrom ? paymentFrom.replace(/\$/g, '') : null,
        paymentTo: paymentTo ? paymentTo.replace(/\$/g, '') : null,
      },
    }));
    if (!paymentFrom && !paymentTo) {
      setParams((prev) => ({ ...prev, price: undefined,
      }));
    }
  };

  const handleRemove = useCallback((
    val: string | (string | null)[],
  ) => (Object.values(filterDate!).forEach((value) => {
    if (value === val && typeof val === 'string') {
      setFilterDate((prev) => ({ ...prev, searchValue: undefined }));
      setSearch('');
    }
    if (value === val && Array.isArray(val)) {
      setFilterDate((prev) => ({ ...prev, price: undefined }));
      methods.reset();
      setParams((prev) => ({ ...prev, price: undefined }));
    }
  })), [filterDate, methods]);

  useLayoutEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      searchValue: debouncedSearch,
      perPage: PER_PAGE,
    }));
    setFilterDate({
      price: params.price
        ? [params.price.paymentFrom, params.price.paymentTo]
        : undefined,
      searchValue: debouncedSearch || undefined,
    });
  }, [debouncedSearch, params.price]);

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
                    width: '100%',
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
                // sx={{ width: '350px' }}
                />
              </Skeleton>
              <Group position="apart">
                <Stack>
                  <Skeleton
                    radius="sm"
                    visible={isListLoading}
                    width="auto"
                  >
                    <Title order={5}>
                      {data?.count}
                      {' '}
                      results
                    </Title>
                    {Object.values(filterDate!).map((item) => (
                      item && (
                        <Pill
                          value={item}
                          onRemove={() => handleRemove(item)}
                        />
                      )
                    ))}
                  </Skeleton>
                </Stack>
                <Select
                  size="md"
                  data={selectOptions}
                  value={sortBy}
                  onChange={handleSort}
                  rightSection={<IconChevronDown color="grey" />}
                  icon={<IconArrowsDownUp size={20} color="gray" />}
                  classNames={{ root: field }}
                  withinPortal={false}
                  variant="unstyled"
                  transitionProps={{
                    transition: 'pop-bottom-right',
                    duration: 210,
                    timingFunction: 'ease-out',
                  }}
                />
              </Group>
              {data?.products.length ? (
                <Grid gutter={20}>
                  {data.products.map((item) => (
                    <Grid.Col span={4}>
                      <Skeleton
                        key={item._id}
                        radius="sm"
                        visible={isListLoading}
                        width="auto"
                        height="auto"
                      >
                        <Card product={item} />
                      </Skeleton>
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <Container p={75}>
                  <Text size="xl" color="grey">
                    No results found, try to adjust your search.
                  </Text>
                </Container>
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
