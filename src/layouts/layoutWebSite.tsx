import React from "react";
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from "react-router-dom";
import Footer from '../components/footer/footer';
import Header from "../components/header/header";

const LayoutWebsite: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user)

  React.useEffect(() => {
    if(user?.role === 1){
        navigate('/admin')
    }
  }, [user?.role])
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
export default LayoutWebsite;
