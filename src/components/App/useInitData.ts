import { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { initNotes } from '@/store/actions';
import initDataSchema from '@/helpers/schema';
import db from '@/db.json';

import { Note } from '@/store/types';

const useInitData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const data: Array<Note> = initDataSchema.cast(db) as any;
      dispatch(initNotes(data));
    } catch (error) {}
  }, []);
};

export default useInitData;
