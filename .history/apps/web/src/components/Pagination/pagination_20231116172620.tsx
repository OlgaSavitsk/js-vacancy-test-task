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