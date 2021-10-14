import React, { memo, useState, useCallback, useMemo } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import IconButton from '@/components/IconButton';
import DataGrid, { Column } from '@/components/Table/DataGrid';

import { listNotesSelector, modeArchivedSelector } from '@/store/selectors';
import { setModeActived, archiveNote, unarchiveNote, deleteNote } from '@/store/actions';
import { Note } from '@/store/types';

import { getIconArchived, getCategoryAvatar } from '@/helpers';

import NoteDialog from './NoteDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 750,
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

const headColumns: Array<Column> = [
  { field: 'avatar' },
  { field: 'name', label: 'Name' },
  { field: 'created', label: 'Created' },
  { field: 'category', label: 'Category' },
  { field: 'content', label: 'Content' },
  { field: 'dates', label: 'Dates' },
];

const ListNotes = () => {
  const classes = useStyles();

  const [noteDialog, setNoteDialog] = useState<{
    open: boolean;
    value?: Note;
  }>({ open: false });

  const dispatch = useDispatch();

  const listNotes = useSelector(listNotesSelector);
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

  const handleEdit = (note: Note) => () => {
    setNoteDialog({ open: true, value: note });
  };

  const handleArchive = (id: string, archived: boolean) => () => {
    if (!archived) {
      dispatch(archiveNote(id));
    }
    if (archived) {
      dispatch(unarchiveNote(id));
    }
  };

  const handleDelete = (id: string) => () => {
    dispatch(deleteNote(id));
  };

  const columns = useMemo(
    () => [
      ...headColumns,
      {
        field: 'actions',
        label: (
          <>
            <IconButton iconClassName={classes.headIcon} onClick={handleModeArchived}>
              {getIconArchived(modeArchived)}
            </IconButton>
            <IconButton iconClassName={classes.headIcon} onClick={handleHeadDelete}>
              delete
            </IconButton>
          </>
        ),
      },
    ],
    [modeArchived],
  );

  const rows = useMemo(
    () =>
      listNotes.map((note) => {
        const { id, name, created, category, content, dates, archived = false } = note;
        const createdText = format(created, 'MMMM dd, yyyy');
        const datesText = dates?.map((date) => format(date, 'M/d/yyyy')).join(', ');

        return {
          id,
          avatar: getCategoryAvatar(category),
          name,
          created: createdText,
          category,
          content,
          dates: datesText,
          archived,
          actions: (
            <>
              <IconButton onClick={handleEdit(note)}>edit</IconButton>
              <IconButton onClick={handleArchive(id, archived)}>{getIconArchived(archived)}</IconButton>
              <IconButton onClick={handleDelete(id)}>delete</IconButton>
            </>
          ),
        };
      }),
    [listNotes],
  );

  return (
    <>
      <NoteDialog onClose={handleClose} {...noteDialog} />

      <DataGrid columns={columns} rows={rows} className={classes.table} />

      <Button variant="contained" color="primary" onClick={handleOpen} className={classes.createNoteButton}>
        Create Note
      </Button>
    </>
  );
};

export default memo(ListNotes);
