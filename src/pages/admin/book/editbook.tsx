import { useMutation, useQuery } from '@apollo/client';
import {
    Button, Form,
    Input, Select, Spin
} from 'antd';
import {
    getDownloadURL, getStorage,
    ref, uploadBytes, uploadBytesResumable
} from "firebase/storage";
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../common/firebase/index';
import { toastDefault } from '../../../common/toast';
import { updateSingleBook } from '../../../graphql-client/mutations';
import { getAuthors, getBooks, getSingleBook, getGenres } from '../../../graphql-client/query';
import Uploadimage from '../uploadimage';
import './form.css';

const { Option } = Select;
interface Props {

}

const Editbook: React.FC = (props: Props) => {
    const {slug} = useParams();
    const { loading: loading1, error: error1, data: data1} = useQuery(getSingleBook, {
        variables: {
            slug: slug,
        }
    })
    debugger;
    const navigate = useNavigate();
    const [add, Mutation] = useMutation<any>(updateSingleBook);
    const [imageFile, setImageFile] = useState<any>([]);
    const uploadImageState = useCallback((image) => {
        setImageFile(image)
    }, [])
    const { loading, error, data } = useQuery(getAuthors)
    const { loading: loading2, error: error2, data: data2 } = useQuery(getGenres)
    if (loading || loading1) {
        return <Spin size="large" />
    }
    if (error || error1) {
        return <p>error authors ...</p>
    }
    
    const onFinish = async (values: any) => {
        values.price = Number(values.price)
        values.id = data1.book.id
        
        if(values.name === undefined) values.name = data1.book.name;
        if(values.des === undefined) values.des = data1.book.des;
        if(isNaN(values.price)) values.price = data1.book.price;
        if(values.quantity === undefined) values.quantity = data1.book.quantity;
        if(values.genreId === undefined) values.genreId = data1.book.genre.id;
        if(values.authorId === undefined) values.authorId = data1.book.author.id;
        if(values.image === undefined) values.image = data1.book.image;
        console.log(values);
        debugger;
        add(
            {
                variables: values,
                refetchQueries: [{ query: getBooks }]
            },
        )
    };

   
    if (Mutation.loading) {
        return <Spin size="large" />
    }
    if (Mutation.data) {
        toastDefault('Sửa sách thành công')
        navigate('/admin/books')
    }
    return (
        <div>
            <Form style={{ overflow: 'auto' }} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.Item name="name" label="Tên sách" >
                    <Input defaultValue={data1.book.name} />
                </Form.Item>
                <Form.Item name="des" label="Mô tả">
                    <Input defaultValue={data1.book.des} />
                </Form.Item>
                <Form.Item name="price" label="Giá tiền" >
                    <Input type="number" defaultValue={Number(data1.book.price)} />
                </Form.Item>
                <Form.Item name="quantity" label="Số lượng" >
                    <Input type="number" defaultValue={Number(data1.book.quantity)} />
                </Form.Item>
                <Form.Item name="genreId" label="Thể loại chuyện">
                    <Select defaultValue="lucy">
                        <Option value="lucy" disabled>Chọn thể loại</Option>
                        {data2?.genres.map((genre: any) => (<Option key={genre.id} value={genre.id}>{genre.name}</Option>))}
                    </Select>
                </Form.Item>
                <Form.Item name="authorId" label="Tác giả" >
                    <Select defaultValue="lucy">
                        <Option value="lucy" disabled>Chọn tác giả</Option>
                        {data.authors.map((author: any) => (<Option key={author.id} value={author.id}>{author.name}</Option>))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}


export default Editbook