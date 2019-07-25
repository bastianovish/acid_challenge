import { cableReducer } from './cableReducer';
import { containerReducer } from './containerReducer';
import { combineReducers } from 'redux';

export default combineReducers({
  cable: cableReducer,
  container: containerReducer
});
