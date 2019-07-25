import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { StoreContext } from '../../store';
import StatusBadge from './StatusBadge';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default () => {
  const classes = useStyles();
  const [store] = useContext(StoreContext);

  return (
    <AppBar position='static' style={{ margin: 0 }}>
      <Container>
        <Toolbar>
          <Avatar src='data:image/png;base64,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' />
          <Typography variant='h6' className={classes.title}>
            Docker Dashboard
          </Typography>
          <StatusBadge status={store.cable.connection}>
            <Button color='inherit'>
              <Typography>
                {store.cable.connection === 'connected'
                  ? 'conectado'
                  : 'desconectado'}
              </Typography>
            </Button>
          </StatusBadge>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
