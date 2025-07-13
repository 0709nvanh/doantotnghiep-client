import {
    AppstoreOutlined,
    DashboardOutlined,
    SettingOutlined, 
    UserOutlined,
    BookOutlined,
    ShoppingCartOutlined,
    CommentOutlined,
    TagsOutlined,
    UserAddOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { Button, Col, Layout, Menu, Row, Spin } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toastError } from '../common/toasterror';
import { logout } from '../features/auths/authSlice';
import { getUserQuery } from '../graphql-client/query';

const { SubMenu } = Menu;
const LayoutAdmin: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user)
    if(!user?.email){
        navigate('/')
        toastError('Bạn không có quyền truy cập trang này !!!')
    }
    const { loading, error, data } = useQuery(getUserQuery, {
        variables: {
            email: user.email,
        }
    })

    if (loading) {
        return <Spin size="large" />
    }
    if (data) {
        if (data.user.role === 0) {
            navigate('/')
            toastError('Bạn không có quyền truy cập trang này !!!')
        }
    }
    const handleClick = (e: any) => {
        console.log('click ', e);
    };

    const logoutAdmin = () => {
        dispatch(logout({}))
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header">
                <div className='flex items-center justify-between'>
                <div className='flex justify-start w-full'>
                <Link to={"/"}>
                            <img
                                width="200"
                                src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/12/logo.png"
                                alt=""
                            />
                        </Link>
                </div>
                    <Button onClick={logoutAdmin}>Đăng xuất</Button>
                </div>
            </Header>
            <Row style={{ flex: 1 }}>
                <Col span={5} style={{ height: 'calc(100vh - 64px)' }}>
                    <Menu
                        onClick={handleClick}
                        defaultSelectedKeys={['dashboard']}
                        defaultOpenKeys={['sub1', 'sub2', 'sub3', 'sub6', 'sub5', 'sub9']}
                        mode="inline"
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="dashboard" icon={<DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} title="User">
                            <Menu.Item key="1" icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/user">Quản lý người dùng</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub9" icon={<TagsOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} title="Thể loại">
                            <Menu.Item key="2" icon={<TagsOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/genre">Quản lý thể loại</Link>
                            </Menu.Item>
                            <Menu.Item key="9" icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/addgenre">Thêm thể loại</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<UserAddOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} title="Tác giả">
                            <Menu.Item key="3" icon={<UserAddOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/authors">Quản lý tác giả</Link>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<UserAddOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/addauthor">Thêm tác giả</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<BookOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} title="Sản phẩm sách">
                            <Menu.Item key="5" icon={<BookOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/books">Quản lý sách</Link>
                            </Menu.Item>
                            <Menu.Item key="6" icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/addbook">Thêm sách</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub6" icon={<ShoppingCartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} title="Đơn đặt hàng">
                            <Menu.Item key="10" icon={<ShoppingCartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/cart">Quản lý đơn đặt hàng</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub5" icon={<CommentOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} title="Bình luận">
                            <Menu.Item key="8" icon={<CommentOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                                <Link to="/admin/comments">Quản lý bình luận</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Col>
                <Col span={19}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 'calc(100vh - 64px)',
                        }}
                    >
                        <Outlet />
                    </Content>
                </Col>
            </Row>
        </Layout>

    );
};
export default LayoutAdmin;
