import React, { createContext, useContext } from 'react';

import { Note } from '@/store/types';

export interface NoteDialog {
  open: boolean;
  value?: Note;
}

type NoteDialogContext = (dialog: NoteDialog) => void;

const Context = createContext<(dialog: NoteDialog) => void>(null!);

export const useNoteDialog = () => useContext(Context);

export const NoteDialogProvider = ({ value, children }: React.PropsWithChildren<{ value: NoteDialogContext }>) => (
  <Context.Provider value={value}>{children}</Context.Provider>
);
