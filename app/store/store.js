import { configureStore, combineReducers } from '@reduxjs/toolkit';

import coreReducer from '../slices/coreSlice.js';
//import projectSLice from '../slices/coreSlice.js';
//import userSlice from   '../slices/coreSlice.js';

const combinedReducer = combineReducers({
  core: coreReducer,
});

const rootReducer = (state, action) => {
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

