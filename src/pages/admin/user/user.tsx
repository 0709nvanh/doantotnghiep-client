import { useQuery } from "@apollo/client";
import { Button, Input, Spin, Table } from "antd";
import React, { useState } from "react";
import { getUsers } from "@/graphql-client/query.tsx";

const { Search } = Input;

const columns = [
  {
    title: "STT",
    dataIndex: "index",
    render: (_text: any, _record: any, index: number) => index + 1,
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
    title: "Avatar",
    dataIndex: "avatar",
  },
  {
    title: "Quyền",
    dataIndex: "role",
  },
];

const User: React.FC = () => {
  const { loading, error, data } = useQuery(getUsers);
  const [keySearch, setKeySearch] = useState<string>("");
  const inputSearchRef = React.useRef<any>("");
  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <p>error book ...</p>;
  }

  const data1: any[] | undefined = [];
  for (const element of data.users) {
    if (element.email.includes(keySearch)) {
      const showRole =
        element.role === 1 ? (
          <div>
            <Button type="primary">Admin</Button>
            {/* <Button type="primary" onClick={() => RemoveAdmin(data.users[i].id)}danger>Remove admin</Button> */}
          </div>
        ) : (
          <div>
            <Button type="default">User</Button>
            {/* <Button onClick={() => UpdateAdmin(data.users[i].id)} type="primary" danger>Update admin</Button> */}
          </div>
        );
      data1.push({
        key: element.id,
        name: element.name,
        email: element.email,
        avatar: <img src={element.avatar} width="100" alt="" />,
        role: showRole,
      });
    }
  }

  const onSearch = (value: string) => console.log(value);

  const handleChageSearch = () => {
    const search = inputSearchRef.current.input.value;
    setKeySearch(search);
  };
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
      <Table columns={columns} scroll={{ x: "max-content" }} dataSource={data1} />
    </div>
  );
};
export default User;
