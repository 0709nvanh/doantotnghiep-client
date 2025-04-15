import { useQuery } from '@apollo/client';
import { Spin } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../../../graphql-client/query';
import './index.css';
interface Props {
    page: number;
}

const ProductComponent = (props: Props) => {
    const {page} = props;
    const { loading, error, data } = useQuery(getBooks)
    console.log(data);

    if (loading) {
        return <Spin size="large" />
    }
    if (error) {
        return <p>error book ...</p>
    }
    const productPage = [];
    if(data?.books){
        for (let i = page*4; i < 4 + page*4; i++) {
            productPage.push(data.books[i])
        }
    }

   
    

    return (
        <div className="" style={{width: '100%'}}>
            <div className="component-product">
                <ul className="align">
                    {/* 1 sản phẩm */}
                    {
                        data && productPage.map((book: any) => {
                            if(book?.id){
                                return (
                                
                                    <li key={book.id}>
                                        <figure className="book">
                                            <ul className="hardcover_front">
                                                <li>
                                                    <img src={JSON.parse(book.image)} alt="" width="100%" height="100%" />
                                                </li>
                                                <li />
                                            </ul>
                                            <ul className="page">
                                                <li />
                                                <li>
                                                    <Link to={book?.author?.slug + "/" + book?.slug} className="btn">Xem chi tết</Link>
                                                </li>
                                                <li />
                                                <li />
                                                <li />
                                            </ul>
                                            <ul className="hardcover_back">
                                                <li />
                                                <li />
                                            </ul>
                                            <ul className="book_spine">
                                                <li />
                                                <li />
                                            </ul>
                                            <figcaption>
                                                <h1>{book?.name}</h1>
                                                <span>By {book?.author?.name}</span>
                                                <p className="muti-text" style={{color: "white"}}>
                                                    {book?.des}
                                                </p>
                                            </figcaption>
                                        </figure>
                                    </li>
                                )
                            }else{
                                return null;
                            }
                            
                        })
                    }

                    {/* hết 1 sản phẩm*/}
                </ul>
            </div>
        </div>
    )
}

export default ProductComponent
