import React, { useRef, useState } from "react";
import { Input, Spin, Table } from "antd";
import { useQuery } from "@apollo/client";
import { getAuthors } from "@/graphql-client/query.tsx";

const { Search } = Input;

const Author: React.FC = () => {
  const [keySearch, setKeySearch] = useState<string>("");
  const { loading, error, data } = useQuery(getAuthors);
  const [page, setPage] = useState({ current: 1, pageSize: 10 });
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_text: any, _record: any, index: number) => {
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
