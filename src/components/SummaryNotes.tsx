import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

import { useSelector } from 'react-redux';

import TableRow from '@/components/Table/TableRow';
import TableCell from '@/components/Table/TableCell';

import { notesSelector } from '@/store/selectors';
import { groupBy, getCategoryAvatar } from '@/helpers';

import { Note } from '@/store/types';
import { HeadCells } from '@/helpers/types';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
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

const headCells: Array<HeadCells> = [{ text: 'Note Category' }, { text: 'Active' }, { text: 'Archived' }];

const getSortedSummaryNotes = (notes: Array<Note>, field: Extract<keyof Note, 'category'>) => {
  const summary = groupBy(notes, field);
  return Object.entries(summary).sort((a, b) => {
    const countA = a[1].length;
    const countB = b[1].length;
    return countB - countA;
  });
};

interface Props {
  className?: string;
}

const SummaryNotes = ({ className }: Props) => {
  const classes = useStyles();

  const notes = useSelector(notesSelector);
  const sortedSummary = getSortedSummaryNotes(notes, 'category');
  console.log('test reselect', sortedSummary);

  return (
    <TableContainer component={Paper} className={className}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell />
            {headCells.map(({ text, align }) => (
              <TableCell key={text} align={align}>
                {text}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSummary.map(([category, array]) => {
            const countActive = array.filter(({ archived }) => !archived).length;
            const countArchived = array.length - countActive;

            return (
              <TableRow key={category} hover>
                <TableCell>{getCategoryAvatar(category)}</TableCell>
                <TableCell>{category}</TableCell>
                <TableCell>{countActive}</TableCell>
                <TableCell>{countArchived}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(SummaryNotes);
