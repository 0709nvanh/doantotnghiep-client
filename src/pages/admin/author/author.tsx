import React, { useRef, useState } from "react";
import { Button, Input, Spin, Table, Modal } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { getAuthors, getBooks } from "@/graphql-client/query.tsx";
import { deleteAuthor } from "@/graphql-client/mutations.tsx";
import { toastDefault } from "@/common/toast.tsx";

const { Search } = Input;

const Author: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const { loading, error, data } = useQuery(getAuthors);
  const [add, Mutation] = useMutation<any>(deleteAuthor);
  const [page, setPage] = useState({ current: 1, pageSize: 10 });
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
      title: "Tác giả",
      dataIndex: "name",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
  ];
  const inputSearchRef = useRef<any>("");
  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <p>error authors ...</p>;
  }
  const start = () => {
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 1000);
  };
  if (Mutation.loading) {
    return <Spin size="large" />;
  }

  const data1: any[] | undefined = [];
  for (const element of data.authors) {
    if (element.name.includes(keySearch)) {
      data1.push({
        key: element.id,
        name: element.name,
        address: element.address,
        age: element.age,
      });
    }
  }

  const handleTableChange = (pagination: any) => {
    setPage(pagination);
  };

  const onSelectChange = (selectedRowKeys: any) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const onRemove = () => {
    Modal.confirm({
      title: "Xác nhận xóa tác giả",
      content:
        "Khi xóa tác giả, các tác phẩm của tác giả cũng bị xóa, bạn có muốn tiếp tục?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        console.log("id", selectedRowKeys);
        selectedRowKeys.forEach((id) => {
          add({
            variables: { id },
            refetchQueries: [{ query: getAuthors }, { query: getBooks }],
          });
        });
        setSelectedRowKeys([]);
        toastDefault("Xóa tác giả thành công");
      },
    });
  };

  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSearch = (value: string) => console.log(value);

  const handleChageSearch = () => {
    const search = inputSearchRef.current.input.value;
    setKeySearch(search);
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
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
        bordered
        className="mt-4"
        pagination={page}
        columns={columns}
        dataSource={data1}
      />
    </div>
  );
};
export default Author;
