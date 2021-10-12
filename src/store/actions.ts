import * as constants from './constants';
import { Note, RootActions } from './types';

export const initNotes = (value: Array<Note>): RootActions => ({
  type: constants.NOTES_INIT,
  payload: value,
});

export const setModeActived = (value: boolean): RootActions => ({
  type: constants.MODE_ARCHIVED,
  payload: value,
});

export const createNote = (value: Note): RootActions => ({
  type: constants.NOTE_CREATE,
  payload: value,
});

export const updateNote = (value: Note): RootActions => ({
  type: constants.NOTE_UPDATE,
  payload: value,
});

export const deleteNote = (value: string): RootActions => ({
  type: constants.NOTE_DELETE,
  payload: value,
});

export const archiveNote = (value: string): RootActions => ({
  type: constants.NOTE_ARCHIVE,
  payload: value,
});

export const unarchiveNote = (value: string): RootActions => ({
  type: constants.NOTE_UNARCHIVE,
  payload: value,
});
