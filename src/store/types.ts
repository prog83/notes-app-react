import * as constants from './constants';

export interface Note {
  id: string;
  name: string;
  created: Date;
  // TODO
  category: string;
  content?: string;
  dates?: Array<Date> | null;
  archived?: boolean;
}

export interface App {
  notes: Array<Note>;
  modeArchived: boolean;
}

// Actions
interface InitNotesAction {
  type: typeof constants.NOTES_INIT;
  payload: Array<Note>;
}

interface ModeActivedAction {
  type: typeof constants.MODE_ARCHIVED;
  payload: boolean;
}

interface CreateNoteAction {
  type: typeof constants.NOTE_CREATE;
  payload: Note;
}

interface UpdateNoteAction {
  type: typeof constants.NOTE_UPDATE;
  payload: Note;
}

interface DeleteNoteAction {
  type: typeof constants.NOTE_DELETE;
  payload: string;
}

interface ArchiveNoteAction {
  type: typeof constants.NOTE_ARCHIVE;
  payload: string;
}

interface UnarchiveNoteAction {
  type: typeof constants.NOTE_UNARCHIVE;
  payload: string;
}

export type RootActions =
  | InitNotesAction
  | ModeActivedAction
  | CreateNoteAction
  | UpdateNoteAction
  | DeleteNoteAction
  | ArchiveNoteAction
  | UnarchiveNoteAction;
