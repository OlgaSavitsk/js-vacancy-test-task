import { useMemo, useCallback, useState, FC } from 'react';

import { Pagination, Group,
  Paper,
} from '@mantine/core';
import { PaginationState } from '@tanstack/react-table';

interface TableProps {
  dataCount?: number;
  onPageChange?: (value: Record<string, any>) => void;
  perPage: number;
  page?: number;
}

const PaginationComponent: FC<TableProps> = ({
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

  const renderPagination = useCallback(() => (
    <Pagination
      total={dataCount ? Math.ceil((dataCount || 0) / perPage) : -1}
      value={pagination.pageIndex}
      onChange={onPageChangeHandler}
      siblings={1}
      color="black"
    />
  ), [dataCount, onPageChangeHandler, pagination, perPage]);

  return (
    <>
      <Paper radius="sm" />
      <Group position="center">
        {renderPagination()}
      </Group>
    </>
  );
};

export default PaginationComponent;
