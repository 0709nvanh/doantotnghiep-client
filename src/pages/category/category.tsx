import { useState } from "react";
import { useQuery } from "@apollo/client";
import { getAuthors, getBooks, getGenres } from "../../graphql-client/query";
import { Button, Col, Empty, List, Pagination, Spin, Card } from "antd";
import { Link } from "react-router-dom";
import formatprice from "../../common/formatprice";

const Category = () => {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [activeAuthorFilter, setActiveAuthorFilter] = useState<string | null>(null);
  const [activeGenreFilter, setActiveGenreFilter] = useState<string | null>(null);
  
  const {
    loading: loading1,
    error: error1,
    data: data1,
  } = useQuery(getAuthors);
  const { loading: loading2, error: error2, data: data2 } = useQuery(getGenres);
  const { loading: loading3, error: error3, data: data3 } = useQuery(getBooks);

  const [dataFilter, setDataFilter] = useState(() => {
    return data3?.books;
  });

  if (loading1 || loading2 || loading3) {
    return <Spin size="large" />;
  }
  if (error2 || error1 || error3) {
    return <p>error book ...</p>;
  }

  const handlePage1 = (page1: any) => {
    setPage1(page1);
  };

  let dataFilter1 = data1?.authors;
  const dataPage1 = [];
  if (dataFilter1 && 6 * page1 <= dataFilter1.length) {
    for (let i = 6 * (page1 - 1); i < 6 * page1; i++) {
      dataPage1.push(dataFilter1[i]);
    }
  } else {
    for (let i = 6 * (page1 - 1); i < dataFilter1.length; i++) {
      dataPage1.push(dataFilter1[i]);
    }
  }

  const handlePage2 = (page2: any) => {
    setPage2(page2);
  };
  let dataFilter2 = data2?.genres;
  const dataPage2 = [];
  if (dataFilter2 && 6 * page2 <= dataFilter2.length) {
    for (let i = 6 * (page2 - 1); i < 6 * page2; i++) {
      dataPage2.push(dataFilter2[i]);
    }
  } else {
    for (let i = 6 * (page2 - 1); i < dataFilter2.length; i++) {
      dataPage2.push(dataFilter2[i]);
    }
  }

  const addGenreFilter = (idGenre: any) => {
    if (activeGenreFilter === idGenre) {
      // Nếu click lại vào button đang active thì bỏ filter
      setActiveGenreFilter(null);
      setDataFilter(data3?.books);
    } else {
      // Nếu click vào button mới thì áp dụng filter
      setActiveGenreFilter(idGenre);
      setActiveAuthorFilter(null); // Bỏ active author filter
      setDataFilter(
        data3?.books.filter(
          (item: any) => item.genre && item.genre.id === idGenre,
        ),
      );
    }
  };

  const addAuthorFilter = (idAuthor: any) => {
    if (activeAuthorFilter === idAuthor) {
      // Nếu click lại vào button đang active thì bỏ filter
      setActiveAuthorFilter(null);
      setDataFilter(data3?.books);
    } else {
      // Nếu click vào button mới thì áp dụng filter
      setActiveAuthorFilter(idAuthor);
      setActiveGenreFilter(null); // Bỏ active genre filter
      setDataFilter(
        data3?.books.filter((item: any) => item?.author?.id === idAuthor),
      );
    }
  };

  return (
    <div>
      <div className="container" style={{ display: "flex" }}>
        <Col span={32}>
          <div className="categories-title mt-5">
            <h3 style={{ textAlign: "left" }}>Tác giả</h3>
          </div>
          <List
            dataSource={dataPage1}
            renderItem={(author: any) => (
              <List.Item>
                <Button
                  type={activeAuthorFilter === author.id ? "primary" : "default"}
                  style={{
                    backgroundColor: activeAuthorFilter === author.id ? "#1890ff" : "#f2f2f2",
                    color: activeAuthorFilter === author.id ? "white" : "black",
                    width: 250,
                    height: 50,
                    borderRadius: 10,
                    fontSize: 20,
                  }}
                  onClick={() => addAuthorFilter(author.id)}
                >
                  {author?.name}
                </Button>
              </List.Item>
            )}
          />
          <div
            className="pagination1"
            style={{
              margin: "20px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              onChange={handlePage1}
              pageSize={6}
              defaultCurrent={page1}
              total={dataFilter1.length}
            />
          </div>

          <div className="categories-title mt-5">
            <h3 style={{ textAlign: "left" }}>Thể loại</h3>
          </div>
          <List
            dataSource={dataPage2}
            renderItem={(genres: any) => (
              <List.Item>
                <Button
                  type={activeGenreFilter === genres.id ? "primary" : "default"}
                  style={{
                    backgroundColor: activeGenreFilter === genres.id ? "#1890ff" : "#f2f2f2",
                    color: activeGenreFilter === genres.id ? "white" : "black",
                    width: 250,
                    height: 50,
                    borderRadius: 10,
                    fontSize: 20,
                  }}
                  onClick={() => addGenreFilter(genres.id)}
                >
                  {genres?.name}
                </Button>
              </List.Item>
            )}
          />
          <div
            className="pagination2"
            style={{
              margin: "20px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              onChange={handlePage2}
              pageSize={6}
              defaultCurrent={page2}
              total={dataFilter2.length}
            />
          </div>
        </Col>
        <div style={{ height: 1000, overflow: "auto", width: 2500, paddingLeft: 20, paddingRight: 20 }}>
          {dataFilter?.length > 0 ? (
            dataFilter?.map((book: any) => {
              if (book?.id) {
                return (
                  <Card 
                    key={book.id} 
                    hoverable 
                    className="row col-12 mt-3 align-items-center d-flex"
                    style={{ marginBottom: '20px' }}
                  >
                    <div className="row">
                      <div className="col-4">
                        <img
                          src={JSON.parse(book.image)[0]}
                          alt=""
                          width="200px"
                          height="300px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-8">
                        <div className="mt-5">
                          <h5 style={{ display: "block", textAlign: "left" }}>
                            {book.name}
                          </h5>
                        </div>
                        <div className="d-flex align-items-center">
                          <div id="rating" className="d-flex">
                            <i style={{ display: 'block', textAlign: 'left' }} className="fa fa-star active" />
                            <i style={{ display: 'block', textAlign: 'left' }} className="fa fa-star active" />
                            <i style={{ display: 'block', textAlign: 'left' }} className="fa fa-star active" />
                            <i style={{ display: 'block', textAlign: 'left' }} className="fa fa-star active" />
                            <i style={{ display: 'block', textAlign: 'left' }} className="fa fa-star active" />
                          </div>
                        </div>
                        <div className="price-detail mt-3">
                          <span style={{ display: 'block', textAlign: 'left', fontSize: '20px' }} className="fw-bold">
                            {formatprice(book.price)}
                          </span>
                        </div>
                        <div className="description-detail mt-3">
                          <span style={{ display: "block", textAlign: "left" }}>
                            {book.des}
                          </span>
                        </div>
                        {/* Thêm tác giả */}
                        <div className="author-detail mt-3">
                          <span style={{ display: 'block', textAlign: 'left', fontSize: '16px' }}>
                            <strong>Tác giả:</strong> {book.author?.name}
                          </span>
                        </div>
                        {/* Thêm thể loại */}
                        <div className="genre-detail mt-2">
                          <span style={{ display: 'block', textAlign: 'left', fontSize: '16px' }}>
                            <strong>Thể loại:</strong> {book.genre?.name}
                          </span>
                        </div>
                        <div className="addtocard-detail mt-4 pb-2">
                          <Link to={"/" + book?.author?.slug + "/" + book?.slug}>
                            <div className="d-flex ">
                              <p className="me-5"><Button type="primary">Xem chi tiết</Button> </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }
              return null;
            })
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <Empty
                description={
                  <span style={{ fontSize: '16px', color: '#666' }}>
                    Chưa có sách nào
                  </span>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
