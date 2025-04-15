import { useQuery } from '@apollo/client'
import { Button, Card, Pagination, Spin } from 'antd'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import formatprice from '../../common/formatprice'
import { getAuthors, getBooks } from '../../graphql-client/query'
import './index.css'
interface Props {

}
const { Meta } = Card;
const Shop = (props: Props) => {
    const { slugCate } = useParams();
    const [page, setPage] = useState(1);
    const { loading: loading1, error: error1, data: data1 } = useQuery(getAuthors)
    const [inputPrice, setInputPrice] = useState(0)
    const { loading, error, data } = useQuery(getBooks)
    if (loading || loading1) {
        return <Spin size="large" />
    }
    if (error || error1) {
        return <p>error authors ...</p>
    }

    const handlePage = (page: any) => {
        setPage(page)
    }

    const handleChangeInput = (e: any) => {
        setInputPrice(Number(e.target.value))
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
    
    return (
        <div>
            {/* End header-Bottom */}
            <div className="container">
                <div className="d-flex">
                    <div className="row col-3" style={{ height: 1300 }}>
                        <div className="d-grid">
                            {/* End Category */}
                            <div className="Filter mt-5">
                                <h3 style={{ textAlign: 'left' }}>LỌC THEO GIÁ</h3>
                                <div className="column column-50 mt-3">
                                    <input onChange={handleChangeInput} value={inputPrice} type="range" id="rangeField" min={0} max={1000000} />
                                </div>
                                <div className="d-flex align-items-center justify-content-between mt-5">
                                    <span style={{ fontSize: '18px', display: 'block', textAlign: 'left' }}>
                                        Price: {formatprice(inputPrice)} - {formatprice(1000000)}
                                    </span>
                                </div>
                            </div>
                            <div className="banner-shop mt-5">
                                <img src="https://skybook.woovina.net/demo-01/wp-content/uploads/2020/05/banner-shop.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-9 ps-5" style={{ height: 1300 }}>
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
                                                <span style={{ display: 'block', textAlign: 'left', fontSize: '20px' }} className="fw-bold">{formatprice(book.price)}</span>
                                            </div>
                                            <div className="description-detail mt-3">
                                                <span style={{ display: 'block', textAlign: 'left' }}>{book.des}</span>
                                            </div>
                                            <div className="addtocard-detail border-bottom mt-4 pb-2">
                                                <Link to={'/' + book?.author?.slug + "/" + book?.slug}>
                                                    <div className="d-flex ">
                                                        <p className="me-5"><Button type="primary">Xem chi tiết</Button> </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Kết thúc */}
                                </Card>
                            ))}

                        </div>
                    </div>
                </div>
                <div className="pagination" style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                    <Pagination onChange={handlePage} pageSize={3} defaultCurrent={page} total={dataFilter.length} />
                </div>
            </div>
        </div>
    )
}

export default Shop
