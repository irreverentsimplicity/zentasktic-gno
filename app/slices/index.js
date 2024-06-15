// store/reducers/index.js
import { combineReducers } from 'redux';
import coreReducer from './coreSlice';
import projectReducer from './projectSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  core: coreReducer,
  project: projectReducer,
  user: userReducer,
});

export default rootReducer;

