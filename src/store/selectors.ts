import { createSelector } from 'reselect';

import { getCategoryAvatar, groupBy } from '@/helpers';
import type { State } from '@/store/store';
import type { Note } from '@/store/types';

const getListNotes = (notes: Array<Note>, modeArchived: boolean = false) =>
  notes.filter(({ archived = false }) => archived === modeArchived);

const getSummaryNotes = (notes: Array<Note>) => {
  const summary = groupBy(notes, 'category');

  return Object.entries(summary)
    .sort((a, b) => {
      const countA = a[1].length;
      const countB = b[1].length;
      return countB - countA;
    })
    .map(([category, array]) => {
      const active = array.filter(({ archived }) => !archived).length;
      const archived = array.length - active;

      return { id: category, avatar: getCategoryAvatar(category), category, active, archived };
    });
};

export const notesSelector = ({ notes }: State) => notes;

export const modeArchivedSelector = ({ modeArchived }: State) => modeArchived;

export const listNotesSelector = createSelector(notesSelector, modeArchivedSelector, getListNotes);

export const summaryNotesSelector = createSelector(notesSelector, getSummaryNotes);
