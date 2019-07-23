export const FETCH_API_BEGIN = 'FETCH_API_BEGIN';
export const FETCH_API_SUCCESS = 'FETCH_API_SUCCESS';
export const FETCH_API_FAILURE = 'FETCH_API_FAILURE';

export const fetchApiBegin = () => ({ type: FETCH_API_BEGIN });
export const fetchApiSuccess = containers => ({
  type: FETCH_API_SUCCESS,
  payload: { containers }
});
export const fetchApiFailure = error => ({
  type: FETCH_API_FAILURE,
  payload: { error }
});

export const apiReducer = (state, { type, payload }) => {
  console.log('state in reducer', state, 'action', type);
  switch (type) {
    case FETCH_API_BEGIN:
      console.log('returning new state');
      return state;
    case FETCH_API_SUCCESS:
      console.log('success', payload);
      return { ...state, ...payload };
    case FETCH_API_FAILURE:
      console.log('error', payload);
      return { ...state, ...payload };
    default:
      console.log('returning default');
      return state;
  }
};
