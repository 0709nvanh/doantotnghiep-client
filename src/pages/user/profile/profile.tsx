import { LoadingOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Avatar, Button, Col, Form, Input, Row, Upload } from "antd";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar, updateUser } from "../../../features/auths/authSlice";
import { updateUser as updateUserMutation } from "../../../graphql-client/mutations";
import { getUserQuery } from "../../../graphql-client/query";
import { toastDefault } from "../../../common/toast";

interface Props {}

const Profile = (props: Props) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [updateUserMutationHook, { loading: updateLoading }] = useMutation<any>(updateUserMutation);
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.auth.user);
	
	const onFinish = (values: any) => {
		updateUserMutationHook({
			variables: { 
				id: user.id,
				name: values.name,
				phone: values.phone,
				avatar: user.avatar
			},
			refetchQueries: [{ query: getUserQuery, variables: { email: user.email } }],
		}).then((result: any) => {
			if (result.data?.updateUser) {
				dispatch(updateUser(result.data.updateUser));
				toastDefault("Cập nhật thông tin thành công");
			}
		}).catch((error: any) => {
			console.error("Update failed:", error);
		});
	};
	
	useEffect(() => {
		if (!user) return;
		form.setFieldsValue(user);
	}, [form, user]);

	const beforeUpload = (file: any) => {
		setLoading(true);
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (isJpgOrPng && isLt2M) {
			const storage = getStorage();
			const storageRef = ref(storage, `images/${file.name}`);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadBytes(storageRef, file).then(async () => {
				const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
				if (downloadUrl) {
					dispatch(updateAvatar(downloadUrl));
					setLoading(false);
				}
			});
		}
	};
	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> : <Avatar size={100} src={user.avatar} />}
		</div>
	);
	return (
		<div style={{ padding: "20px" }}>
			<h4 style={{ textAlign: "left" }} className="m-0 mb-2">
				Hồ Sơ Của Tôi
			</h4>
			<p style={{ textAlign: "left" }}>
				Quản lý thông tin hồ sơ để bảo mật tài khoản
			</p>
			<hr />
			<Row>
				<Col
					span={16}
					style={{
						borderRight: "1px solid rgba(0,0,0,0.1)",
						paddingRight: "20px",
					}}
				>
					<Form
						form={form}
						name="basic"
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						initialValues={{ remember: true }}
						onFinish={onFinish}
						autoComplete="off"
					>
						<Form.Item label="Username" name="name">
							<Input />
						</Form.Item>

						<Form.Item label="Email" name="email">
							<Input disabled={true} />
						</Form.Item>
						<Form.Item label="Số điện thoại" name="phone">
							<Input />
						</Form.Item>
						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
							<Button type="primary" htmlType="submit" loading={updateLoading}>
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
	);
};

export default Profile;
