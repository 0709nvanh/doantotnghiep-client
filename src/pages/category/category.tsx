import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { getAuthors, getGenres, getBooks } from '../../graphql-client/query'
import { Avatar } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import formatprice from '../../common/formatprice';
import { List, Card, Spin, Pagination,Button, Col, Row, Typography, Empty    } from 'antd';

interface Props {
}

const Category = (props: Props) => {
    const [page1, setPage1] = useState(1);
    const [page2, setPage2] = useState(1);
    const { loading: loading1, error: error1, data: data1 } = useQuery(getAuthors);
    const { loading: loading2, error: error2, data: data2 } = useQuery(getGenres);
    const { loading: loading3, error: error3, data: data3 } = useQuery(getBooks);

    const [dataFilter, setDataFilter] = useState(() => {
        return data3?.books;
    });
    debugger;

    if (loading1 || loading2 || loading3) {
        return <Spin size="large" />
    }
    if (error2 || error1 || error3) {
        return <p>error book ...</p>
    }

    const handlePage1 = (page1: any) => {
        setPage1(page1)
    }

    let dataFilter1 = data1?.authors;
    const dataPage1 = []
    if (dataFilter1 && ((6 * page1) <= dataFilter1.length)) {
        for (let i = 6 * (page1 - 1); i < 6 * page1; i++) {
            dataPage1.push(dataFilter1[i])
        }
    } else {
        for (let i = 6 * (page1 - 1); i < dataFilter1.length; i++) {
            dataPage1.push(dataFilter1[i])
        }
    }


    const handlePage2 = (page2: any) => {
        setPage2(page2)
    }
    let dataFilter2 = data2?.genres;
    const dataPage2 = []
    if (dataFilter2 && ((6 * page2) <= dataFilter2.length)) {
        for (let i = 6 * (page2 - 1); i < 6 * page2; i++) {
            dataPage2.push(dataFilter2[i])
        }
    } else {
        for (let i = 6 * (page2 - 1); i < dataFilter2.length; i++) {
            dataPage2.push(dataFilter2[i])
        }
    }

    const addGenreFilter = (idGenre: any) => {
         setDataFilter(data3?.books.filter((item: any) => (
             item.genre && item.genre.id === idGenre
         )));
    }

    const addAuthorFilter = (idAuthor: any) => {
         setDataFilter(data3?.books.filter((item: any) => item?.author?.id === idAuthor))
    }
    debugger;
    return (
        <div>
            <div className="container"  style={{display: "flex"}}>
                <Col span={32}>
                    <div className="categories-title mt-5">
                        <h3 style={{ textAlign: 'left' }}>Tác giả</h3>
                    </div>
                    <List
                        dataSource={dataPage1}
                        renderItem={(author: any) => (
                        <List.Item>
                            <Button style={{ backgroundColor: '#f2f2f2', width: 250, height: 50, borderRadius: 10, fontSize: 20 }} onClick={() => addAuthorFilter(author.id)}>{author?.name}</Button>
                        </List.Item>
                        )}
                    />
                    <div className="pagination1" style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                        <Pagination onChange={handlePage1} pageSize={6} defaultCurrent={page1} total={dataFilter1.length} />
                    </div>

                    <div className="categories-title mt-5">
                        <h3 style={{ textAlign: 'left' }}>Thể loại</h3>
                    </div>
                    <List
                        dataSource={dataPage2}
                        renderItem={(genres: any) => (
                        <List.Item>
                            <Button style={{ backgroundColor: '#f2f2f2', width: 250, height: 50, borderRadius: 10, fontSize: 20 }} onClick={() => addGenreFilter(genres.id)}>{genres?.name}</Button>
                        </List.Item>
                        )}
                    />
                    <div className="pagination2" style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                        <Pagination onChange={handlePage2} pageSize={6} defaultCurrent={page2} total={dataFilter2.length} />
                    </div>

                    <div className="categories-title mt-5">
                        <h3 style={{ textAlign: 'left' }}>Sách</h3>
                    </div>
                </Col>
                <div style={{ height: 1000, overflow: 'auto', width: 2500}}>
                    {dataFilter?.length > 0 ? dataFilter?.map((book: any) => {
                        if(book?.id){
                            return (
                                <Col key={book.id} span={32} style={{boxSizing: 'border-box'}}>
                                    <Link to={ "/" + book?.author?.slug + "/" + book?.slug} className="mx-2">
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
                                    </Link>
                                </Col>
                            )
                        }
                        return null;
                    }) : (
                        <div style={{ padding: 10, border: "1px solid" , borderColor: '#ccc'}}> ----- Chưa có sách nào ------ <Empty /> </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Category
