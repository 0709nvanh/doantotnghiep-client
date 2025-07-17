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
    logout: (state) => {
      state.user = {}
    },
    updateAvatar: (state, action) => {
      state.user.avatar = action.payload
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    }
  },
})

export const { login, register, logout, updateAvatar, updateUser } = authSlice.actions
export default authSlice.reducer