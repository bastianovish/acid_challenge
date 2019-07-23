import React, { useContext, useEffect } from 'react';
import ContainerList from '../components/ContainerList';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Context } from '../store';
import 'typeface-roboto';
import ActionCable from 'actioncable';
import {
  connectCableBegin,
  connectCableSuccess,
  connectCableFailure,
  receiveCableData
} from '../modules/cable/cable-reducer';

const Dashboard = () => {
  const { store, dispatch } = useContext(Context);
  console.log('store', store);
  console.log('dispatch', dispatch);

  useEffect(() => {
    if (store.connection.status === 'disconnected') {
      dispatch(connectCableBegin());
      const cable = ActionCable.createConsumer('ws://localhost:3000/websocket');
      console.log('cable', cable.connection);
      if (cable.connection.disconnected) {
        cable.subscriptions.create(
          { channel: 'DashboardChannel' },
          {
            connected: data => {
              dispatch(connectCableSuccess(cable));
            },
            disconnected: data => {
              console.log('disconnected', data);
              dispatch(connectCableFailure(cable));
            },
            rejected: data => {
              console.log('rejected', data);
            },
            received: data => {
              console.log('data received', data);
              if (data.status === 'success') {
                dispatch(receiveCableData(data.containers));
              }
            }
          }
        );
      }
    }
  });

  return (
    <Container>
      <Typography component='h2' variant='h2'>
        Docker Monitor{' '}
        <Typography variant='button'>
          {store.connection.status === 'connected'
            ? 'conectado'
            : 'desconectado'}
        </Typography>
      </Typography>
      <ContainerList />
    </Container>
  );
};

export default Dashboard;
