import { FC } from 'react';
import {
  Table as TableContainer,
  Paper,
  rem,
} from '@mantine/core';
import {
  ColumnDef,
  flexRender,
  RowData,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';

import Thead from './thead';
import Tbody from './tbody';

type SpacingSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface TableProps {
  data: RowData[];
  columns: ColumnDef<any>[];
  horizontalSpacing?: SpacingSizes;
  verticalSpacing?: SpacingSizes;
}

const Table: FC<TableProps> = ({
  data,
  columns,
  horizontalSpacing = 'xl',
  verticalSpacing = 'lg',
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Paper radius="sm" style={{ maxWidth: rem(915), width: '100%', background: 'transparent' }}>
      <TableContainer
        horizontalSpacing={horizontalSpacing}
        verticalSpacing={verticalSpacing}
      >
        <Thead
          headerGroups={table.getHeaderGroups()}
          flexRender={flexRender}
        />
        <Tbody
          rows={table.getRowModel().rows}
          flexRender={flexRender}
        />
      </TableContainer>
    </Paper>
  );
};

export default Table;
