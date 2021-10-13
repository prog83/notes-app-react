import React, { memo, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { format } from 'date-fns';

import TableRow from '@/components/Table/TableRow';
import TableCell from '@/components/Table/TableCell';
import IconButton from '@/components/IconButton';

import { getCategoryAvatar, getIconArchived } from '@/helpers';

import { archiveNote, unarchiveNote, deleteNote } from '@/store/actions';
import { Note } from '@/store/types';

import { useNoteDialog } from './NoteDialog';

interface Props extends Note {}

const ListItemNotes = (props: Props) => {
  const { id, name, created, category, content, dates, archived = false } = props;
  const dispatch = useDispatch();

  const noteDialog = useNoteDialog();

  const createdText = format(created, 'MMMM dd, yyyy');
  const datesText = dates?.map((date) => format(date, 'M/d/yyyy')).join(', ');

  const handleEdit = useCallback(() => {
    noteDialog({ open: true, value: props });
  }, [props]);

  const handleArchive = useCallback(() => {
    if (!archived) {
      dispatch(archiveNote(id));
    }
    if (archived) {
      dispatch(unarchiveNote(id));
    }
  }, [id, archived]);

  const handleDelete = useCallback(() => {
    dispatch(deleteNote(id));
  }, [id]);

  return (
    <TableRow hover>
      <TableCell>{getCategoryAvatar(category)}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{createdText}</TableCell>
      <TableCell>{category}</TableCell>
      <TableCell>{content}</TableCell>
      <TableCell>{datesText}</TableCell>
      <TableCell>
        <IconButton onClick={handleEdit}>edit</IconButton>
        <IconButton onClick={handleArchive}>{getIconArchived(archived)}</IconButton>
        <IconButton onClick={handleDelete}>delete</IconButton>
      </TableCell>
    </TableRow>
  );
};

export default memo(ListItemNotes);
