import { Pagination, Card, Spin,Button, Input, Form } from 'antd';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import './index.css';
import { useQuery } from '@apollo/client';
import {getComments, getBooks } from '../../graphql-client/query';
import { addComments } from '../../graphql-client/mutations';
import { useSelector } from 'react-redux';
interface Props {
    
}

const Blog = (props: Props) => {
    const [page, setPage] = useState(1);
    const [ bookIdSelect, setBookIdSelect] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [add, Mutation] = useMutation<any>(addComments);

    const user = useSelector((state: any) => state.auth.user);

    const { loading: loading1, error: error1, data: data1 } = useQuery(getComments, {
      variables: {
        bookId: bookIdSelect
      }
    });
    debugger;

    console.log("sadsadsa", data1);
    
    const [inputPrice, setInputPrice] = useState(0)
    const { loading, error, data } = useQuery(getBooks)
    if (loading) {
        return <Spin size="large" />
    }
    if (error) {
        return <p>error authors ...</p>
    }

    const handlePage = (page: any) => {
        setPage(page)
    }

    let dataFilter = data?.books;
    if (inputPrice > 0) {
        dataFilter = dataFilter.filter((data: any) => (inputPrice < data.price))
    }
    const dataPage = []
    if (dataFilter && 3 * page <= dataFilter.length) {
        for (let i = 3 * (page - 1); i < 3 * page; i++) {
            dataPage.push(dataFilter[i])
        }
    } else {
        for (let i = 3 * (page - 1); i < dataFilter.length; i++) {
            dataPage.push(dataFilter[i])
        }
    }

  const onFinish = (values: any) => {
    // alert("Chức năng đang phát triển");
    values.icon = 1;
    values.bookId = bookIdSelect;
    values.userId = user.id;
    add(
      {
        variables: values,
        refetchQueries: [{ query: getComments }]
      }
    )
  }

  console.log(dataPage);
  return (
  <div>   
      {/* End header-Bottom */}
        <div className="container mt-5">
          <div className="mt-5">
              {dataPage.length > 0 && dataPage.map((book: any) => (
                  <Card hoverable key={book.id} className="row col-12 mt-3 align-items-center d-flex">
                      {/* 1 sản phẩm */}
                      <div className="row">
                          <div className="col-4">
                              <img src={JSON.parse(book.image)[0]} alt="" width="200px" height="300px" style={{ objectFit: "cover" }} />
                          </div>
                          <div className="col-8">
                              <div className="mt-5">
                                  <h5 style={{ display: 'block', textAlign: 'left' }}>{book.name}</h5>
                              </div>
                              <div className="description-detail mt-3">
                                  <span style={{ display: 'block', textAlign: 'left' }}>{book.des}</span>
                              </div>
                        
                          </div>
                          <div className="d-flex">
                            <div className="pe-3" style={{ padding: 10, marginLeft: 80}}>
                            </div>
                          </div>
                      </div>
                      {/* Kết thúc */}
                        <div>
                          <Button onClick={() => setBookIdSelect(book.id)} style={{ fontSize: '16', fontWeight: 'bold', margin: 10 }}> Xem bình luận</Button>
                          {bookIdSelect === book.id && data1?.comments?.map((cmt: any) => (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div>
                                  <div style={{padding: '0 10px', fontSize: 16, fontWeight: 'bold'}}>Nguyễn Ngọc Dũng</div>
                                </div>
                              </div>
                              <div style={{ display: "flex"}}>
                                <div style={{ flex: 1, display: 'flex', padding: 20, borderRadius: 10, borderColor: '#fff', border: '1px solid', margin: 10}}>{cmt.content}</div>
                                <Button>Xóa</Button>
                              </div>
                            </>
                          ))}

                          {bookIdSelect === book.id &&
                          <div>
                            <div>Viết bình luận cho tác phẩm {book.name}</div>
                           <div style={{ display: 'flex', width: '100%' }}>
                           <Form style={{ width: "100%" }} onFinish={onFinish} autoComplete="off">
                              <Form.Item style={{ width: '100%' }} name="content" rules={[{ required: true, message: 'Bạn phải nhập bình luận' }]}>
                                  <Input />
                              </Form.Item>
                              <Form.Item>
                                  <Button type="primary" htmlType="submit">
                                      Bình luận
                                  </Button>
                              </Form.Item>
                            </Form>
                             <Button onClick={() => setBookIdSelect("")}>Đóng</Button>
                             </div>
                          </div>}
                          
                        </div>
                      
                     
                  </Card>
              ))}
              <div className="pagination" style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                <Pagination onChange={handlePage} pageSize={3} defaultCurrent={page} total={dataFilter.length} />
              </div>
          </div>
      </div>
    </div>
  )
}

export default Blog
