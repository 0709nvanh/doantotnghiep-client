import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../history/history.css';
import { Link } from 'react-router-dom';
import { loadUserNotifications } from '../../../features/notifications/notificationSlide';

interface Props {

}

const Notification = (props: Props) => {
    const notifications = useSelector((state: any) => state.notifications.notifications);
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user?.id) {
            navigate("/login");
            return;
        }
        // Load user's notifications when component mounts
        dispatch(loadUserNotifications(user.id));
    }, [user?.id, dispatch, navigate]);
     
    if (!user?.id) {
        return (
            <div className="text-center my-5">
                <h4>Vui lòng đăng nhập để xem thông báo</h4>
                <Button type="primary" onClick={() => navigate("/login")}>
                    Đăng nhập
                </Button>
            </div>
        );
    }

    return (
        <div>
            <h3 className="my-4">Thông báo của bạn</h3>
            <div className="header-scroll" style={{ height: 700}}>
                {notifications.length > 0 ? notifications.map((item: any) => (
                    <Link to="/user/history" key={item.order.id} style={{ display: 'flex' , alignItems: 'center', padding: 10}}>
                        <img width="300" className='me-2' src="http://hanoimoi.com.vn/Uploads/image/News/Thumbnails/2021/5/Thumbnails25462021044620icon.png" alt="" />
                        <div>{item.message}</div>
                    </Link>
                )) : (
                    <div style={{ textAlign: "center" }}>Không có thông báo mới !</div>
                )}
            </div>
        </div>
    );
}

export default Notification;
