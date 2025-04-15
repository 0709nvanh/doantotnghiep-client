import { useMutation, useQuery } from '@apollo/client';
import {
    Button, Form,
    Input, Spin
} from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toastDefault } from '../../../common/toast';
import { updateSingleAuthor } from '../../../graphql-client/mutations';

import { getAuthors, getSingleAuthor } from '../../../graphql-client/query';
import './form.css';
interface Props {
    
}

const Editauthor:React.FC = (props: Props) => {
    const navigate = useNavigate();
    const {slug} = useParams();
    const { loading, error, data} = useQuery(getSingleAuthor, {
        variables: {
            slug: slug,
        }
    })
    console.log(data)
    const [add, Mutation] = useMutation<any>(updateSingleAuthor);
   
    const onFinish = (values: any) => {
        values.phone = Number(values.phone)
        values.id = data.author.id
        console.log(values)
        add(
            {
                variables: values,
                refetchQueries: [{ query: getAuthors }]
            },
        )
    };

    
    if (Mutation.loading) {
        return <Spin size="large" />
    }
    if (Mutation.data) {
        toastDefault('Sửa tác giả thành công')
        navigate('/admin/authors')
    }

    if(loading){
        return <Spin size="large" />
    }

    return (
        <div>
            <h2>Sửa tác giả</h2>
            <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.Item name="name" label="Tên tác giả" rules={[{ required: true, message: 'Bạn phải nhập tên tác giả' }]}>
                    <Input defaultValue={data?.author.name} />
                </Form.Item>
                <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Bạn phải nhập tên tuổi' }]}>
                    <Input defaultValue={data?.author.age} />
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Bạn phải nhập địa chỉ' }]}>
                    <Input defaultValue={data?.author.address} />
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

export default Editauthor

