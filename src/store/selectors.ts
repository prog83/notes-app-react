import { createSelector } from 'reselect';

import type { State } from '@/store/store';
import { getSortedSummaryNotes } from '@/helpers';

export const notesSelector = ({ notes }: State) => notes;

export const modeArchivedSelector = ({ modeArchived }: State) => modeArchived;

export const listNotesSelector = createSelector(notesSelector, modeArchivedSelector, (notes, modeArchived) =>
  notes.filter(({ archived = false }) => archived === modeArchived),
);

export const summaryNotesSelector = createSelector(notesSelector, (notes) => getSortedSummaryNotes(notes, 'category'));
