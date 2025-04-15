import { useMutation, useQuery } from '@apollo/client';
import { Button, Spin, Table } from 'antd';
import React, { useState } from 'react';
import { toastDefault } from '../../../common/toast';
import { deleteComment } from '../../../graphql-client/mutations';
import { getAllComments } from '../../../graphql-client/query';

interface Props {

}

const columns = [
    {
        title: 'Người bình luận',
        dataIndex: 'name',
    },
    {
        title: 'Nội dung',
        dataIndex: 'content',
    },
    {
        title: 'Sách',
        dataIndex: 'book',
    },
    {
        title: '',
        dataIndex: 'btn',
    }
];



const Book: React.FC = (props: Props) => {
    const { loading, error, data } = useQuery(getAllComments)
    const [add, Mutation] = useMutation<any>(deleteComment);
    const [page, setPage] = useState({current: 1, pageSize: 3})
    
    if (loading) {
        return <Spin size="large" />
    }
    if (error) {
        return <p>error book ...</p>
    }
    
    const data1: any[] | undefined = [];
    if(data?.comment.length > 0){
        for (let i = 0; i < data.comment.length; i++) {
            data1?.push({
                name: data.comment[i].user.name,
                content: data.comment[i].content,
                book: data.comment[i].book.name,
                btn: <Button onClick={() => onRemove(data.comment[i].id)}>Xóa bình luận</Button>
            });
        }
    }


    const onRemove = (id: any) => {
        if(window.confirm('Are you sure you want to remove')){
            add({
                variables: {id},
                refetchQueries: [{ query: getAllComments }]
            },)
            toastDefault('Xóa bình luận thành công')
        }
    }


    const handleTableChange = (pagination: any) => {
        setPage(pagination)
      };
    return (
        <Table onChange={handleTableChange} pagination={page} columns={columns} dataSource={data1} />
    )
}
export default Book