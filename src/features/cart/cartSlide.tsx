import { createSlice } from "@reduxjs/toolkit";

export interface cartState {
    error: String;
    loading: boolean;
    carts: any;
  }
  const initialState: cartState = {
    error: "",
    loading: false,
    carts: [],
  
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const cart = action.payload;
            const checkCart = state.carts.find((item: any) => item.book.id === cart.book.id);
            if(checkCart) {
                checkCart.quantity += cart.quantity;
            }else{
                state.carts.push(cart)
            }
        },
        increaseCart(state, action) {
            state.carts.find((cart: any) => cart.book.id === action.payload).quantity++;
        },
        decreaseCart(state, action) {
            const items = state.carts.find((cart: any) => cart.book.id === action.payload)
            items.quantity--;
            if (items.quantity < 1) {
                state.carts.filter((cart: any) => cart.book.id !== items.book.id)
            }
        },
       
        removeCart(state, action) {
            const id = action.payload
            state.carts = state.carts.filter((cart: any) => cart.book.id !== id)
        },
        
    },
   
});

export const { addToCart, removeCart,increaseCart,decreaseCart } = cartSlice.actions;
export default cartSlice.reducer