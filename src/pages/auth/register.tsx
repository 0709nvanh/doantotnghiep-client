import { useMutation } from '@apollo/client';
import { Button, Col, Input, Row, Spin, Form } from 'antd';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import React, { useRef } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import '../../common/firebase/index';
import { toastDefault } from '../../common/toast';
import { toastError } from '../../common/toasterror'
import { login, register } from '../../features/auths/authSlice';
import { signIn } from "../../graphql-client/mutations";
import { getUserQuery } from "../../graphql-client/query";
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
  const dispatch = useDispatch()
  const refInputEmail = useRef<any>("");
  const refInputPassword = useRef<any>("");
  const refInputUserName = useRef<any>("");
  const [add, Mutation] = useMutation<any>(signIn);
  if (Mutation.loading) {
      return <Spin size="large" />
  }
  if (Mutation.data?.createUser) {
      const user = Mutation.data?.createUser;
      dispatch(register(user))
      toastDefault('Đăng kí thành công')
      navigate('/')
  }

  //   facebook
  const handleFbLogin = () => {
    signInWithPopup(auth, provider1)
      .then((result) => {
        const user = result.user;
        const credential: any = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        if (user) {
          const { displayName, email, photoURL, uid } = user;
          const newUser = {
            name: displayName, email, avatar: photoURL, password: uid
          };
          localStorage.setItem("user", JSON.stringify(newUser));
          localStorage.setItem("token", JSON.stringify(token));
          add(
            {
                variables: newUser,
            },
          )
        }
      })
      .catch((error) => {
        console.log(error)
      });
  };

  //   google
  const handleGgLogin = () => {
    signInWithPopup(auth, provider2)
      .then((result) => {
        const credential:any = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const { displayName, email, photoURL, uid } = user;
        if (displayName && email) {
          const newUser = {
            name: displayName, email, avatar: photoURL, password: uid
          };
          add(
            {
                variables: newUser,
                refetchQueries: [{ query:  getUserQuery}]
            },
          )
        }else{
          navigate("/login")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   email

  const onFinish = (values: any) => {
    const newUser = { email: values.email, password: values.password , avatar: null, name: values.name }
    dispatch(login(newUser))
    add(
      {
        variables: newUser,
        refetchQueries: [{ query: getUserQuery }]
      },
    )
    toastDefault("Đăng ký thành công");
  };

  const loginFB = () => {
    toastError("Chức năng đang phát triển")
  }

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
          <Button
            style={{ width: "100%", marginBottom: 10 }}
            onClick={loginFB}
          >
            Đăng ký bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}

Register.propTypes = {};

export default Register;
