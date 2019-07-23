import React, { useReducer } from 'react';
import { Context, initialState } from './store';
import { cableReducer } from './modules/cable/cable-reducer';
import Dashboard from './pages/Dashboard';
const App = () => {
  const [store, dispatch] = useReducer(cableReducer, initialState);
  console.log('store', store);
  return (
    <Context.Provider value={{ store, dispatch }}>
      <Dashboard />
    </Context.Provider>
  );
};

export default App;
