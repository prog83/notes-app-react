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

type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export const groupBy = <T extends {}, Key extends KeysMatching<T, string>>(array: Array<T>, key: Key) =>
  array.reduce<Record<Key, Array<T>>>((acc, item) => {
    const rslt = { ...acc };
    (rslt[item[key]] = rslt[item[key]] ?? []).push(item);
    return rslt;
  }, {} as Record<Key, Array<T>>);

export const getSortedSummaryNotes = (notes: Array<Note>, field: Extract<keyof Note, 'category'>) => {
  const summary = groupBy(notes, field);
  return Object.entries(summary).sort((a, b) => {
    const countA = a[1].length;
    const countB = b[1].length;
    return countB - countA;
  });
};

export const searchDatesFromText = (text?: string) => {
  if (!text) {
    return [];
  }

  const rslt: Array<string> = [];
  const re = /(?:\d{1,2}\/\d{1,2}\/\d{4})|(?:\d{1,2}\-\d{1,2}\-\d{4})|(?:\d{1,2}\.\d{1,2}\.\d{4})/g;
  let date = null;
  while ((date = re.exec(text)) !== null) {
    rslt.push(date[0]);
  }

  return rslt.map((dt) => (Date.parse(dt) ? new Date(dt) : null)).filter((i) => Boolean(i)) as Array<Date>;
};
