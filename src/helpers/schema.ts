import { object, array, string, boolean, date } from 'yup';

const note = object().shape({
  id: string().required(),
  archived: boolean(),
  name: string().required(),
  created: date().required(),
  category: string().required(),
  content: string(),
  dates: array().ensure().of(date()),
});

const notes = array().ensure().of(note);

export default notes;
