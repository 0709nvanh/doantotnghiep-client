import { createSlice } from '@reduxjs/toolkit'

export interface BookState {
    error: String,
    loading: boolean,
    books: any,
}

const initialState: BookState = {
    error: "",
    loading: false,
    books: []
}

export const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {

    },
})



// Action creators are generated for each case reducer function

export default bookSlice