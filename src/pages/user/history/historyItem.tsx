import { useMutation } from '@apollo/client';
import { Avatar, Button, Col, Input, Modal, Rate, Row } from 'antd';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import formatprice from '../../../common/formatprice';
import { toastDefault } from '../../../common/toast';
import { addNotification } from '../../../features/notifications/notificationSlide';
import { createOrder, danhGiaOrder, deleteStatusOrder, updateStatusOrder } from '../../../graphql-client/mutations';
import { getOrderByEmail, getOrders } from '../../../graphql-client/query';
import './item.css';
interface Props {
    order: any
}

const HistoryItem = (props: Props) => {

    const lien_he_shop = 'Liên hệ shop';
    const xem_danh_gia = 'Xem đánh giá';
    const danh_gia_shop = 'Đánh giá shop';
    const mua_lai = 'Mua lại hàng'
    const chi_tiet_don_huy = 'Chi tiết đơn hủy'
    const dispatch = useDispatch()
    const { order } = props;
    const [add, Mutation] = useMutation<any>(updateStatusOrder);
    const [dele, Muta] = useMutation<any>(deleteStatusOrder);
    const [upSao, MutaSao] = useMutation<any>(danhGiaOrder)
    const [addOrder, MutaOrder] = useMutation<any>(createOrder);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewModal, setIsViewModal] = useState<String>('');
    const refInput = useRef<any>('');
    const user = useSelector((state: any) => state.auth.user)
    console.log(order);
    const [sao, setSao] = useState(0)
    const listOrder = JSON.parse(order.listOrder)
    let total = 0;
    listOrder.forEach((item: any) => {
        total += item.book.price * item.quantity
    })

    const handleRemoveOrder = (id: string) => {
        if (window.confirm("Bạn có muốn hủy đơn hàng hay không ?")) {
            dele({
                variables: { id },
                refetchQueries: [{ query: getOrders }]
            })
        }
    }
    const handleUpdateOrder = (id: string, status: number) => {
        add({
            variables: { id, status },
            refetchQueries: [{ query: getOrders }]
        })
    }


    const showStatus = (status: Number) => {
        let html = null;
        if (status === 2) {
            html = <div className="d-flex header-status">
                <div className="d-flex header-status-item pe-2">
                    <p className="m-0">
                        <i className="fas fa-truck-moving"></i>
                        <span className="mx-2">Người gửi đang chuẩn bị hàng</span>
                        <span><i className="fas fa-exclamation-circle"></i></span>
                    </p>
                </div>
                <h6 className="m-0 ps-2">CHỜ LẤY HÀNG</h6>
            </div>
        } else if (status === 3) {
            html = <div className="d-flex header-status">
                <div className="d-flex header-status-item pe-2">
                    <p className="m-0">
                        <i className="fas fa-truck-moving"></i>
                        <span className="mx-2">Người vận chuyển đang đến chỗ bạn</span>
                        <span><i className="fas fa-exclamation-circle"></i></span>
                    </p>
                </div>
                <h6 className="m-0 ps-2">CHỜ GIAO HÀNG</h6>
            </div>
        } else if (status === 4) {
            html = <div className="d-flex header-status">
                <div className="d-flex header-status-item pe-2">
                    <p className="m-0">
                        <i className="fas fa-truck-moving"></i>
                        <span className="mx-2">Giao hàng thành công</span>
                        <span><i className="fas fa-exclamation-circle"></i></span>
                    </p>
                </div>
                <h6 className="m-0 ps-2">THÀNH CÔNG</h6>
            </div>
        } else if (status === 5) {
            html = <div className="d-flex header-status">
                <div className="d-flex header-status-item pe-2">
                    <p className="m-0">
                        <i className="fas fa-truck-moving"></i>
                        <span className="mx-2">Hoàn trả hàng thành công</span>
                        <span><i className="fas fa-exclamation-circle"></i></span>
                    </p>
                </div>
                <h6 className="m-0 ps-2">ĐÃ HỦY</h6>
            </div>
        } else {
            html = <div className="d-flex header-status">
                <div className="d-flex header-status-item pe-2">
                    <p className="m-0">
                        <i className="fas fa-truck-moving"></i>
                        <span className="mx-2">Hãy xác nhận để hoàn thành đơn hàng</span>
                        <span><i className="fas fa-exclamation-circle"></i></span>
                    </p>
                </div>
                <h6 className="m-0 ps-2">CHỜ XÁC NHẬN</h6>
            </div>
        }
        return html;
    }

    const showBtnStatus = (status: number, id: string) => {
        let html = null;
        if (status === 2) {
            html = <div className="d-flex align-items-center justify-content-between">
                <Button type="primary" onClick={() => showModal(lien_he_shop)}>Liên hệ shop</Button>
                <Button onClick={() => handleRemoveOrder(id)} danger>Hủy đơn hàng</Button>
                <Button>Xuất Hóa Đơn</Button>
            </div>
        } else if (status === 3) {
            html = <div className="d-flex align-items-center justify-content-between">
                <Button type="primary" onClick={() => handleUpdateOrder(id, status)}>Xác nhận đã nhận hàng</Button>
                <Button onClick={() => handleRemoveOrder(id)} danger>Hủy đơn hàng</Button>
            </div>
        } else if (status === 4) {
            html = <div className="d-flex align-items-center justify-content-between">
                <Button type="primary" onClick={() => showModal(mua_lai)} danger>Mua lại</Button>
                <Button type="primary" onClick={() => showModal(lien_he_shop)}>Liên hệ shop</Button>
                {order.danhgia === 0 ? 
                <Button danger onClick={() => showModal(danh_gia_shop)}>Đánh giá shop</Button> : 
                <Button danger onClick={() => showModal(xem_danh_gia)}>Xem đánh giá shop</Button>}
            </div>
        } else if (status === 5) {
            html = <div className="d-flex align-items-center justify-content-between">
                <Button type="primary" onClick={() => showModal(mua_lai)} danger>Mua lại</Button>
                <Button type="primary" onClick={() => showModal(lien_he_shop)}>Liên hệ shop</Button>
                <Button onClick={() => showModal(chi_tiet_don_huy)} danger>Chi tiết đơn hủy</Button>
            </div>
        } else {
            html = <div className="d-flex align-items-center justify-content-between">
                <Button onClick={() => handleUpdateOrder(id, status)} type="primary">Xác nhận đơn hàng</Button>
                <Button onClick={() => handleRemoveOrder(id)} danger>Hủy đơn hàng</Button>
            </div>
        }
        return html;
    }

    const updateSao = (value: number) =>{
        setSao(value);
    }

    const showModalView = () => {
        let html = null;
        if (isViewModal === mua_lai) {
            html = <div>
                {listOrder.length > 0 && listOrder.map((item: any) => (
                    <div key={item.id} className="history-product">
                        <Row className='align-items-center'>
                            <Col className="me-3">
                                <img height="60" width="60" src={item.book.image} alt="" />
                            </Col>
                            <Col span={16}>
                                <p className='m-0' style={{ textAlign: 'left' }}>Tên sách: {item.book.name}</p>
                                <p className="m-0 my-2" style={{ textAlign: 'left' }}>Tác giả: {item.book.author.name}</p>
                                <p style={{ textAlign: 'left' }} className="m-0">Giá tiền: {formatprice(item.book.price)}</p>
                            </Col>
                            <Col span={2}>
                                <i className="fas fa-times"></i>
                            </Col>
                            <Col span={2}>
                                <p className="m-0" style={{ fontSize: '20px', color: 'coral' }}>{item.quantity}</p>
                            </Col>
                        </Row>
                    </div>
                ))}
                <div className="history-total py-2">
                    <p className="m-0" style={{ fontSize: '20px', textAlign: 'right', width: '100%' }}>
                        <i className="fas fa-money-check-alt" style={{ color: 'coral' }}></i>  Tổng số tiền:
                        <span className="m-0 ms-1" style={{ fontSize: '24px', color: 'coral' }}>{formatprice(total)}</span></p>
                </div>
            </div>
        } else if (isViewModal === lien_he_shop) {
            html = <div>
                <h5>Thông tin liên hệ</h5>
                <p>Tên cửa hàng: Cửa hàng sách SkyBooks</p>
                <p>Địa chỉ:  Số 83 Lý Nam Đế, Phường Cửa Đông, Hoàn Kiếm, Hà Nội</p>
                <p>Số điện thoại: 024 3843 8220</p>
                <p>Website: <a target="_blank" rel="noreferrer" href="http://skybooks.vn/">http://skybooks.vn/</a></p>
            </div>
        } else if (isViewModal === xem_danh_gia) {
            html = <div>
                {listOrder.length > 0 && listOrder.map((item: any) => (
                    <div key={item.id} className="history-product">
                        <Row className='align-items-center'>
                            <Col className="me-3">
                                <img height="60" width="60" src={item.book.image} alt="" />
                            </Col>
                            <Col span={16}>
                                <p className='m-0' style={{ textAlign: 'left' }}>Tên sách: {item.book.name}</p>
                                <p className="m-0 my-2" style={{ textAlign: 'left' }}>Tác giả: {item.book.author.name}</p>
                            </Col>
                        </Row>
                    </div> 
                ))}
                <div className="d-flex mt-3">
                    <Avatar size={64} src={user.avatar} />
                    <div className="danhgia-user ms-3">
                        <h6 className="m-0">{user.name}</h6>    
                        <Rate value={order.danhgia}/>
                        <p>Bình luận: {order.comments}</p>
                    </div>
                </div>
            </div>
        } else if (isViewModal === danh_gia_shop) {
            html = <div>
                <div className="d-flex align-items-center justify-content-between my-4">
                    <Rate onChange={updateSao}/>
                </div>
                <Input ref={refInput} placeholder="Thêm đánh giá bằng bình luận" />
            </div>
        } else if (isViewModal === chi_tiet_don_huy) {
            html = <div>
                <div className="thong-tin-kh">
                    <p className="m-0">Tên khách hàng: {order.name}</p>
                    <p className="m-0">Email: {order.email}</p>
                    <p className="m-0">Số điện thoại: 0{order.phone}</p>
                    <p className="m-0">Địa chỉ: {order.address}</p>
                    <p className="m-0">Trạng thái đơn hàng: Đơn hàng đã được hủy</p>
                </div>
                {listOrder.length > 0 && listOrder.map((item: any) => (
                    <div key={item.id} className="history-product">
                        <Row className='align-items-center'>
                            <Col className="me-3">
                                <img height="60" width="60" src={item.book.image} alt="" />
                            </Col>
                            <Col span={16}>
                                <p className='m-0' style={{ textAlign: 'left' }}>Tên sách: {item.book.name}</p>
                                <p className="m-0 my-2" style={{ textAlign: 'left' }}>Tác giả: {item.book.author.name}</p>
                                <p style={{ textAlign: 'left' }} className="m-0">Giá tiền: {formatprice(item.book.price)}</p>
                            </Col>
                            <Col span={2}>
                                <i className="fas fa-times"></i>
                            </Col>
                            <Col span={2}>
                                <p className="m-0" style={{ fontSize: '20px', color: 'coral' }}>{item.quantity}</p>
                            </Col>
                        </Row>
                    </div>
                ))}
                <div className="history-total py-2">
                    <p className="m-0" style={{ fontSize: '20px', textAlign: 'right', width: '100%' }}>
                        <i className="fas fa-money-check-alt" style={{ color: 'coral' }}></i>  Tổng số tiền:
                        <span className="m-0 ms-1" style={{ fontSize: '24px', color: 'coral' }}>{formatprice(total)}</span></p>
                </div>
            </div>
        }
        return html;
    }

    const showModal = (loai: String) => {
        setIsModalVisible(true);
        setIsViewModal(loai)
    };

    const handleOk = () => {
        if (isViewModal === mua_lai) {
            const orderNew = {
                name: order.name,
                phone: order.phone,
                status: 1,
                email: order.email,
                listOrder: order.listOrder,
                address: order.address,
            }
            addOrder({
                variables: orderNew,
                refetchQueries: [{ query: getOrderByEmail, variables: { email: order.email } }]
            })
            setTimeout(() => {
                toastDefault('Đặt hàng thành công')
            }, 1000)
        } else if (isViewModal === danh_gia_shop) {
            const danhgia = {
                id: order.id,
                danhgia: sao,
                comments: refInput.current.input.value
            };
            upSao({
                variables: danhgia,
                refetchQueries: [{ query: getOrderByEmail, variables: { email: order.email}}]
            })
            setTimeout(() => {
                toastDefault('Đánh giá thành công')
            }, 1000)
        }
        setIsModalVisible(false);
    };

    if (MutaOrder.data?.createOrder) {
        dispatch(addNotification(MutaOrder.data.createOrder))
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="container history-order-view">
            <div className="container-history">
                <Row>
                    <Col span={12}>
                        <h6 className='m-0' style={{ textAlign: 'left' }}>Đơn hàng ngày : {order.date}</h6>
                    </Col>
                    <Col span={12}>
                        {showStatus(order.status)}
                    </Col>
                </Row>
            </div>
            {listOrder.length > 0 && listOrder.map((item: any) => (
                <div key={item.id} className="history-product">
                    <Row className='align-items-center'>
                        <Col className="me-3">
                            <img height="80" width="80" src={item.book.image} alt="" />
                        </Col>
                        <Col span={15}>
                            <h6 className='m-0' style={{ textAlign: 'left' }}>Tên sách: {item.book.name}</h6>
                            <p className="m-0 my-2" style={{ textAlign: 'left' }}>Tác giả: {item.book.author.name}</p>
                            <p style={{ textAlign: 'left' }} className="m-0">Số lượng: {item.quantity}</p>
                        </Col>
                        <Col span={2}>
                            <i className="fas fa-times"></i>
                        </Col>
                        <Col span={4}>
                            <p className="m-0" style={{ fontSize: '20px', color: 'coral' }}>{formatprice(item.book.price)}</p>
                        </Col>
                    </Row>
                </div>
            ))}

            <div className="history-total py-2">
                <p className="m-0" style={{ fontSize: '20px', textAlign: 'right', width: '100%' }}>
                    <i className="fas fa-money-check-alt" style={{ color: 'coral' }}></i>  Tổng số tiền:
                    <span className="m-0 ms-1" style={{ fontSize: '24px', color: 'coral' }}>{formatprice(total)}</span></p>
            </div>
            <div className="btn-history py-3">
                <Row>
                    <Col span={14}>

                    </Col>
                    <Col span={10}>
                        {showBtnStatus(order.status, order.id)}
                    </Col>
                </Row>

            </div>

            <Modal title={isViewModal} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {showModalView()}
            </Modal>
        </div>
    )
}

export default HistoryItem
