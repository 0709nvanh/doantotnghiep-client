import { useQuery } from '@apollo/client';
import { Col, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getOrderByEmail } from '../../../graphql-client/query';
import './history.css';
import HistoryItem from './historyItem';
interface Props {

}
const keyMenu = [
    {
        id: 'all',
        name: 'Tất cả'
    },
    {
        id: 1,
        name: 'Chờ xác nhận'
    },
    {
        id: 2,
        name: 'Chờ lấy hàng'
    },
    {
        id: 3,
        name: 'Đang giao'
    },
    {
        id: 4,
        name: 'Đã giao'
    },
    {
        id: 5,
        name: 'Đã hủy'
    },
]
const History = (props: Props) => {
    const [menuActive, setMenuActive] = useState({
        id: 'all',
        name: 'Tất cả'
    })
    const email = useSelector((state: any) => state.auth.user.email)
    const { loading, data } = useQuery(getOrderByEmail, {
        variables: {
            email: email
        }
    })
    if (loading) {
        return <Spin size="large" />
    }
    const handleMenuClick = (menu: any) => {
        setMenuActive(menu)
    }
    let dataOrder: any[] = []
    if(data?.orders){
        data.orders.forEach((order: any) => {
            dataOrder.unshift(order)
        })
    }
    let dataOrderFilter = dataOrder;
    if(menuActive.id !=='all'){
        dataOrderFilter = dataOrder.filter((order: any) => order.status === menuActive.id);
    }
    console.log(dataOrderFilter);

    
    return (
        <div>
            <Row className="history-nav-list">
                {keyMenu.map((menu) => (
                    <Col onClick={() => handleMenuClick(menu)} span={4} key={menu.id} className="history-nav-item">
                        <div>
                            <p className={menuActive.id === menu.id ? 'active-nav' : ''}>{menu.name}</p>
                        </div>
                    </Col>
                ))}
            </Row>
            {dataOrderFilter.length > 0 ? dataOrderFilter.map((data:any) => <div key={data.id}><HistoryItem order={data}/></div>) : null}
        </div>
    )
}

export default History
