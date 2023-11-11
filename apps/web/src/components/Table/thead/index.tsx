import { FC, ReactNode } from 'react';
import { ColumnDefTemplate, HeaderContext, HeaderGroup } from '@tanstack/react-table';

type CellData = {
  [key: string]: string | Function | boolean | Record<string, any>;
};

interface TheadProps {
  // isSortable: boolean,
  headerGroups: HeaderGroup<CellData>[];
  flexRender: (
    template: ColumnDefTemplate<HeaderContext<CellData, any>> | undefined,
    context: HeaderContext<CellData, any>
  ) => ReactNode;
}

const Thead: FC<TheadProps> = ({ headerGroups, flexRender }) => (
  <thead>
    {headerGroups.map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            colSpan={header.colSpan}
            style={{
              textAlign: header.id === 'item' ? 'left' : 'right',
              borderBottom: 'none',
              fontWeight: '400',
              fontSize: '16px',
              color: 'gray',
              paddingBottom: 0,
            }}
          >
            {!header.isPlaceholder
              && flexRender(
                header.column.columnDef.header,
                header.getContext(),
              )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
);

export default Thead;
