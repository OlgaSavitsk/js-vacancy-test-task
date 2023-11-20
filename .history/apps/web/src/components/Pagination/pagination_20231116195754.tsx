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

interface TableProps {
  data: Pro[];
  dataCount?: number;
  onPageChange?: (value: Record<string, any>) => void;
  perPage: number;
  page?: number;
}

const Table: FC<TableProps> = ({
  dataCount,
  onPageChange,
  page,
  perPage,
}) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page || 1,
    pageSize: perPage,
  });

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
      <Paper radius="sm" withBorder />
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
