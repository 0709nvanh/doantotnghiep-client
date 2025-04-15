import { createSlice } from "@reduxjs/toolkit";

export interface cartState {
    error: String;
    loading: boolean;
    notifications: any;

}
const initialState: cartState = {
    error: "",
    loading: false,
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action) {
            const order = action.payload;
            var todayDate = new Date().toISOString().slice(0, 10);
            const notificationOld = state.notifications.find((notification: any) => notification.order.id === order.id)
            if(notificationOld){
                notificationOld.message = `Bạn đã đặt hàng thành công vào ngày ${todayDate}. Click vào để xem chi tiết`
                const listNotifications = state.notifications.filter((notification: any) => notification.order.id !== order.id)
                listNotifications.unshift(notificationOld)
                state.notifications = listNotifications
            }else{
                const notification = {
                    message: `Bạn đã đặt hàng thành công vào ngày ${todayDate}. Click vào để xem chi tiết`,
                    time: new Date(),
                    order: order,
                }
                state.notifications.unshift(notification)
            }
            
        },
        removeNotification(state, action){
            
        }
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer