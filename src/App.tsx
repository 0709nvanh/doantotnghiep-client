import React from 'react';
import './App.css';
import Router from './routers';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
const App:React.FC = () => {
  const user = useSelector((state: any) => state.auth.user)
  const dispatch = useDispatch()
  if(!user){
    
  }
  return (
      <div className="App">
        <ToastContainer autoClose={3000} />
       <Router />
      </div>
  );
}

export default App;
