import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthorState {
  value: number
}

const initialState: AuthorState = {
  value: 0,
}

export const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = authorSlice.actions

export default authorSlice.reducer