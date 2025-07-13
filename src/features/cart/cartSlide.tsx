import { createSlice } from "@reduxjs/toolkit";

export interface cartState {
    error: String;
    loading: boolean;
    carts: any[];
    userCarts: { [userId: string]: any[] };
  }

const initialState: cartState = {
    error: "",
    loading: false,
    carts: [],
    userCarts: {},
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const { cart, userId } = action.payload;
            if (!userId) return;
            
            // Initialize userCarts if it doesn't exist
            if (!state.userCarts) {
                state.userCarts = {};
            }
            
            // Initialize user's cart array if it doesn't exist
            if (!state.userCarts[userId]) {
                state.userCarts[userId] = [];
            }
            
            // Check if book already exists in cart
            const existingCartIndex = state.userCarts[userId].findIndex(
                (item) => item.book.id === cart.book.id
            );
            
            if (existingCartIndex !== -1) {
                // Update quantity if book exists
                state.userCarts[userId][existingCartIndex].quantity += cart.quantity;
            } else {
                // Add new book to cart
                state.userCarts[userId].push(cart);
            }
            
            // Update current carts for the logged-in user
            state.carts = [...state.userCarts[userId]];
        },
        increaseCart(state, action) {
            const { bookId, userId } = action.payload;
            if (!userId || !state.userCarts || !state.userCarts[userId]) return;
            
            const cartIndex = state.userCarts[userId].findIndex(
                (cart) => cart.book.id === bookId
            );
            
            if (cartIndex !== -1) {
                state.userCarts[userId][cartIndex].quantity++;
                state.carts = [...state.userCarts[userId]];
            }
        },
        decreaseCart(state, action) {
            const { bookId, userId } = action.payload;
            if (!userId || !state.userCarts || !state.userCarts[userId]) return;
            
            const cartIndex = state.userCarts[userId].findIndex(
                (cart) => cart.book.id === bookId
            );
            
            if (cartIndex !== -1) {
                state.userCarts[userId][cartIndex].quantity--;
                
                if (state.userCarts[userId][cartIndex].quantity < 1) {
                    // Remove item if quantity is less than 1
                    state.userCarts[userId].splice(cartIndex, 1);
                }
                
                state.carts = [...state.userCarts[userId]];
            }
        },
        removeCart(state, action) {
            const { bookId, userId } = action.payload;
            if (!userId || !state.userCarts || !state.userCarts[userId]) return;
            
            state.userCarts[userId] = state.userCarts[userId].filter(
                (cart) => cart.book.id !== bookId
            );
            state.carts = [...state.userCarts[userId]];
        },
        loadUserCart(state, action) {
            const userId = action.payload;
            
            if (!state.userCarts) {
                state.userCarts = {};
            }
            
            if (userId && state.userCarts[userId]) {
                state.carts = [...state.userCarts[userId]];
            } else {
                state.carts = [];
            }
        },
        clearCart(state) {
            state.carts = [];
        },
        clearUserCart(state, action) {
            const userId = action.payload;
            
            if (!state.userCarts) {
                state.userCarts = {};
            }
            
            if (userId) {
                state.userCarts[userId] = [];
                state.carts = [];
            }
        },
        migrateState(state) {
            // Ensure userCarts is always initialized
            if (!state.userCarts) {
                state.userCarts = {};
            }
        }
    },
});

export const { 
    migrateState,
    addToCart, 
    removeCart, 
    increaseCart, 
    decreaseCart, 
    loadUserCart, 
    clearCart, 
    clearUserCart 
} = cartSlice.actions;

export default cartSlice.reducer;