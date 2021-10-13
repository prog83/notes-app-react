import React, { memo, useState, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';

import { useDispatch, useSelector } from 'react-redux';

import TableRow from '@/components/Table/TableRow';
import TableCell from '@/components/Table/TableCell';
import IconButton from '@/components/IconButton';

import { listNotesSelector, modeArchivedSelector } from '@/store/selectors';
import { setModeActived } from '@/store/actions';
import { getIconArchived } from '@/helpers';

import { HeadCells } from '@/helpers/types';

import ListItemNotes from './ListItemNotes';
import NoteDialog, { NoteDialogProvider, NoteDialog as NoteDialogState } from './NoteDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
      '& thead > tr > *': {
        '&:nth-child(1)': {
          width: 60,
          minWidth: 60,
        },
        '&:nth-child(2)': {
          width: 200,
        },
        '&:nth-child(3)': {
          width: 150,
        },
        '&:nth-child(4)': {
          width: 150,
        },
        '&:nth-child(7)': {
          width: 180,
          minWidth: 180,
        },
      },
    },
    headIcon: {
      color: theme.palette.common.white,
    },
    createNoteButton: {
      marginTop: theme.spacing(2),
      marginLeft: 'auto',
    },
  }),
);

const headCells: Array<HeadCells> = [
  { text: 'Name' },
  { text: 'Created' },
  { text: 'Category' },
  { text: 'Content' },
  { text: 'Dates' },
];

const ListNotes = () => {
  const classes = useStyles();

  const [noteDialog, setNoteDialog] = useState<NoteDialogState>({ open: false });

  const dispatch = useDispatch();

  const notes = useSelector(listNotesSelector);
  const modeArchived = useSelector(modeArchivedSelector);

  const handleOpen = useCallback(() => {
    setNoteDialog({ open: true });
  }, []);

  const handleClose = useCallback(() => {
    setNoteDialog({ open: false });
  }, []);

  const handleModeArchived = useCallback(() => {
    dispatch(setModeActived(!modeArchived));
  }, [modeArchived]);

  const handleHeadDelete = useCallback(() => {
    console.log('Opps!');
  }, []);

  return (
    <NoteDialogProvider value={setNoteDialog}>
      <NoteDialog onClose={handleClose} {...noteDialog} />
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              {headCells.map(({ text, align }) => (
                <TableCell key={text} align={align}>
                  {text}
                </TableCell>
              ))}
              <TableCell>
                <IconButton iconClassName={classes.headIcon} onClick={handleModeArchived}>
                  {getIconArchived(modeArchived)}
                </IconButton>
                <IconButton iconClassName={classes.headIcon} onClick={handleHeadDelete}>
                  delete
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <ListItemNotes key={note.id} {...note} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={handleOpen} className={classes.createNoteButton}>
        Create Note
      </Button>
    </NoteDialogProvider>
  );
};

export default memo(ListNotes);
