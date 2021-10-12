import React, { memo } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
    },
  }),
);

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const classes = useStyles();

  if (!children) {
    return null;
  }
  return (
    <Container maxWidth="lg" disableGutters component="main" className={classes.root}>
      {children}
    </Container>
  );
};

export default memo(Layout);
