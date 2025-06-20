import { useQuery } from "@apollo/client";
import { Col, Row, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import formatprice from "@/common/formatprice";
import { getBooks } from "@/graphql-client/query.tsx";
import "./about.css";

const AboutComponent = () => {
  const { loading, error, data } = useQuery(getBooks);
  console.log(data);

  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return <p>error book ...</p>;
  }
  const productPage = [];
  if (data?.books) {
    for (let i = 0; i < 4; i++) {
      productPage.push(data.books[i]);
    }
  }
  return (
    <div className="about">
      <div className="image-about">
        <img
          src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/12/banner1.jpg"
          alt=""
        />
      </div>
      <Row className="about-content" gutter={[16, 16]} justify="center" style={{maxWidth: 1200, width: '100%', margin: '20px auto', padding: '0 8px'}}>
        <Col xs={24} md={8} style={{marginBottom: 16}}>
          <div className="image">
            <div className="image-hover">
              <img
                src="http://skybooks.vn/wp-content/themes/skybooks/thumb.php?src=/wp-content/uploads/2022/04/71188313_3084274838280556_1740859818274455552_n.jpg&w=266&h=188&q=100"
                alt=""
              />
            </div>
          </div>
        </Col>
        <Col xs={24} md={8} style={{marginBottom: 16}}>
          <div className="image">
            <div className="image-hover">
              <img
                src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/12/banner2.jpg"
                alt=""
              />
            </div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <Row gutter={[8, 8]}>
            {productPage.length > 0 &&
              productPage.map((book) => {
                if (book?.id) {
                  return (
                    <Col
                      key={book.id}
                      xs={12}
                      style={{ boxSizing: "border-box", marginBottom: 8 }}
                    >
                      <Link
                        to={book?.author?.slug + "/" + book?.slug}
                        className="mx-2"
                      >
                        <img
                          width="100%"
                          height="auto"
                          src={JSON.parse(book.image)}
                          alt=""
                          style={{maxWidth: 150}}
                        />
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          {book.name}
                        </Typography.Title>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                          {formatprice(book.price)}
                        </Typography.Title>
                      </Link>
                    </Col>
                  );
                }
                return null;
              })}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AboutComponent;
