import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import MemoryIcon from '@material-ui/icons/Memory';
import useStyles from '../../hooks/useStyle';
import styles from './styles';

export default ({ memory_usage, memory_limit }) => {
  const classes = useStyles(styles);
  return (
    <div align='center'>
      <Chip
        variant='outlined'
        icon={<MemoryIcon />}
        label={`Mem usada / Mem max`}
        color='secondary'
        classes={{ colorSecondary: classes.attributeTitle }}
      />

      <Typography align='center' variant='subtitle1'>
        {memory_usage} / {memory_limit}
      </Typography>
    </div>
  );
};
