import { createSlice } from "@reduxjs/toolkit";

export interface notificationState {
    error: String;
    loading: boolean;
    notifications: any[];
    userNotifications: { [userId: string]: any[] };
}

const initialState: notificationState = {
    error: "",
    loading: false,
    notifications: [],
    userNotifications: {},
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action) {
            const { order, userId } = action.payload;
            
            if (!userId) return;
            
            // Initialize userNotifications if it doesn't exist
            if (!state.userNotifications) {
                state.userNotifications = {};
            }
            
            // Initialize user's notifications array if it doesn't exist
            if (!state.userNotifications[userId]) {
                state.userNotifications[userId] = [];
            }
            
            var todayDate = new Date().toISOString().slice(0, 10);
            const notificationOld = state.userNotifications[userId].find(
                (notification: any) => notification.order.id === order.id
            );
            
            if(notificationOld){
                notificationOld.message = `Bạn đã đặt hàng thành công vào ngày ${todayDate}. Click vào để xem chi tiết`;
                const listNotifications = state.userNotifications[userId].filter(
                    (notification: any) => notification.order.id !== order.id
                );
                listNotifications.unshift(notificationOld);
                state.userNotifications[userId] = listNotifications;
            } else {
                const notification = {
                    message: `Bạn đã đặt hàng thành công vào ngày ${todayDate}. Click vào để xem chi tiết`,
                    time: new Date(),
                    order: order,
                };
                state.userNotifications[userId].unshift(notification);
            }
            
            // Update current notifications for the logged-in user
            state.notifications = [...state.userNotifications[userId]];
        },
        loadUserNotifications(state, action) {
            const userId = action.payload;
            
            if (!state.userNotifications) {
                state.userNotifications = {};
            }
            
            if (userId && state.userNotifications[userId]) {
                state.notifications = [...state.userNotifications[userId]];
            } else {
                state.notifications = [];
            }
        },
        clearNotifications(state) {
            state.notifications = [];
        },
        clearUserNotifications(state, action) {
            const userId = action.payload;
            
            if (!state.userNotifications) {
                state.userNotifications = {};
            }
            
            if (userId) {
                state.userNotifications[userId] = [];
                state.notifications = [];
            }
        },
        removeNotification(state, action) {
            const { notificationId, userId } = action.payload;
            
            if (!userId || !state.userNotifications || !state.userNotifications[userId]) return;
            
            state.userNotifications[userId] = state.userNotifications[userId].filter(
                (notification: any) => notification.order.id !== notificationId
            );
            state.notifications = [...state.userNotifications[userId]];
        },
        migrateNotificationState(state) {
            // Ensure userNotifications is always initialized
            if (!state.userNotifications) {
                state.userNotifications = {};
            }
        }
    },
});

export const { 
    addNotification, 
    loadUserNotifications, 
    clearNotifications, 
    clearUserNotifications, 
    removeNotification,
    migrateNotificationState 
} = notificationSlice.actions;
export default notificationSlice.reducer;