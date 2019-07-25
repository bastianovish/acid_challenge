import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import StorageIcon from '@material-ui/icons/Storage';
import useStyles from '../../hooks/useStyle';
import styles from './styles';

export default ({ block_read, block_write }) => {
  const classes = useStyles(styles);
  return (
    <div align='center'>
      <Chip
        variant='outlined'
        icon={<StorageIcon />}
        label={`I/O Disco`}
        color='secondary'
        classes={{ colorSecondary: classes.attributeTitle }}
      />

      <Typography align='center' variant='subtitle1'>
        {block_read} / {block_write}
      </Typography>
    </div>
  );
};
