import { useMutation, useQuery } from "@apollo/client";
import { Button, Input, Spin, Table } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import formatprice from "@/common/formatprice";
import {
  deleteStatusOrder,
  updateSingleQuantityBook,
  updateStatusOrder,
} from "@/graphql-client/mutations.tsx";
import { getBooks, getOrders } from "@/graphql-client/query.tsx";

const { Search } = Input;



const CartAdmin = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const { loading, error, data } = useQuery(getOrders);
  const [add, Mutation] = useMutation<any>(updateStatusOrder);
  const [dele, Muta] = useMutation<any>(deleteStatusOrder);
  const [page, setPage] = useState({ current: 1, pageSize: 10 });
  const [updatequan, MuQuan] = useMutation<any>(updateSingleQuantityBook);
  const [keySearch, setKeySearch] = useState<string>("");
  const inputSearchRef = React.useRef<any>("");
  // const [add, Mutation] = useMutation<any>(deleteBook);
  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <p>error book ...</p>;
  }
  const start = () => {
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 1000);
  };
  const handleRemoveOrder = (_id: string) => {
    const orderDetail = data.orders;
    let listChoose = "";
    for (let i = 0; i <= orderDetail.length; i++) {
      if (orderDetail[i].id === _id) {
        listChoose = orderDetail[i].listOrder;
        break;
      }
    }
    console.log(listChoose);
    const _listOrder = JSON.parse(listChoose);
    for (let i = 0; i < _listOrder.length; i++) {
      const slmua = _listOrder[i].quantity;
      const idBook = _listOrder[i].book.id;

      updatequan({
        variables: { id: idBook, input: { count: 500 } },
        refetchQueries: [{ query: getBooks }],
      });
    }

    // if (window.confirm("Bạn có muốn hủy đơn hàng hay không ?")) {
    //     dele({
    //         variables: { _id },
    //         refetchQueries: [{ query: getOrders }]
    //     })
    // }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (text: any, record: any, index: number) => {
        // Calculate index based on current page
        return (page.current - 1) * page.pageSize + index + 1;
      },
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Số lượng",
      dataIndex: "orderCount",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Xem chi tiết",
      dataIndex: "cartDetail",
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPage(pagination);
  };
  const handleUpdateOrder = (id: string, status: number) => {
    add({
      variables: { id, status },
      refetchQueries: [{ query: getOrders }],
    });
  };

  const onSearch = (value: string) => console.log(value);

  const handleChageSearch = (e: any) => {
    const search = inputSearchRef.current.input.value;
    setKeySearch(search);
  };

  const showBtnStatus = (status: number, id: string) => {
    let html = null;
    if (status === 2) {
      html = (
        <div className="flex gap-2">
          <Button className="mb-2" onClick={() => handleRemoveOrder(id)} danger>
            Hủy đơn hàng
          </Button>
          <Button type="primary" onClick={() => handleUpdateOrder(id, status)}>
            Xác nhận đã gửi hàng
          </Button>
        </div>
      );
    } else if (status === 3) {
      html = (
        <div className="flex gap-2">
          <Button type="primary" disabled>
            Đang giao hàng
          </Button>
        </div>
      );
    } else if (status === 4) {
      html = (
        <div className="flex gap-2">
          <Button
            type="primary"
            disabled
            style={{ backgroundColor: "#0cc11a" }}
          >
            Thành công
          </Button>
        </div>
      );
    } else if (status === 5) {
      html = (
        <div className="flex gap-2">
          <Button danger disabled>
            Đơn hàng đã hủy
          </Button>
        </div>
      );
    } else {
      html = (
        <div className="flex gap-2">
          <Button className="mb-2" disabled type="primary">
            Chưa xác nhận
          </Button>
          <Button onClick={() => handleRemoveOrder(id)} danger>
            Hủy đơn hàng
          </Button>
        </div>
      );
    }
    return html;
  };

  const data1: any[] | undefined = [];
  for (let i = 0; i < data.orders.length; i++) {
    const listOrder = JSON.parse(data.orders[i].listOrder);
    let total = 0;
    listOrder.forEach((item: any) => {
      total += item.quantity * item.book.price;
    });
    if (data.orders[i].email.includes(keySearch)) {
      data1.push({
        key: data.orders[i].id,
        name: data.orders[i].name,
        email: data.orders[i].email,
        address: data.orders[i].address,
        phone: data.orders[i].phone,
        orderCount: listOrder.length,
        total: formatprice(total),
        status: showBtnStatus(data.orders[i].status, data.orders[i].id),
        cartDetail: (
          <Button type="primary">
            <Link to={"/admin/cartDetail/" + data.orders[i].id} className="text-white">
              Xem chi tiết
            </Link>
          </Button>
        ),
      });
    }
  }

  return (
    <div>
      <Search
        placeholder="Tìm kiếm theo email"
        allowClear
        size="large"
        onSearch={onSearch}
        onChange={handleChageSearch}
        ref={inputSearchRef}
      />
      <Table onChange={handleTableChange}
        pagination={page} className="mt-4" scroll={{ x: 'max-content' }} columns={columns} dataSource={data1} />
    </div>
  );
};

export default CartAdmin;
