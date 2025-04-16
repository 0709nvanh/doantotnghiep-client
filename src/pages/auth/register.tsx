import { useMutation } from "@apollo/client";
import { Button, Col, Row, Spin } from "antd";
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

// email

function Register() {
  const navigate = useNavigate();
  const auth = getAuth();
  const dispatch = useDispatch();
  const [add, Mutation] = useMutation<any>(signIn);
  if (Mutation.loading) {
    return <Spin size="large" />;
  }
  if (Mutation.data?.createUser) {
    const user = Mutation.data?.createUser;
    dispatch(register(user));
    toastDefault("Đăng kí thành công");
    navigate("/");
  }

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
      });
  };

  const loginFB = () => {
    toastError("Chức năng đang phát triển");
  };

  return (
    <div>
      <Row justify="center" style={{ height: 800 }}>
        <Col span={8}>
          <h2 style={{ margin: 40, textAlign: "center" }}>Đăng ký</h2>
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
