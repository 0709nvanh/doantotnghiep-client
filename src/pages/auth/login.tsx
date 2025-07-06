import { useMutation } from "@apollo/client";
import { Button, Col, Form, Row, Spin, Input, Divider } from "antd";
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
import { login } from "@/features/auths/authSlice";
import { logIn, loginWithPassword } from "@/graphql-client/mutations";
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

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const hasShownToast = useRef(false);

  const [add, Mutation] = useMutation<any>(logIn);
  const [loginPassword, loginPasswordMutation] = useMutation<any>(loginWithPassword);
  
  // Xử lý đăng nhập Google
  useEffect(() => {
    if (Mutation.data?.login && !hasShownToast.current) {
      const user = Mutation.data.login;
      dispatch(login(user));
      hasShownToast.current = true;
      if (user.role === 1) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [Mutation.data, dispatch, navigate]);
  
  // Xử lý đăng nhập bằng password
  useEffect(() => {
    if (loginPasswordMutation.data?.loginWithPassword && !hasShownToast.current) {
      const user = loginPasswordMutation.data.loginWithPassword;
      dispatch(login(user));
      toastDefault("Đăng nhập thành công");
      hasShownToast.current = true;
      if (user.role === 1) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [loginPasswordMutation.data, dispatch, navigate]);

  // Reset toast flag khi component mount
  useEffect(() => {
    hasShownToast.current = false;
  }, []);

  const handleGgLogin = () => {
    signInWithPopup(auth, provider2)
      .then((result) => {
        const user = result.user;
        const { displayName, email } = user;
        if (displayName && email) {
          add({
            variables: { name: displayName, email },
            refetchQueries: [{ query: getUserQuery }],
          }).catch((res) => {
            const errors = res.graphQLErrors.map((error: any) => error.message);
            toastError(`Đăng nhập thất bại! ${errors}`);
          });
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        toastError("Đăng nhập Google thất bại");
      });
  };

  const onFinish = (values: any) => {
    loginPassword({
      variables: { 
        input: {
          email: values.email,
          password: values.password
        }
      },
      refetchQueries: [{ query: getUserQuery }],
    }).catch((error) => {
      if (error.graphQLErrors) {
        const errors = error.graphQLErrors.map((err: any) => err.message);
        toastError(`Đăng nhập thất bại! ${errors}`);
      } else {
        toastError("Đăng nhập thất bại!");
      }
    });
  };

  if (Mutation.loading || loginPasswordMutation.loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Row style={{ height: 800, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Col span={8}>
          <h2 style={{ margin: 40, textAlign: "center" }}>Đăng nhập</h2>
          
          {/* Form đăng nhập bằng email/password */}
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            style={{ marginBottom: 20 }}
          >
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

            <Form.Item >
              <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          
          <Divider>Hoặc</Divider>
          
          {/* Nút đăng nhập Google */}
          <Button
            style={{ width: "100%", marginBottom: 10 }}
            onClick={handleGgLogin}
          >
            Đăng nhập bằng Google
          </Button>
        </Col>
      </Row>
    </div>
  );
}

Login.propTypes = {};

export default Login;
