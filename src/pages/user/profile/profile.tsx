import { LoadingOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Row, Upload } from 'antd';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar } from '../../../features/auths/authSlice';


interface Props {

}

const Profile = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.auth.user)
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const beforeUpload = (file: any) => {
        setLoading(true)
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (isJpgOrPng && isLt2M) {
            const storage = getStorage();
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadBytes(storageRef, file).then(async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                if(downloadUrl){
                    dispatch(updateAvatar(downloadUrl));
                    setLoading(false);
                }
            });
        }
    }
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <Avatar size={100} src={user.avatar} />}
        </div>
    );
    return (
        <div style={{ padding: '20px' }}>
            <h4 style={{ textAlign: 'left' }} className="m-0 mb-2">Hồ Sơ Của Tôi</h4>
            <p style={{ textAlign: 'left' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <hr />
            <Row>
                <Col span={16} style={{ borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: '20px' }}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                        >
                            <Input defaultValue={user.name} />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled={true} defaultValue={user.email} />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                        >
                            <Input type="number" defaultValue={user?.phone} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8}>
                    <Upload
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                    >
                        {uploadButton}
                    </Upload>
                    <p className="m-0 mt-3">Dụng lượng file tối đa 1 MB</p>
                    <p>Định dạng:.JPEG, .PNG</p>
                </Col>
            </Row>
        </div>
    )
}

export default Profile
