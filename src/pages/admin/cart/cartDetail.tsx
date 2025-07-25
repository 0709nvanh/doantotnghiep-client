import { useQuery } from "@apollo/client";
import { Spin, Table } from "antd";
import { useParams } from "react-router-dom";
import formatprice from "@/common/formatprice";
import { getSingleOrder } from "@/graphql-client/query.tsx";

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
];

const CartDetail = () => {
  const { id } = useParams();

  const { loading, data: data1 } = useQuery(getSingleOrder, {
    variables: {
      id: id,
    },
  });
  const data: any[] | undefined = [];
  let listOrder = [];
  if (data1?.order?.listOrder) {
    listOrder = JSON.parse(data1.order.listOrder);
  }
  if (loading) {
    return <Spin size="large" />;
  }
  listOrder.forEach((orderItem: any) => {
    data.push({
      key: orderItem.id,
      bookName: orderItem.book.name,
      authorName: orderItem.book.author.name,
      image: <img width="80" src={orderItem.book.image} alt="" />,
      priceBook: formatprice(orderItem.book.price),
      quantity: (
        <div className="d-flex align-items-center justify-content-between">
          <span className="m-0 mx-2">{orderItem.quantity}</span>
        </div>
      ),
      totalBook: formatprice(orderItem.quantity * orderItem.book.price),
    });
  });
  return (
    <div className="giohang">
      <h3 className="my-4">Chi tiết đơn đặt</h3>
      <Table scroll={{ x: "max-content" }} columns={columns} dataSource={data} />
    </div>
  );
};

export default CartDetail;