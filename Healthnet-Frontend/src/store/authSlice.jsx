// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  role: null,
  id:null,
  isAuthenticated: false,

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role,id } = action.payload;
      state.token = token;
      state.role = role;
      state.id = id;
      state.isAuthenticated = true;
      
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.id = null;
      state.isAuthenticated = false;
      localStorage.setItem("token", null)
      
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
