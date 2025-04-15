import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

export const fetchBooks = createAsyncThunk(
    // type action
    "books/fetchBook",
    async () => {
        const { data } = await axios.get(
            "https://5e79b4b817314d00161333da.mockapi.io/product"
        );
        return data;
    }
);

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
    extraReducers: (builder) => {
        // trường hợp 1: gọi đến action fetchProduct và thành công
        builder.addCase(fetchBooks.fulfilled, (state, action) => {
            console.log("fullfilled action", action.payload);
            state.books = action.payload;
            state.loading = false;
        });

        builder.addCase(fetchBooks.rejected, (state, action) => {
            state.error = "Không thể truy xuất dữ liệu";
        });

        // trường hợp 2: Trang thai call api chua thanh cong
        builder.addCase(fetchBooks.pending, (state) => {
            state.loading = true;
        });
        // fullfillmed, rejected, pending
    }
})



// Action creators are generated for each case reducer function

export default bookSlice