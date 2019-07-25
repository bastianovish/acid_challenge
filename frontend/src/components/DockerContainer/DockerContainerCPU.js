import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import useStyles from '../../hooks/useStyle';
import styles from './styles';

export default ({ cpu_usage }) => {
  const classes = useStyles(styles);
  return (
    <div align='center'>
      <Chip
        variant='outlined'
        icon={<DeveloperBoardIcon />}
        label={`Uso de CPU`}
        color='secondary'
        classes={{ colorSecondary: classes.attributeTitle }}
      />
      <Typography align='center' variant='subtitle1'>
        {cpu_usage}
      </Typography>
    </div>
  );
};
