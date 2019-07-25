import React from 'react';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  connected: {
    backgroundColor: '#5aff24'
  },
  disconnected: {
    backgroundColor: 'red'
  }
}));

export default ({ status, children }) => {
  const styles = useStyles();
  return (
    <Badge
      classes={{ badge: styles[status] }}
      badgeContent={`procesos`}
      color='secondary'
      variant='dot'
    >
      {children}
    </Badge>
  );
};
