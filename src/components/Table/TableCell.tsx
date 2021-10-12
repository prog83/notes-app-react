import { memo } from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import MuiTableCell from '@material-ui/core/TableCell';

const TableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.grey[600],
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(MuiTableCell);

export default memo(TableCell);
