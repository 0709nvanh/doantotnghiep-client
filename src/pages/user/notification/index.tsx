import { useQuery } from '@apollo/client';
import React from 'react';
import { useSelector } from 'react-redux';
import '../history/history.css';
import { Link } from 'react-router-dom';

interface Props {

}

const History = (props: Props) => {
    const notifications = useSelector((state: any) => state.notifications.notifications);
    const user = useSelector((state: any) => state.auth.user)
    debugger;
    if(user?.email){
        return (
            <div>
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
        )
    }
    return null;
   
}

export default History
