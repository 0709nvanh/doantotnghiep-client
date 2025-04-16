import React, { useRef, useState } from "react";
import { Button, Input, Spin, Table } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { getAuthors, getBooks } from "@/graphql-client/query.tsx";
import { deleteAuthor } from "@/graphql-client/mutations.tsx";
import { toastDefault } from "@/common/toast.tsx";

const { Search } = Input;

const columns = [
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

const Author: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [keySearch, setKeySearch] = useState<string>("");
  const { loading, error, data } = useQuery(getAuthors);
  const [add, Mutation] = useMutation<any>(deleteAuthor);
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

  const onSelectChange = (selectedRowKeys: any) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const onRemove = () => {
    if (
      window.confirm(
        "Khi xóa tác giả, các tác phẩm của tác giả cũng bị xóa, bạn có muốn tiếp tục ?",
      )
    ) {
      console.log("id", selectedRowKeys);
      selectedRowKeys.forEach((id) => {
        add({
          variables: { id },
          refetchQueries: [{ query: getAuthors }, { query: getBooks }],
        });
      });
      setSelectedRowKeys([]);
      toastDefault("Xóa tác giả thành công");
    }
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
      <div style={{ marginBottom: 16, paddingTop: 30 }}>
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={false}
        >
          Bỏ chọn
        </Button>
        <Button
          danger
          style={{ marginLeft: 20 }}
          type="primary"
          onClick={onRemove}
          disabled={!hasSelected}
          loading={false}
        >
          Xóa
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data1} />
    </div>
  );
};
export default Author;
