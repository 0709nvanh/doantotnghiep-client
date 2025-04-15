import { Col, Row } from 'antd';
import React from 'react';
import './footerhover.css';
interface Props {
    
}

const Footerhover = (props: Props) => {
    return (
        <Row style={{backgroundColor: '#EDF1F2', padding: '40px'}}>
            <Col span={12} className="image-123">
                <div className="image-hover ">
                    <img src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/12/banner3.jpg" alt="" />
                </div>
            </Col>
            <Col span={12} className="image-123">
                <div className="image-hover">
                <img src="https://skybook.woovina.net/demo-01/wp-content/uploads/2020/05/banner-04.jpg" alt="" />
                </div>
            </Col>
        </Row>
    )
}

export default Footerhover
