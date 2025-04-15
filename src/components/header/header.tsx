import {
     BellOutlined,
      HeartOutlined,
       LogoutOutlined,
        ProfileOutlined,
         ShoppingOutlined,
          UserOutlined,
           HomeOutlined,
            ShopOutlined,
            EditFilled,
            BookOutlined,
            MenuOutlined,
            InfoCircleOutlined,
            PhoneOutlined,
         }
    from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { Button, Col, Dropdown, Input, Menu, Row, Spin, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import formatprice from '../../common/formatprice';
import { logout } from '../../features/auths/authSlice';
import { getBooks } from '../../graphql-client/query';
import './header.css';
import { getAuth, signOut } from "firebase/auth";

const { Search } = Input;
interface Props {

}

const responesiveWidth = 1100;

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
  }

const Header = (props: Props) => {
    const dispatch = useDispatch()
    const carts = useSelector((state: any) => state.cart.carts)
    const notifications = useSelector((state: any) => state.notifications.notifications);
    const user = useSelector((state: any) => state.auth.user)
    let total = 0;

    const { width } = useWindowDimensions();
    console.log(width);
    

    if (carts.length > 0) {
        carts.forEach((cart: any) => {
            total += cart.book.price * cart.quantity
        })
    }
    const [isShowViewSearch, setIsShowViewSearch] = useState(false);
    const [keySearch, setKeySearch] = useState<String>('');
    useEffect(() => {
        if (keySearch === '') {
            setIsShowViewSearch(false);
        }
    }, [keySearch])
    const inputSearchRef = useRef<any>("");
    const [isLoading, setIsLoading] = useState(false);
    const { data: data1, loading } = useQuery(getBooks)
    if (loading) {
        return <Spin size="large" />
    }
    const handleChageSearch = (e: any) => {
        setIsShowViewSearch(true)
        let timeout: any = null;
        var keyUpEventHandler2 = function (event: any) {
            clearTimeout(timeout);
            setIsLoading(true)
            timeout = setTimeout(async () => {
                const search = inputSearchRef.current.input.value;
                if (search !== '') {
                    setTimeout(() => {
                        setKeySearch(search)
                        setIsLoading(false)
                    }, 1000)
                } else {
                    setTimeout(() => {
                        setKeySearch('')
                        setIsLoading(false)
                    }, 500)
                }
            }, 500);
        }
        inputSearchRef.current.input.addEventListener('keyup', keyUpEventHandler2);
    }

    let dataFilter: any[] = [];
    if (keySearch !== "") {
        dataFilter = data1.books.filter((book: any) => book.name.toLowerCase().includes(keySearch.toLowerCase()))
    }
    const handleClickRemove = () => {
        setKeySearch('');
        setIsLoading(false)
        setIsShowViewSearch(false)
    }
    const handleLogout = () => {
        dispatch(logout({}))
    }

    

    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<ProfileOutlined />}>
                <Link to="user/profile">Xem profile</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<HeartOutlined />}>
                <Link to="/favorite">Sách yêu thích</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const cartView = (
        <Menu>
            <h4 className="my-2 text-center">Giỏ hàng của bạn</h4>
            <div className="header-scroll">
                {carts.length > 0 ? carts.map((cart: any, index: number) => (
                    <Menu.Item key={index}>
                        <div className="header-product">
                            <div className="header-product-img">
                                <img width="100%" src={cart.book.image} alt="" />
                            </div>
                            <div className="header-product-content">
                                <h6>{cart.book.name}</h6>
                                <p>Tác giả: {cart.book.author.name}</p>
                            </div>
                            <div className="header-quantity">
                                <p className="text-center m-0">Số lượng</p>
                                <p className="text-center m-0">{cart.quantity}</p>
                            </div>
                            <div className="header-quantity">
                                <p className="text-center m-0">Giá tiền</p>
                                <p className="text-center m-0">{formatprice(cart.book.price)}</p>
                            </div>
                        </div>
                    </Menu.Item>
                )) :
                    <img className="mt-4 mx-auto d-block" width="330" src="https://dcstore.vn/assets/image/empty-cart.png" alt="" />
                }

            </div>
            {carts.length > 0 &&
                <div className="d-flex mx-2 align-items-center justify-content-between">
                    <h5>Tổng tiền: {formatprice(total)}</h5>
                    <Button>
                        <Link to="/cart" className="m-0">
                            Xem chi tiết giỏ hàng
                        </Link>
                    </Button>
                </div>

            }
        </Menu>
    )

    const Notification = (
        <Menu>
            <h4 className="my-2 text-center">Thông báo mới nhận</h4>
            <div className="header-scroll">
                {(user?.email && notifications.length > 0) ? notifications.map((item: any) => (
                    <Link to="user/history" key={item.order.id} className="notification-item">
                        <img width="80" className='me-2' src="http://hanoimoi.com.vn/Uploads/image/News/Thumbnails/2021/5/Thumbnails25462021044620icon.png" alt="" />
                        <div>{item.message}</div>
                    </Link>
                )) : (
                    <div style={{ textAlign: "center" }}>Không có thông báo mới !</div>
                )}
            </div>
            <Link to="/user/notifications" className="text-center d-block">Xem chi tiết</Link>
        </Menu>
    )

    const onSearch = (value: string) => console.log(value);
    const showSearch = () => {
        if (dataFilter.length > 0 && keySearch !== '') {
            return dataFilter.map((book) => (
                <Link onClick={handleClickRemove} to={"/" + book.author.slug + "/" + book.slug} key={book.id} className="showSearch">
                    <div className="search-img">
                        <img width="80" height="100" src={JSON.parse(book.image)[0]} alt="" />
                    </div>
                    <div className="search-content">
                        <h6 className="search-heading">{book.name}</h6>
                        <p className="search-author m-0">Tác giả: {book.author.name}</p>
                        <p className="search-author">Thể loại: {book.genre.name}</p>
                    </div>
                </Link>
            ))
        } else {
            return <p className="mt-4">Không tìm thấy sản phẩm nào</p>
        }
    }

    
    return (
        <div className="header">
            <Row style={{ padding: '30px 40px', alignItems: 'center' }}>
                <Col span={8}>
                    <img width="200" src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/12/logo.png" alt="" />
                </Col>
                <Col span={6}>
                    <Search
                        placeholder="Tìm kiếm"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        onChange={handleChageSearch}
                        ref={inputSearchRef}
                    />
                    {isShowViewSearch ? <div className="viewSearch">
                        <div className="position-search">
                            {isLoading ? <Spin style={{ marginTop: '40px' }} size="large" /> : showSearch()}
                        </div>
                        <div className="viewAllSearch">
                            <Link className="text-center" to="/allbook">Xem tất cả</Link>
                        </div>
                    </div> : null}
                </Col>

                

                <Col span={10}>
                    <Row style={{ alignItems: 'center' }}>
                        <Col span={7}>
                            <Dropdown.Button overlay={Notification} placement="bottomRight" icon={
                                <div>
                                    <BellOutlined />
                                    {user?.email && <span className="header-in-number">{notifications.length}</span>}
                                </div>
                            }>
                                <Link to="/user/notifications">
                                    {width > responesiveWidth && <span>Thông báo</span>}
                                </Link>
                            </Dropdown.Button>
                        </Col>
                        <Col span={9}>
                            <Dropdown.Button overlay={cartView} placement="bottomRight" icon={
                                <div>
                                    <ShoppingOutlined />
                                    <span className="header-in-number">{carts.length}</span>
                                </div>
                            }>
                                <Link to="/cart">
                                {width > responesiveWidth && 'Giỏ hàng của bạn'}
                                </Link>
                            </Dropdown.Button>
                        </Col>
                        <Col span={8}>
                            {width < responesiveWidth || user?.name ?
                             <Dropdown.Button style={{ height: '100%' }} overlay={menu} placement="bottomCenter" icon={<UserOutlined />}>
                                {width > responesiveWidth && user.name}
                            </Dropdown.Button> :
                                 <div className="d-flex">
                                    <Button type="primary" style={{ height: '40px' }}>
                                        <Link style={{ color: 'white' }} to="/login">Đăng nhập</Link>
                                    </Button>
                                    <Button type="primary" danger style={{ height: '40px', marginLeft: '10px' }}>
                                        <Link style={{ color: 'white' }} to="/register">Đăng ký</Link>
                                    </Button>
                                </div>
                            }

                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{ backgroundColor: 'black', justifyContent: 'center', padding: "0 40px" }}>
                <Col span={3} className="menu-item">
                    <NavLink to="/" style={{ color: 'white', display: 'block' }}>
                        <Typography.Title style={{ margin: 0, zIndex: 2, color: 'white' }} level={5} >
                        {width < responesiveWidth ? <HomeOutlined style={{ width: '40px'}}/> : 'Trang chủ'}
                        </Typography.Title>
                    </NavLink>
                    <span className="spanhover"></span>
                </Col>
                <Col span={3} className="menu-item">
                    <NavLink to="/shop" style={{ color: 'white', display: 'block' }}>
                        <Typography.Title style={{ margin: 0, zIndex: 2, color: 'white' }} level={5} >
                        {width < responesiveWidth ? <ShopOutlined style={{ width: '40px'}}/> : 'Cửa hàng'}
                        </Typography.Title>
                    </NavLink>
                    <span className="spanhover"></span>
                </Col>
                <Col span={3} className="menu-item">
                    <NavLink to="/category" style={{ color: 'white', display: 'block' }}>
                        <Typography.Title style={{ margin: 0, zIndex: 2, color: 'white' }} level={5} >
                        {width < responesiveWidth ? <MenuOutlined style={{ width: '40px'}}/> : 'Danh mục'}
                        </Typography.Title>
                    </NavLink>
                    <span className="spanhover"></span>
                </Col>
                <Col span={3} className="menu-item">
                    <NavLink to="/about-us" style={{ color: 'white', display: 'block' }}>
                        <Typography.Title style={{ margin: 0, zIndex: 2, color: 'white' }} level={5} >
                        {width < responesiveWidth ? <InfoCircleOutlined style={{ width: '40px'}}/> : 'Giới thiệu'}
                        </Typography.Title>
                    </NavLink>
                    <span className="spanhover"></span>
                </Col>
                <Col span={3} className="menu-item">
                    <NavLink to="/contact-us" style={{ color: 'white', display: 'block' }}>
                        <Typography.Title style={{ margin: 0, zIndex: 2, color: 'white' }} level={5} >
                        {width < responesiveWidth ? <PhoneOutlined style={{ width: '40px'}}/> : 'Liên hệ'}
                        </Typography.Title>
                    </NavLink>
                    <span className="spanhover"></span>
                </Col>
            </Row>
        </div>
    )
}

export default Header
