import { useMemo, useCallback, useState, FC } from 'react';
import {
  Table as TableContainer,
  Checkbox,
  Pagination,
  Group,
  Text,
  Paper,
} from '@mantine/core';
import { PaginationState } from '@tanstack/react-table';

const Table: FC = ({
  data,
  dataCount,
  columns,
  horizontalSpacing = 'xl',
  verticalSpacing = 'lg',
  rowSelection,
  setRowSelection,
  sorting,
  onSortingChange,
  onPageChange,
  page,
  perPage,
}) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page || 1,
    pageSize: perPage,
  });
  const isSelectable = !!rowSelection && !!setRowSelection;
  const isSortable = useMemo(() => !!onSortingChange, [onSortingChange]);

  const selectableColumns: ColumnDef<unknown, any>[] = useMemo(() => [{
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        sx={(theme) => ({
          ...(table.getIsSomeRowsSelected() && {
            '& .mantine-Checkbox-input': {
              backgroundColor: theme.colors.blue[6],
              border: 'none',
            },
          }),
          color: theme.white,
        })}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }], []);

  const pagination = useMemo(() => ({
    pageIndex,
    pageSize,
  }), [pageIndex, pageSize]);

  const onPageChangeHandler = useCallback((currentPage: any, direction?: string) => {
    setPagination({ pageIndex: currentPage, pageSize });

    if (onPageChange) {
      onPageChange((prev: Record<string, any>) => ({ ...prev, page: currentPage, direction }));
    }
  }, [onPageChange, pageSize]);

  const table = useReactTable({
    data,
    columns: isSelectable ? [...selectableColumns, ...columns] : columns,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
    onSortingChange,
    onPaginationChange: onPageChangeHandler,
    pageCount: dataCount ? Math.ceil((dataCount || 0) / perPage) : -1,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const renderPagination = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { pageIndex } = table.getState().pagination;

    return (
      <Pagination
        total={table.getPageCount()}
        value={pageIndex}
        onChange={onPageChangeHandler}
        color="black"
      />
    );
  }, [onPageChangeHandler, table]);

  return (
    <>
      <Paper radius="sm" withBorder>
        <TableContainer
          horizontalSpacing={horizontalSpacing}
          verticalSpacing={verticalSpacing}
        >
          <Thead
            isSortable={isSortable}
            headerGroups={table.getHeaderGroups()}
            flexRender={flexRender}
          />
          <Tbody
            isSelectable={isSelectable}
            rows={table.getRowModel().rows}
            flexRender={flexRender}
          />
        </TableContainer>
      </Paper>
      <Group position="right">
        {dataCount && (
          <Text size="sm" color="dimmed">
            Showing
            {' '}
            <b>{table.getRowModel().rows.length}</b>
            {' '}
            of
            {' '}
            <b>{dataCount}</b>
            {' '}
            results
          </Text>
        )}
        {renderPagination()}
      </Group>
    </>
  );
};

export default Table;