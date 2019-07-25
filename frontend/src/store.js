import React, { useReducer } from 'react';

export const initialState = {
  cable: {
    connection: 'disconnected'
  },
  container: {
    items: [],
    currentFilter: 'name'
  }
};

export const StoreContext = React.createContext();

export default props => {
  const initialState = props.rootReducer(props.initialValue, {
    type: '__INIT__'
  });
  console.log('init st', initialState);
  const [state, dispatch] = useReducer(props.rootReducer, initialState);
  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {props.children}
    </StoreContext.Provider>
  );
};
