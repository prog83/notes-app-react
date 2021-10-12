import React from 'react';
import { Theme, createStyles, withStyles } from '@material-ui/core/styles';
import MuiAvatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

const Avatar = withStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.grey[800],
    },
  }),
)(MuiAvatar);

import { Note } from '@/store/types';

export const getNoteById = (notes: Array<Note>, id: string) => {
  const [rslt] = notes.filter((note) => note.id === id);
  return rslt;
};

export const getCategoryAvatar = (value: string) => {
  switch (value) {
    case 'Task':
      return (
        <Avatar>
          <Icon>shopping_cart</Icon>
        </Avatar>
      );

    case 'Random Thought':
      return (
        <Avatar>
          <Icon>psychology</Icon>
        </Avatar>
      );

    case 'Idea':
      return (
        <Avatar>
          <Icon>lightbulb</Icon>
        </Avatar>
      );

    case 'Quote':
      return (
        <Avatar>
          <Icon>format_quote</Icon>
        </Avatar>
      );

    default:
      return null;
  }
};

export const getIconArchived = (archived: boolean = false) => (archived ? 'unarchive' : 'archive');

// TODO: typed correct with guard
export const groupBy = (array: Array<Record<string, any>>, key: string) =>
  array.reduce((acc: Record<string, Array<any>>, item) => {
    const rslt = { ...acc };
    (rslt[item[key]] = rslt[item[key]] ?? []).push(item);
    return rslt;
  }, {});

export const searchDatesFromText = (text: string) => {
  const rslt = [];
  const re = /(?:\d{1,2}\/\d{1,2}\/\d{4})|(?:\d{1,2}\-\d{1,2}\-\d{4})|(?:\d{1,2}\.\d{1,2}\.\d{4})/g;

  let date = null;
  while ((date = re.exec(text)) !== null) {
    rslt.push(date[0]);
    // TODO delete
    // re.lastIndex;
  }

  return rslt.map((dt) => (Date.parse(dt) ? new Date(dt) : null)).filter((i) => i);
};
