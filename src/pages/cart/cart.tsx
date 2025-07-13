import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Form, Input, Spin, Table, Modal } from "antd";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import formatprice from "@/common/formatprice";
import { toastDefault } from "@/common/toast";
import {
  decreaseCart,
  increaseCart,
  removeCart,
  loadUserCart,
} from "@/features/cart/cartSlide";
import { addNotification } from "@/features/notifications/notificationSlide";
import { createOrder } from "@/graphql-client/mutations";
import { getOrderByEmail } from "@/graphql-client/query";
import "./cart.css";
import { toastError } from "@/common/toasterror";

const columns = [
  {
    title: "Tên sản phẩm",
    dataIndex: "bookName",
  },
  {
    title: "Tác giả",
    dataIndex: "authorName",
  },
  {
    title: "Ảnh sách",
    dataIndex: "image",
  },
  {
    title: "Giá tiền",
    dataIndex: "priceBook",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalBook",
  },
  {
    title: "Xóa",
    dataIndex: "delete",
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useSelector((state: any) => state.auth.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const dispatch = useDispatch();
  const carts = useSelector((state: any) => state.cart.carts);
  const [total, setTotal] = useState(0);
  const [add, Mutation] = useMutation<any>(createOrder);
  const hasShownToast = useRef(false);

  // Check if user is logged in
  useEffect(() => {
    if (!user?.id) {
      toastError("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/login");
      return;
    }
    // Load user's cart when component mounts
    dispatch(loadUserCart(user.id));
  }, [user?.id, dispatch, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    form.setFieldsValue(user);
  }, [form, user]);

  useEffect(() => {
    if (Mutation.data?.createOrder && !hasShownToast.current) {
      dispatch(addNotification({ order: Mutation.data?.createOrder, userId: user?.id }));
      hasShownToast.current = true;
    }
  }, [Mutation.data, dispatch, user?.id]);

  useEffect(() => {
    hasShownToast.current = false;
  }, []);

  const start = () => {
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 1000);
  };

  if (Mutation.loading) {
    return <Spin size="large" />;
  }

  // Show login requirement if not logged in
  if (!user?.id) {
    return (
      <div className="giohang">
        <h3 className="my-4">Giỏ hàng</h3>
        <div className="text-center my-5">
          <h4>Vui lòng đăng nhập để xem giỏ hàng</h4>
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const data: any[] | undefined = [];
  for (const element of carts) {
    data.push({
      key: element,
      bookName: element.book.name,
      authorName: element.book.author.name,
      image: <img width="80" src={element.book.image} alt="" />,
      priceBook: formatprice(element.book.price),
      quantity: (
        <div className="d-flex align-items-center justify-content-between">
          <Button
            danger
            type="primary"
            onClick={() => dispatch(decreaseCart({ bookId: element.book.id, userId: user.id }))}
            loading={false}
          >
            -
          </Button>
          <span className="m-0 mx-2">{element.quantity}</span>
          <Button
            type="primary"
            onClick={() => dispatch(increaseCart({ bookId: element.book.id, userId: user.id }))}
            loading={false}
          >
            +
          </Button>
        </div>
      ),
      totalBook: formatprice(element.quantity * element.book.price),
      delete: (
        <Button type="primary" onClick={() => remove(element.book.id)} danger>
          <DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        </Button>
      ),
    });
  }

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);

    setTotal(() => {
      let dem = 0;
      selectedRowKeys.forEach((cart: any) => {
        dem += cart.quantity * cart.book.price;
      });
      return dem;
    });
  };

  const remove = (id: String) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        dispatch(removeCart({ bookId: id, userId: user.id }));
        toastDefault("Xóa thành công");
      },
    });
  };

  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onFinish = (values: any) => {
    const regExp = /[a-zA-Z]/g;
    if (regExp.test(values.phone) || Number(values.phone) > 2147483647) {
      toastError("Số điện thoại chưa đúng ");
    } else {
      values.phone = Number(values.phone);
      const data = {
        ...values,
        listOrder: JSON.stringify(selectedRowKeys),
        status: 1,
      };
      selectedRowKeys.forEach((cart: any) => {
        dispatch(removeCart({ bookId: cart.book.id, userId: user.id }));
      });
      setTotal(0);
      add({
        variables: data,
        refetchQueries: [
          { query: getOrderByEmail, variables: { email: user?.email } },
        ],
      }).catch((res) => {
        const errors = res.graphQLErrors.map((error: any) => error.message);
        toastError(`Đặt hàng thất bại số điện thoại chưa đúng! ${errors}`);
      });
      setSelectedRowKeys([]);
      setTimeout(() => {
        toastDefault("Đặt hàng thành công");
      }, 1000);
    }
  };

  return (
    <div className="giohang">
      <h3 className="my-4">Giỏ hàng</h3>
      {carts.length === 0 ? (
        <div className="text-center my-5">
          <h4>Giỏ hàng trống</h4>
          <Button type="primary" onClick={() => navigate("/shop")}>
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16, marginTop: 16 }}>
            <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={false}
            >
              Bỏ chọn
            </Button>

            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </div>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
          <div className="muahang d-flex align-items-center justify-content-between my-3">
            <div className="cart-total">
              Tổng tiền:{" "}
              <span style={{ fontWeight: "bold", color: "red" }}>
                {formatprice(total)}
              </span>
            </div>
          </div>
          <Form
            form={form}
            name="basic"
            className="mx-5"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="name"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input your address!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <Input type="phone" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                htmlType="submit"
                danger
                style={{ marginLeft: 20 }}
                type="primary"
                disabled={!hasSelected}
                loading={false}
              >
                Đặt hàng
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default Cart;
