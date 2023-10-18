import { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';

import { Card, NumberInput, Pill } from 'components';

import { , userApi } from 'resources/user';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useStyles } from './styles';

interface UsersListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: 'asc' | 'desc';
  };
  filter?: {
    payment_from: string,
    payment_to: string,
  };
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

const columns: ColumnDef<userTypes.User>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
];

const PER_PAGE = 5;

const schema = z.object({
  payment_from: z.string(),
  payment_to: z.string(),
});

export type SalaryParams = z.infer<typeof schema>;

const Home: NextPage = () => {
  const methods = useForm<SalaryParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_from: '',
      payment_to: '',
    },
  });
  // const [value, setValue] = useState<string[]>([]);

  const { classes: { field, button } } = useStyles();
  const [search, setSearch] = useState('');
  // const [filter, setFilter] = useState<SalaryParams>();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortBy, setSortBy] = useState(selectOptions[0].value);
  // const [filterDate, setFilterDate] = useState({});

  const [params, setParams] = useState<UsersListParams>({});

  const [debouncedSearch] = useDebouncedValue(search, 500);

  // const onSubmit = (data: SalaryParams) => console.log(data);

  const handleSort = useCallback((value: string) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'newest' ? { createdOn: 'desc' } : { createdOn: 'asc' },
    }));
  }, []);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const handleValueRemove = (val: string) => setValue((current) => current.filter((v) => v !== val));
  // const handleFilter = useCallback(([sinceDate, dueDate]: DatesRangeValue) => {
  //   setFilterDate([sinceDate, dueDate]);

  //   if (!sinceDate) {
  //     setParams((prev) => ({
  //       ...prev,
  //       filter: {},
  //     }));
  //   }

  //   if (dueDate) {
  //     setParams((prev) => ({
  //       ...prev,
  //       filter: { createdOn: { sinceDate, dueDate } },
  //     }));
  //   }
  // }, []);

  // console.log(watch());

  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) => console.log(value, name, type));
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const handleReset = () => {
    methods.reset();
    setParams((prev) => ({
      ...prev,
      filter: {
        payment_from: '',
        payment_to: '',
      },
    }));
  };

  const onSubmit = (data: SalaryParams) => {
    console.log('data', data);
    setParams((prev) => ({
      ...prev,
      filter: {
        payment_from: data.payment_from.replace(/\$/g, ''),
        payment_to: data.payment_to.replace(/\$/g, ''),
      },
    }));
  };
  // signIn(data, {
  //   onError: (e) => handleError(e, setError),
  // });

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
  }, [debouncedSearch]);

  const { data, isLoading: isListLoading } = userApi.useList(params);

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
              <Skeleton
                radius="sm"
                visible={isListLoading}
                width="auto"
              >
                <Group position="apart">
                  <Title order={5}>
                    12 results
                  </Title>
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
                <Pill value="222" onRemove={() => handleValueRemove('222')} />
              </Skeleton>
              {data?.items.length ? (
                <Grid gutter={20}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Grid.Col span={4}>
                      <Skeleton
                        key={`sklton-${String(item)}`}
                        radius="sm"
                        visible={isListLoading}
                        width="auto"
                        height="auto"
                      >
                        <Card />
                      </Skeleton>
                    </Grid.Col>

                  ))}
                </Grid>
                // <Table
                //   columns={columns}
                //   data={data.items}
                //   dataCount={data.count}
                //   rowSelection={rowSelection}
                //   setRowSelection={setRowSelection}
                //   sorting={sorting}
                //   onSortingChange={setSorting}
                //   onPageChange={setParams}
                //   perPage={PER_PAGE}
                // />
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
        {/* <Skeleton
              height={42}
              radius="sm"
              visible={isListLoading}
              width="auto"
              style={{ overflow: 'unset' }}
            >
              <DatePickerInput
                type="range"
                size="md"
                placeholder="Pick date"
                value={filterDate}
                onChange={handleFilter}
              />
            </Skeleton> */}
        {isListLoading && (
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
        )}

      </Stack>
    </>
  );
};

export default Home;
