const CONNECT_CABLE_BEGIN = 'CONNECT_CABLE_BEGIN';
const CONNECT_CABLE_SUCCESS = 'CONNECT_CABLE_SUCCESS';
const CONNECT_CABLE_FAILURE = 'CONNECT_CABLE_FAILURE';

export const connectCableBegin = () => ({ type: CONNECT_CABLE_BEGIN });
export const connectCableSuccess = () => ({
  type: CONNECT_CABLE_SUCCESS,
  payload: { connection: 'connected' }
});
export const connectCableFailure = error => ({
  type: CONNECT_CABLE_FAILURE,
  payload: { connection: { error, status: 'disconnected' } }
});

export const cableReducer = (
  state = { connection: 'disconnected' },
  { type, payload }
) => {
  console.log('state in cableReducer', state, 'action', type);
  switch (type) {
    case CONNECT_CABLE_BEGIN:
      return state;
    case CONNECT_CABLE_SUCCESS:
      return { ...state, ...payload };
    case CONNECT_CABLE_FAILURE:
      return { ...state, ...payload };
    default:
      return state;
  }
};
