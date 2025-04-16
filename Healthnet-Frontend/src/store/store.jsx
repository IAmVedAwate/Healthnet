// store/store.js
import { configureStore,combineReducers  } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import tokenExpiryMiddleware from './tokenExpiryMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']  // only persist the auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  // add other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);



export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(tokenExpiryMiddleware),
});
export const persistor = persistStore(store);