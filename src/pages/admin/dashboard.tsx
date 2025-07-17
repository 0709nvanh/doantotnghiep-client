import { Card, Row, Col, Spin } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useQuery } from '@apollo/client';
import { getBooks, getUsers, getGenres, getAuthors, getOrders } from '@/graphql-client/query.tsx';
import formatprice from '@/common/formatprice';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, UserOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: booksData, loading: loadingBooks } = useQuery(getBooks);
  const { data: usersData, loading: loadingUsers } = useQuery(getUsers);
  const { data: genresData, loading: loadingGenres } = useQuery(getGenres);
  const { data: authorsData, loading: loadingAuthors } = useQuery(getAuthors);
  const { data: ordersData, loading: loadingOrders } = useQuery(getOrders);

  if (loadingBooks || loadingUsers || loadingGenres || loadingAuthors || loadingOrders) {
    return <Spin size="large" />;
  }

  // Đếm số lượng
  const booksCount = booksData?.books?.length || 0;
  const usersCount = usersData?.users?.length || 0;
  const genresCount = genresData?.genres?.length || 0;
  const authorsCount = authorsData?.authors?.length || 0;

  // Tính doanh thu theo tháng
  const revenueByMonth: { [month: string]: number } = {};
  if (ordersData?.orders) {
    ordersData.orders.forEach((order: any) => {
      if (order.status !== 4) return; // chỉ tính đơn thành công
      const date = new Date(order.date);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      let total = 0;
      try {
        const listOrder = JSON.parse(order.listOrder);
        listOrder.forEach((item: any) => {
          total += item.quantity * item.book.price;
        });
      } catch { }
      if (!revenueByMonth[month]) revenueByMonth[month] = 0;
      revenueByMonth[month] += total;
    });
  }

  // Tính tỷ lệ sách theo thể loại
  const booksByGenre: { [genre: string]: number } = {};
  if (booksData?.books) {
    booksData.books.forEach((book: any) => {
      const genreName = book.genre?.name || 'Không phân loại';
      if (!booksByGenre[genreName]) booksByGenre[genreName] = 0;
      booksByGenre[genreName]++;
    });
  }

  const revenueData = {
    labels: Object.keys(revenueByMonth).sort(),
    datasets: [
      {
        label: 'Doanh thu',
        data: Object.keys(revenueByMonth).sort().map(month => revenueByMonth[month]),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const genreData = {
    labels: Object.keys(booksByGenre),
    datasets: [
      {
        data: Object.values(booksByGenre),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      },
    ],
  };

  // Tính doanh thu và số lượng bán cho từng sách
  const bookRevenueMap: { [bookId: string]: { name: string; revenue: number; quantity: number } } = {};
  if (ordersData?.orders) {
    ordersData.orders.forEach((order: any) => {
      if (order.status !== 4) return; // chỉ tính đơn thành công
      try {
        const listOrder = JSON.parse(order.listOrder);
        listOrder.forEach((item: any) => {
          const bookId = item.book.id;
          if (!bookRevenueMap[bookId]) {
            bookRevenueMap[bookId] = {
              name: item.book.name,
              revenue: 0,
              quantity: 0,
            };
          }
          bookRevenueMap[bookId].revenue += item.quantity * item.book.price;
          bookRevenueMap[bookId].quantity += item.quantity;
        });
      } catch { }
    });
  }

  // Lấy top 10 sách doanh thu cao nhất
  const topRevenueBooks = Object.values(bookRevenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  // Lấy top 10 sách bán được nhiều nhất
  const topSoldBooks = Object.values(bookRevenueMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  const topRevenueData = {
    labels: topRevenueBooks.map((b) => b.name),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: topRevenueBooks.map((b) => b.revenue),
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
    ],
  };

  const topSoldPieData = {
    labels: topSoldBooks.map((b) => b.name),
    datasets: [
      {
        label: 'Số lượng bán',
        data: topSoldBooks.map((b) => b.quantity),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const cardStyle = {
    cursor: 'pointer',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card
            title="Sách"
            style={cardStyle}
            onClick={() => navigate('/admin/books')}
            hoverable
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                {booksCount}
              </span>
              <BookOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} {...{}} style={{ fontSize: 48, color: '#1890ff' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Người dùng"
            style={cardStyle}
            onClick={() => navigate('/admin/user')}
            hoverable
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                {usersCount}
              </span>
              <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} {...{}} style={{ fontSize: 48, color: '#52c41a' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Thể loại"
            style={cardStyle}
            onClick={() => navigate('/admin/genre')}
            hoverable
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>
                {genresCount}
              </span>
              <TagsOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} {...{}} style={{ fontSize: 48, color: '#faad14' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Tác giả"
            style={cardStyle}
            onClick={() => navigate('/admin/authors')}
            hoverable
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>
                {authorsCount}
              </span>
              <TeamOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} {...{}} style={{ fontSize: 48, color: '#722ed1' }} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 32, alignContent: 'center', height: '100%' }}>
        <Col span={12}>
          <Card title="Biểu đồ doanh thu theo tháng" style={{ borderRadius: '12px' }}>
            <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Bar data={revenueData} options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context: any) {
                        return formatprice(context.parsed.y);
                      }
                    }
                  }
                }
              }} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tỷ lệ sách theo thể loại" style={{ borderRadius: '12px' }}>
            <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={genreData} options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context: any) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} sách (${percentage}%)`;
                      }
                    }
                  }
                }
              }} />
            </div>
          </Card>
        </Col>
      </Row>
      {/* Thêm 2 biểu đồ mới */}
      <Row gutter={16} style={{ marginTop: 32, alignContent: 'center', height: '100%' }}>
        <Col span={12}>
          <Card title="Top 10 sách doanh thu cao nhất" style={{ borderRadius: '12px' }}>
            <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Bar data={topRevenueData} options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context: any) {
                        return formatprice(context.parsed.y);
                      }
                    }
                  }
                },
                // Bar chart dọc (mặc định)
              }} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 10 sách bán được nhiều nhất" style={{ borderRadius: '12px' }}>
            <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={topSoldPieData} options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context: any) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} lượt bán (${percentage}%)`;
                      }
                    }
                  }
                }
              }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 