import { combineReducers } from "redux";

import cartReducer from "./features/cart/cartSlide";
import authReducer from "./features/auths/authSlice";
import notificationReducer from "./features/notifications/notificationSlide"
const rootReducer = combineReducers({
    cart: cartReducer,
    auth: authReducer,
    notifications: notificationReducer,
});
export default rootReducer;