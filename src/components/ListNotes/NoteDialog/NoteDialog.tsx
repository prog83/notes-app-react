import React, { memo, useCallback } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { Note } from '@/store/types';

import Form from './Form';

const stylesDialogTitle = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof stylesDialogTitle> {
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(stylesDialogTitle)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

interface Props {
  onClose: () => void;
  open: boolean;
  value?: Note;
}

const NoteDialog = ({ open, value, onClose }: Props) => (
  <Dialog disableEscapeKeyDown maxWidth="sm" fullWidth open={open} aria-labelledby="dialog-note">
    <DialogTitle onClose={onClose}>Note</DialogTitle>
    <Form onClose={onClose} initialValues={value} />
  </Dialog>
);

export default memo(NoteDialog);
