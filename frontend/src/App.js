import React from 'react';
import Store from './store';
import AppBar from './components/AppBar';
import Dashboard from './pages/Dashboard';
import rootReducer from './reducers/rootReducer';

const App = () => {
  return (
    <Store rootReducer={rootReducer}>
      <AppBar />
      <Dashboard />
    </Store>
  );
};

export default App;
