import { useEffect, useContext } from 'react';
import { StoreContext } from '../store';
import ActionCable from 'actioncable';
import {
  connectCableBegin,
  connectCableSuccess,
  connectCableFailure
} from '../reducers/cableReducer';
import { addContainers } from '../reducers/containerReducer';
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export default () => {
  const [store, dispatch] = useContext(StoreContext);

  useEffect(() => {
    if (store.cable.connection === 'disconnected' && store.container.fetched) {
      dispatch(connectCableBegin());
      const cable = ActionCable.createConsumer(`ws://${WEBSOCKET_URL}`);
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
                dispatch(addContainers(data.containers, data.timestamp));
              }
            }
          }
        );
      }
    }
  }, [store, dispatch]);
};
