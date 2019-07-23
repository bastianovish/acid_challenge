export const CONNECT_CABLE_BEGIN = 'CONNECT_CABLE_BEGIN';
export const CONNECT_CABLE_SUCCESS = 'CONNECT_CABLE_SUCCESS';
export const CONNECT_CABLE_FAILURE = 'CONNECT_CABLE_FAILURE';
export const RECEIVE_CABLE_DATA = 'RECEIVE_CABLE_DATA';

export const connectCableBegin = () => ({ type: CONNECT_CABLE_BEGIN });
export const connectCableSuccess = cable => ({
  type: CONNECT_CABLE_SUCCESS,
  payload: { connection: { cable, status: 'connected' } }
});
export const connectCableFailure = error => ({
  type: CONNECT_CABLE_FAILURE,
  payload: { connection: { error, status: 'disconnected' } }
});

export const receiveCableData = containers => ({
  type: RECEIVE_CABLE_DATA,
  payload: { containers }
});

export const cableReducer = (state, { type, payload }) => {
  console.log('state in reducer', state, 'action', type);
  switch (type) {
    case CONNECT_CABLE_BEGIN:
      console.log('returning new state');
      return state;
    case CONNECT_CABLE_SUCCESS:
      console.log('success', payload);
      return { ...state, ...payload };
    case CONNECT_CABLE_FAILURE:
      console.log('error', payload);
      return { ...state, ...payload };
    case RECEIVE_CABLE_DATA:
      console.log('receiving', payload);
      return { ...state, ...payload };
    default:
      console.log('returning default');
      return state;
  }
};
