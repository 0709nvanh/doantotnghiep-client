import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/header";
import Footer from '../components/footer/footer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LayoutWebsite: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user)

  React.useEffect(() => {
    if(user?.role === 1){
        navigate('/admin')
    }
  }, [user, navigate])
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
export default LayoutWebsite;
