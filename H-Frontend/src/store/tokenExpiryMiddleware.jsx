import { jwtDecode } from "jwt-decode";

import { logout } from './authSlice';

let timerInitialized = false;

const tokenExpiryMiddleware = store => next => action => {
  if (!timerInitialized) {
    timerInitialized = true;
    setInterval(() => {
      const token = store.getState().auth.token;
      if (token) {
        try {
          const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            store.dispatch(logout());
          }
        } catch (err) {
          console.error("Error decoding token:", err);
          store.dispatch(logout());
        }
      }
    }, 60000); // Check every minute
  }
  return next(action);
};

export default tokenExpiryMiddleware;
