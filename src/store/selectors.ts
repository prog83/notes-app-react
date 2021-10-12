import { State } from '@/store/store';

export const notesSelector = ({ notes }: State) => notes;

export const modeArchivedSelector = ({ modeArchived }: State) => modeArchived;
