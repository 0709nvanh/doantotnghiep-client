import { FundOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import {
    Button, Form,
    Input, Spin
} from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toastDefault } from '../../../common/toast';
import { addSingleGenre } from '../../../graphql-client/mutations';
import { getGenres, getBooks } from '../../../graphql-client/query';
import './form.css';
interface Props {

}


const Addauthor: React.FC = (props: Props) => {
    const navigate = useNavigate();
    const [add, Mutation] = useMutation<any>(addSingleGenre);
    const onFinish = (values: any) => {
        add(
            {
                variables: values,
                refetchQueries: [{ query: getGenres }, {query: getBooks}]
            },
        )
    };
    console.log(add);
    
    if (Mutation.loading) {
        return <Spin size="large" />
    }
    if (Mutation.data) {
        toastDefault('Thêm thể loại thành công')
        navigate('/admin/genre')
    }
    return (
        <div>
            <h2>Thêm thể loại</h2>
            <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.Item name="name" label="Tên thể loại" rules={[{ required: true, message: 'Bạn phải nhập tên thể loại' }]}>
                    <Input />
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

export default Addauthor