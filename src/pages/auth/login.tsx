import { useMutation } from "@apollo/client";
import { Button, Col, Form, Row, Spin } from "antd";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "@/common/firebase/index";
import { toastDefault } from "@/common/toast";
import { toastError } from "@/common/toasterror";
import { login } from "@/features/auths/authSlice";
import { logIn } from "@/graphql-client/mutations";
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

// email

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const [add, Mutation] = useMutation<any>(logIn);
  if (Mutation.loading) {
    return <Spin size="large" />;
  }
  if (Mutation.data?.login) {
    const user = Mutation.data.login;
    dispatch(login(user));
    if (user.role === 1) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }

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
      });
  };

  //   email

  const onFinish = (values: any) => {
    const newUser = {
      email: values.email,
      password: values.password,
      avatar: null,
      name: values.email,
    };
    dispatch(login(newUser));
    add({
      variables: newUser,
      refetchQueries: [{ query: getUserQuery }],
    });
  };

  return (
    <div>
      <Row justify="center" style={{ height: 800 }}>
        <Col span={8}>
          <h2 style={{ margin: 40, textAlign: "center" }}>Đăng nhập</h2>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          ></Form>
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
