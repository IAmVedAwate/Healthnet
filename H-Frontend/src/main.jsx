import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store , persistor } from "./store/store"; // Adjust path if needed
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <ToastContainer />
      <App />
    </Provider>
    </PersistGate>
  </StrictMode>,
)
