import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import AppsIcon from '@material-ui/icons/Apps';

import useStyles from '../../hooks/useStyle';
import styles from './styles';

export default ({ name, pids }) => {
  const classes = useStyles(styles);
  return (
    <>
      <Typography variant='h5' align='center'>
        {name}
        <Chip
          variant='outlined'
          icon={<AppsIcon />}
          size='small'
          label={`${pids} procesos`}
          color='primary'
          classes={{ colorPrimary: classes.pidChip }}
        />
      </Typography>
    </>
  );
};
