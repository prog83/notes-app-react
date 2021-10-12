import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Layout from '@/components/Layout';
import ListNotes from '@/components/ListNotes';
import SummaryNotes from '@/components/SummaryNotes';

import useInitData from './useInitData';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    summaryNotes: {
      marginTop: theme.spacing(2),
    },
  }),
);

const App = () => {
  const classes = useStyles();

  useInitData();

  return (
    <Layout>
      <ListNotes />
      <SummaryNotes className={classes.summaryNotes} />
    </Layout>
  );
};

export default App;
