import { useMutation, useQuery } from "@apollo/client";
import { Button, Spin, Table } from "antd";
import React, { useState } from "react";
import { toastDefault } from "@/common/toast";
import { deleteComment } from "@/graphql-client/mutations.tsx";
import { getAllComments } from "@/graphql-client/query.tsx";

const columns = [
  {
    title: "Người bình luận",
    dataIndex: "name",
  },
  {
    title: "Nội dung",
    dataIndex: "content",
  },
  {
    title: "Sách",
    dataIndex: "book",
  },
  {
    title: "",
    dataIndex: "btn",
  },
];

const Book: React.FC = () => {
  const { loading, error, data } = useQuery(getAllComments);
  const [add] = useMutation<any>(deleteComment);
  const [page, setPage] = useState({ current: 1, pageSize: 3 });

  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <p>error book ...</p>;
  }

  const data1: any[] | undefined = [];
  if (data?.comment.length > 0) {
    for (const element of data.comment) {
      data1?.push({
        name: element.user.name,
        content: element.content,
        book: element.book.name,
        btn: (
          <Button onClick={() => onRemove(element.id)}>Xóa bình luận</Button>
        ),
      });
    }
  }

  const onRemove = (id: any) => {
    if (window.confirm("Are you sure you want to remove")) {
      add({
        variables: { id },
        refetchQueries: [{ query: getAllComments }],
      });
      toastDefault("Xóa bình luận thành công");
    }
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination);
  };
  return (
    <Table
      onChange={handleTableChange}
      pagination={page}
      columns={columns}
      dataSource={data1}
    />
  );
};
export default Book;
