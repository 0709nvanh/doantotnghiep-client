import React, { useEffect } from 'react';
import './App.css';
import Router from './routers';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserCart, clearCart, migrateState } from './features/cart/cartSlide';
import { loadUserNotifications, clearNotifications, migrateNotificationState } from './features/notifications/notificationSlide';

const App:React.FC = () => {
  const user = useSelector((state: any) => state.auth.user)
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Migrate states to ensure proper initialization
    dispatch(migrateState());
    dispatch(migrateNotificationState());
    
    if (user?.id) {
      // Load user's cart and notifications when user is logged in
      dispatch(loadUserCart(user.id));
      dispatch(loadUserNotifications(user.id));
    } else {
      // Clear cart and notifications when user is not logged in
      dispatch(clearCart());
      dispatch(clearNotifications());
    }
  }, [user?.id, dispatch]);

  return (
      <div className="App">
        <ToastContainer autoClose={3000} />
       <Router />
      </div>
  );
}

export default App;
