import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  user: any
}

const initialState: AuthState = {
  user: {},
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    register: (state, action) => {
      state.user = action.payload
    },
    logout: (state, action) => {
      state.user = {}
    },
    updateAvatar: (state, action) => {
      state.user.avatar = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { login, register, logout, updateAvatar } = authSlice.actions

export default authSlice.reducer