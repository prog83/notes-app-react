import React, { memo } from 'react';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import type { TableCellProps } from '@material-ui/core/TableCell';

import TableRow from '@/components/Table/TableRow';
import TableCell from '@/components/Table/TableCell';

export interface Column extends TableCellProps {
  field: string;
  label?: React.ReactNode;
}

interface Props {
  columns: Array<Column>;
  rows: Array<{ id: string | number } & Record<string, React.ReactNode>>;
  className?: string;
}

const DataGrid = ({ columns, rows, className }: Props) => {
  return (
    <TableContainer component={Paper} className={className}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(({ field, label, align }) => (
              <TableCell key={field} align={align}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow key={row.id} hover>
                {columns.map(({ field, align }) => (
                  <TableCell key={field} align={align}>
                    {row[field]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(DataGrid);
