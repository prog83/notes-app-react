import React, { memo, useCallback } from 'react';

import { format } from 'date-fns';

import TableRow from '@/components/Table/TableRow';
import TableCell from '@/components/Table/TableCell';
import IconButton from '@/components/IconButton';

import { getCategoryAvatar, getIconArchived } from '@/helpers';

import { Note } from '@/store/types';

interface Props extends Note {
  onArchive: (id: string, archived: boolean) => void;
  onDelete: (id: string) => void;
}

const ListItemNotes = ({
  id,
  name,
  created,
  category,
  content,
  dates,
  archived = false,
  onArchive,
  onDelete,
}: Props) => {
  const createdText = format(created, 'MMMM dd, yyyy');
  const datesText = dates?.map((date) => format(date, 'M/d/yyyy')).join(', ');

  const handleArchive = useCallback(() => {
    onArchive(id, !archived);
  }, [id, archived]);

  const handleDelete = useCallback(() => {
    onDelete(id);
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
        <IconButton>edit</IconButton>
        <IconButton onClick={handleArchive}>{getIconArchived(archived)}</IconButton>
        <IconButton onClick={handleDelete}>delete</IconButton>
      </TableCell>
    </TableRow>
  );
};

export default memo(ListItemNotes);
