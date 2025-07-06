import { useMutation } from "@apollo/client";
import { Button, Col, Row, Spin, Form, Input, Divider } from "antd";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import "@/common/firebase/index";
import { toastDefault } from "@/common/toast";
import { toastError } from "@/common/toasterror";
import { register } from "@/features/auths/authSlice";
import { signIn } from "@/graphql-client/mutations";
import { getUserQuery } from "@/graphql-client/query";

const provider1 = new FacebookAuthProvider();
const provider2 = new GoogleAuthProvider();

// facebook
provider1.setCustomParameters({
  display: "popup",
});

// google
provider2.setCustomParameters({
  login_hint: "user@example.com",
});

function Register() {
  const navigate = useNavigate();
  const auth = getAuth();
  const dispatch = useDispatch();
  const [add, Mutation] = useMutation<any>(signIn);
  const hasShownToast = useRef(false);
  
  // Xử lý đăng ký thành công
  useEffect(() => {
    if (Mutation.data?.createUser && !hasShownToast.current) {
      const user = Mutation.data?.createUser;
      dispatch(register(user));
      toastDefault("Đăng kí thành công");
      hasShownToast.current = true;
      navigate("/");
    }
  }, [Mutation.data, dispatch, navigate]);

  // Reset toast flag khi component mount
  useEffect(() => {
    hasShownToast.current = false;
  }, []);

  //   google
  const handleGgLogin = () => {
    signInWithPopup(auth, provider2)
      .then((result) => {
        const user = result.user;
        const { displayName, email, photoURL, uid } = user;
        if (displayName && email) {
          const newUser = {
            name: displayName,
            email,
            avatar: photoURL,
            password: uid,
          };
          add({
            variables: newUser,
            refetchQueries: [{ query: getUserQuery }],
          });
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        toastError("Đăng ký Google thất bại");
      });
  };

  const loginFB = () => {
    toastError("Chức năng đang phát triển");
  };

  const onFinish = (values: any) => {
    const newUser = {
      name: values.name,
      email: values.email,
      password: values.password,
      avatar: null,
      role: 0
    };
    
    add({
      variables: newUser,
      refetchQueries: [{ query: getUserQuery }],
    }).catch((error) => {
      if (error.graphQLErrors) {
        const errors = error.graphQLErrors.map((err: any) => err.message);
        toastError(`Đăng ký thất bại! ${errors.join(', ')}`);
      } else {
        toastError("Đăng ký thất bại!");
      }
    });
  };

  if (Mutation.loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Row style={{ height: 800, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Col span={8}>
          <h2 style={{ margin: 40, textAlign: "center" }}>Đăng ký</h2>
          
          {/* Form đăng ký bằng name, email, password */}
          <Form
            name="register"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            style={{ marginBottom: 20 }}
          >
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập họ tên của bạn" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu của bạn" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Form.Item >
              <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
          
          <Divider>Hoặc</Divider>
          
          <Button
            style={{ width: "100%", marginBottom: 10 }}
            onClick={handleGgLogin}
          >
            Đăng ký bằng Google
          </Button>
          <Button style={{ width: "100%", marginBottom: 10 }} onClick={loginFB}>
            Đăng ký bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}

Register.propTypes = {};

export default Register;
