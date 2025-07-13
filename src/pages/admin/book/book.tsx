import { useMutation, useQuery } from "@apollo/client";
import { Button, Input, Spin, Table, Modal } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import formatprice from "@/common/formatprice";
import { toastDefault } from "@/common/toast.tsx";
import { deleteBook } from "@/graphql-client/mutations.tsx";
import { getBooks } from "@/graphql-client/query.tsx";
import "./form.css";

const { Search } = Input;

const Book: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const { loading, error, data } = useQuery(getBooks);
  const [add, Mutation] = useMutation<any>(deleteBook);
  const [page, setPage] = useState({ current: 1, pageSize: 5 });
  const inputSearchRef = React.useRef<any>("");
  if (Mutation.loading) {
    return <Spin size="large" />;
  }
  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <p>error book ...</p>;
  }
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
      title: "Tên sách",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Thể loại truyện",
      dataIndex: "genre",
      width: 200,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      width: 200,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "des",
      width: 400,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 200,
    },
    {
      title: "Tên tác giả",
      dataIndex: "author",
      width: 200,
    },
    {
      title: "Action",
      dataIndex: "btnEdit",
      width: 200,
    },
  ];
  const data1: any[] | undefined = [];
  if (data?.books.length > 0) {
    for (let i = 0; i < data.books.length; i++) {
      const link = "/admin/editbook/" + data.books[i].slug;
      const image = JSON.parse(data.books[i].image)[0];

      const author = data?.books[i].author?.name;
      if (data.books[i].name.includes(keySearch)) {
        data1?.push({
          key: data.books[i].id,
          name: data.books[i].name,
          genre: data.books[i].genre?.name,
          price: formatprice(data.books[i].price),
          image: (
            <img
              width="150"
              height="200"
              src={image}
              style={{ objectFit: "cover" }}
              alt=""
            />
          ),
          quantity: data.books[i].quantity,
          des: <div className={"text-des-book"}>{data.books[i].des}</div>,
          author: author,
          btnEdit: (
            <Button type="primary">
              <Link to={link}>Sửa sản phẩm</Link>
            </Button>
          ),
        });
      }
    }
  }

  const onSearch = (value: string) => console.log(value);

  const handleChageSearch = () => {
    const search = inputSearchRef.current.input.value;
    setKeySearch(search);
  };

  const onSelectChange = (selectedRowKeys: any) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const onRemove = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} sách đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        selectedRowKeys.forEach((id) => {
          add({
            variables: { id },
            refetchQueries: [{ query: getBooks }],
          });
        });
        setSelectedRowKeys([]);
        toastDefault("Xóa sách thành công");
      },
    });
  };

  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination);
  };
  return (
    <div>
      <Search
        placeholder="Tìm kiếm"
        allowClear
        size="large"
        onSearch={onSearch}
        onChange={handleChageSearch}
        ref={inputSearchRef}
      />
      <Table
        className="mt-4"
        bordered
        onChange={handleTableChange}
        pagination={page}
        columns={columns}
        dataSource={data1}
      />
    </div>
  );
};
export default Book;
