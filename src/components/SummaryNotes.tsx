import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { useSelector } from 'react-redux';

import DataGrid, { Column } from '@/components/Table/DataGrid';

import { summaryNotesSelector } from '@/store/selectors';

const useStyles = makeStyles({
  table: {
    minWidth: 750,
    '& thead > tr > *': {
      '&:nth-child(1)': {
        width: 60,
        minWidth: 60,
      },
      '&:nth-child(3)': {
        width: '25%',
      },
      '&:nth-child(4)': {
        width: '25%',
      },
    },
  },
});

const columns: Array<Column> = [
  { field: 'avatar' },
  { field: 'category', label: 'Note Category' },
  { field: 'active', label: 'Active' },
  { field: 'archived', label: 'Archived' },
];

interface Props {
  className?: string;
}

const SummaryNotes = ({ className }: Props) => {
  const classes = useStyles();
  const rows = useSelector(summaryNotesSelector);

  return <DataGrid columns={columns} rows={rows} className={clsx(classes.table, className)} />;
};

export default memo(SummaryNotes);
