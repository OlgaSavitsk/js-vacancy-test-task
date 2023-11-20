import { ChangeEvent, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { z } from 'zod';
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

import { FormProvider, useForm } from 'react-hook-form';
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
    payment_from: string,
    payment_to: string,
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

const PER_PAGE = 5;

const schema = z.object({
  payment_from: z.string().nullable(),
  payment_to: z.string().nullable(),
});

export type SalaryParams = z.infer<typeof schema>;

const paymentValue = schema.or(z.string());
export type PaymentRangeValue = z.infer<typeof paymentValue>;

const Home: NextPage = () => {
  const { classes: { field, button } } = useStyles();
  const methods = useForm<SalaryParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_from: '',
      payment_to: '',
    },
  });

  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState(selectOptions[0].value);
  const [params, setParams] = useState<UsersListParams>({});
  const [filterDate, setFilterDate] = useState<PaymentRangeValue[]>([]);
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [value, setValue] = useState<any>({});

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
      price: {
        payment_from: '',
        payment_to: '',
      },
    }));
  }, [methods]);

  const onSubmit = ({ payment_from, payment_to }: SalaryParams) => {
    if (!payment_from) {
      setParams((prev) => ({
        ...prev,
        price: undefined,
      }));
    }

    if (payment_to) {
      setValue({
        payment_from: payment_from!.replace(/\$/g, ''),
        payment_to: payment_to!.replace(/\$/g, ''),
      });
    }
  };

  useLayoutEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      searchValue: debouncedSearch,
      pr
      perPage: PER_PAGE,
    }));
    setFilterDate([params.price!, params.searchValue!]);
  }, [debouncedSearch, params.price, params.searchValue]);

  const { data, isLoading: isListLoading } = productsApi.useList(params);

  // const filterData = useMemo(() =>
  // setFilterDate([params.price!, params.searchValue!]), [params]);
  // eslint-disable-next-line max-len
  const handleRemove = useCallback((val: number) => setFilterDate(filterDate.filter((_, index) => index !== val)), [filterDate]);

  console.log('filterDate', filterDate, methods.formState.isSubmitted);

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
                  <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                          name="payment_from"
                          placeholder="From:"
                          suffix="$"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <NumberInput
                          name="payment_to"
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
                    {filterDate.map((item, index) => (
                      item && (
                        <Pill
                          value={item}
                          onRemove={() => handleRemove(index)}
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
        {/* {isListLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={`sklton-${String(item)}`}
                height={50}
                radius="sm"
                mb="sm"
              />
            ))}
          </>
        )} */}
      </Stack>
    </>
  );
};

export default Home;
