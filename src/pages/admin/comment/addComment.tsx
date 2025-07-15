import { useMutation, useQuery } from "@apollo/client";
import { Button, Spin, Table, Modal } from "antd";
import React, { useState } from "react";
import { toastDefault } from "@/common/toast";
import { deleteComment } from "@/graphql-client/mutations.tsx";
import { getAllComments } from "@/graphql-client/query.tsx";



const Book: React.FC = () => {
  const { loading, error, data } = useQuery(getAllComments);
  const [add] = useMutation<any>(deleteComment);
  const [page, setPage] = useState({ current: 1, pageSize: 10 });
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (text: any, record: any, index: number) => index + 1,
    },
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
        name: element.user?.name,
        content: element.content,
        book: element.book?.name,
        btn: (
          <Button onClick={() => onRemove(element.id)}>Xóa bình luận</Button>
        ),
      });
    }
  }

  const onRemove = (id: any) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bình luận này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        add({
          variables: { id },
          refetchQueries: [{ query: getAllComments }],
        });
        toastDefault("Xóa bình luận thành công");
      },
    });
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination);
  };

  return (
    <Table
      onChange={handleTableChange}
      pagination={page}
      scroll={{ x: "max-content" }}
      columns={columns}
      dataSource={data1}
    />
  );
};

export default Book;
