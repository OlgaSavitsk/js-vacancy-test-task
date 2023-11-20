import { useMemo, useCallback, useState, FC } from 'react';
import {
  Pagination,
  Group,
  Text,
  Paper,
} from '@mantine/core';
import { PaginationState } from '@tanstack/react-table';
// import { Products } from 'types';

interface TableProps {
  // data: Products[];
  dataCount?: number;
  onPageChange?: (value: Record<string, any>) => void;
  perPage: number;
  page?: number;
}

const Pagination: FC<TableProps> = ({
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
    const { pageIndex } = pagination;

    return (
      <Pagination
        total={3}
        value={pageIndex}
        onChange={onPageChangeHandler}
        color="black"
      />
    );
  }, [onPageChangeHandler, pagination]);

  return (
    <>
      <Paper radius="sm" withBorder />
      <Group position="right">
        {dataCount && (
          <Text size="sm" color="dimmed">
            Showing
            {' '}
            {/* <b>{table.getRowModel().rows.length}</b> */}
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

export default Pagination;
