import { App, RootActions, Note } from './types';
import * as constants from './constants';

import { getNoteById } from '../helpers';

export const initialState: App = {
  notes: [],
  modeArchived: false,
};

const insert = (notes: Array<Note>, value: Note) => {
  const newNotes = [...notes];
  newNotes.push(value);
  return newNotes;
};

const update = (notes: Array<Note>, value: Note) =>
  notes.map((note) => {
    if (note.id !== value.id) {
      return note;
    }

    return {
      ...note,
      ...value,
    };
  });

const remove = (notes: Array<Note>, value: string) => notes.filter(({ id }) => id !== value);

export default function reducer(state = initialState, action: RootActions) {
  switch (action.type) {
    case constants.NOTES_INIT:
      return { ...state, notes: action.payload };

    case constants.MODE_ARCHIVED:
      return { ...state, modeArchived: action.payload };

    case constants.NOTE_CREATE:
      return {
        ...state,
        notes: insert(state.notes, action.payload),
      };

    case constants.NOTE_UPDATE:
      return {
        ...state,
        notes: update(state.notes, action.payload),
      };

    case constants.NOTE_DELETE:
      return {
        ...state,
        notes: remove(state.notes, action.payload),
      };

    case constants.NOTE_ARCHIVE: {
      const note = getNoteById(state.notes, action.payload);

      return {
        ...state,
        notes: update(state.notes, { ...note, archived: true }),
      };
    }

    case constants.NOTE_UNARCHIVE: {
      const note = getNoteById(state.notes, action.payload);

      return {
        ...state,
        notes: update(state.notes, { ...note, archived: false }),
      };
    }

    default:
      return state;
  }
}
