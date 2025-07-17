import { getBooks, getGenres } from "@/graphql-client/query.tsx";
import { useQuery } from "@apollo/client";
import { Input, Spin, Table } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const { Search } = Input;

const columns = [
  {
    title: "STT",
    dataIndex: "index",
    render: (_text: any, _record: any, index: number) => index + 1,
  },
  {
    title: "Thể loại",
    dataIndex: "name",
  },
  {
    title: "Số lượng sách",
    dataIndex: "bookCount",
  },
  {
    title: "Tác phẩm tiêu biểu",
    dataIndex: "sampleBooks",
  },
];

const Genre: React.FC = () => {
  const { loading: loading1, error: error1, data: data2 } = useQuery(getBooks);
  const { loading, error, data: data3 } = useQuery(getGenres);
  const [keySearch, setKeySearch] = useState<string>("");
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const inputSearchRef = React.useRef<any>("");

  if (loading || loading1) {
    return <Spin size="large" />;
  }
  if (error || error1) {
    return <p>error authors ...</p>;
  }
  const data1: any[] | undefined = [];
  for (let i = 0; i < data3?.genres.length; i++) {
    const booksInGenre = data2.books.filter(
      (item: any) => item?.genre?.id === data3.genres[i].id,
    );

    if (data3.genres[i].name.includes(keySearch)) {
      data1.push({
        key: data3.genres[i].id,
        name: data3.genres[i].name,
        bookCount: booksInGenre.length,
        sampleBooks: booksInGenre.slice(0, 3).map((book: any) => book.name).join(", "),
        allBooks: booksInGenre, // Store all books for expand
      });
    }
  }

  const onSearch = (value: string) => console.log(value);

  const handleChageSearch = () => {
    const search = inputSearchRef.current.input.value;
    setKeySearch(search);
  };

  const handleExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.key]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.key));
    }
  };

  const expandedRowRender = (record: any) => {
    const columns = [
      { title: 'Tên sách', dataIndex: 'name', key: 'name' },
      { title: 'Tác giả', dataIndex: 'author', key: 'author', render: (author: any) => author?.name },
      { title: 'Giá', dataIndex: 'price', key: 'price', render: (price: number) => `${price.toLocaleString()} VNĐ` },
      { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    ];

    return (
      <div style={{ padding: '16px' }}>
        <h4>Danh sách tất cả sách trong thể loại "{record.name}"</h4>
        <Table
          columns={columns}
          dataSource={record.allBooks}
          pagination={false}
          size="small"
          scroll={{ x: "max-content" }}
          rowKey="id"
        />
      </div>
    );
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
        className="mb-4"
      />
      <Table
        bordered
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={data1}
        expandable={{
          expandedRowRender,
          onExpand: handleExpand,
          expandedRowKeys,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <UpOutlined
                onClick={e => onExpand(record, e)}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ) : (
              <DownOutlined
                onClick={e => onExpand(record, e)}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ),
        }}
      />
    </div>
  );
};

export default Genre;
