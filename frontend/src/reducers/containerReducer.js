const ADD_CONTAINERS = 'ADD_CONTAINERS';
const SET_FILTER = 'SET_FILTER';

export const addContainers = (containers, lastUpdate = 0) => ({
  type: ADD_CONTAINERS,
  payload: { items: containers, fetched: true, lastUpdate }
});

export const setFilter = filter => ({
  type: SET_FILTER,
  payload: { currentFilter: filter }
});

export const containerReducer = (
  state = { items: [], currentFilter: 'name', fetched: false, lastUpdate: 0 },
  { type, payload }
) => {
  console.log('state in containerReducer', state, 'action', type);
  switch (type) {
    case ADD_CONTAINERS:
      return { ...state, ...payload };
    case SET_FILTER:
      return { ...state, ...payload };
    default:
      return state;
  }
};
