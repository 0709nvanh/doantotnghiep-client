import { BellOutlined, FormOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Col, Row } from 'antd'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'

interface Props {

}

const UserPage = (props: Props) => {
    const user = useSelector((state: any) => state.auth.user)
    return (
        <div className="bg-light">
            <Row style={{ width: '1200px', margin: " 0 auto", padding: "20px"}}>
                <Col span={4}>
                    <div className="d-flex align-items-center mb-5 justify-content-between">
                        <Avatar size={54} src={user.avatar} />
                        <div>
                            <p className="m-0">{user.name}</p>
                            <Link to="/user/profile" className="d-flex align-items-center"><FormOutlined className="me-2" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Sửa hồ sơ</Link>
                        </div>
                    </div>
                    <Link to="/user/profile" className="d-flex align-items-center mb-3">
                        <UserOutlined style={{ fontSize: "24px" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        <p className="m-0 ms-2">Tài khoản của tôi</p>
                    </Link>
                    <Link to="/user/history" className="d-flex align-items-center mb-3">
                        <SolutionOutlined style={{ fontSize: "24px" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        <p className="m-0 ms-2">Đơn mua</p>
                    </Link>
                    <Link to="/user/notifications" className="d-flex align-items-center mb-3">
                        <BellOutlined style={{ fontSize: "24px" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        <p className="m-0 ms-2">Thông báo</p>
                    </Link>
                </Col>
                <Col span={20} style={{backgroundColor: 'white'}}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    )
}

export default UserPage
