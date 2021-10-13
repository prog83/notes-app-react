import React, { memo, useCallback } from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { useDispatch } from 'react-redux';
import { Form as RFF, Field } from 'react-final-form';
import { v4 as uuidv4 } from 'uuid';

import { searchDatesFromText } from '@/helpers';
import { createNote, updateNote } from '@/store/actions';
import { Note } from '@/store/types';

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const subscribe = {};
const categories = ['Task', 'Random Thought', 'Idea', 'Quote'];

interface FormValues extends Partial<Note> {
  name: string;
  category: string;
}

interface Props {
  onClose: () => void;
  initialValues?: Note;
}

const Form = ({ onClose, initialValues }: Props) => {
  const dispatch = useDispatch();

  const onSubmit = useCallback((values: FormValues) => {
    const dates = searchDatesFromText(values.content);

    if (values.id) {
      dispatch(updateNote({ ...(values as Note), dates }));
    } else {
      dispatch(createNote({ ...values, id: uuidv4(), created: new Date(), dates }));
    }
    onClose();
  }, []);

  return (
    <RFF
      subscribe={subscribe}
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Field name="name">
              {({ input }) => <TextField required {...input} label="Name" margin="normal" fullWidth />}
            </Field>
            <Field name="category">
              {({ input }) => (
                <TextField required select {...input} label="Category" margin="normal" fullWidth>
                  {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Field>
            <Field name="content">
              {({ input }) => <TextField {...input} label="Content" multiline rows={3} margin="normal" fullWidth />}
            </Field>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onClose} color="primary">
              Close
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      )}
    />
  );
};

export default memo(Form);
