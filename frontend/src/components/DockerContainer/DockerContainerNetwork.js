import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import useStyles from '../../hooks/useStyle';
import styles from './styles';

export default ({ network_i, network_o }) => {
  const classes = useStyles(styles);
  return (
    <div align='center'>
      <Chip
        variant='outlined'
        icon={<DeviceHubIcon />}
        label={`I/O Red`}
        color='secondary'
        classes={{ colorSecondary: classes.attributeTitle }}
      />

      <Typography align='center' variant='subtitle1'>
        {network_i} / {network_o}
      </Typography>
    </div>
  );
};
