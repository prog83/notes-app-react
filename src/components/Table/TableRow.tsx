import { memo } from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import MuiTableRow from '@material-ui/core/TableRow';

const TableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.grey[300],
      },
    },
  }),
)(MuiTableRow);

export default memo(TableRow);
