import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
    <App />
        </BrowserRouter>
        </Provider>
      </PersistGate>
    </StrictMode>,
)
