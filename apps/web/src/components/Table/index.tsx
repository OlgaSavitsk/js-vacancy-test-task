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

import { Products } from 'types';
import Thead from './thead';
import Tbody from './tbody';

type SpacingSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface TableProps {
  data: RowData[];
  columns: ColumnDef<any>[];
  horizontalSpacing?: SpacingSizes;
  verticalSpacing?: SpacingSizes;
  onCartChange: (cart: Products[]) => void
}

const Table: FC<TableProps> = ({
  data,
  columns,
  horizontalSpacing = 'xl',
  verticalSpacing = 'lg',
  onCartChange,
}) => {
  const table = useReactTable({
    data,
    columns,
    meta: {
      updatePrice: (cart: Products[]) => {
        onCartChange(cart);
      },
    },
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
