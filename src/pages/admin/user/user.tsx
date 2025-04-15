import { useMutation, useQuery } from '@apollo/client';
import { Button, Spin, Table, Input } from 'antd';
import React, { useState } from 'react';
import { deleteBook } from '../../../graphql-client/mutations';
import { getUsers } from '../../../graphql-client/query';
const { Search } = Input

interface Props {

}

const columns = [
    {
        title: 'Tên khách hàng',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Avatar',
        dataIndex: 'avatar',
    },
    {
        title: 'Quyền',
        dataIndex: 'role',
    },    
];



const User: React.FC = (props: Props) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
    const { loading, error, data } = useQuery(getUsers)
    const [keySearch, setKeySearch] = useState<string>('');
    const inputSearchRef = React.useRef<any>("");
    if (loading) {
        return <Spin size="large" />
    }
    if (error) {
        return <p>error book ...</p>
    }
    const start = () => {
        setTimeout(() => {
            setSelectedRowKeys([]);
        }, 1000);
    };

    console.log(data);
    
    const data1: any[] | undefined = [];
    for (let i = 0; i < data.users.length; i++) {
        if(data.users[i].email.includes(keySearch)) {
            const showRole = data.users[i].role === 1 ? <div>   
            <Button type="primary" disabled>Admin</Button>
            {/* <Button type="primary" onClick={() => RemoveAdmin(data.users[i].id)}danger>Remove admin</Button> */}
            </div> : <div>
                <Button type="primary" disabled>User</Button>
                {/* <Button onClick={() => UpdateAdmin(data.users[i].id)} type="primary" danger>Update admin</Button> */}
            </div>
            data1.push({
                key: data.users[i].id,
                name: data.users[i].name,
                email: data.users[i].email,
                avatar: <img src={data.users[i].avatar} width="100" alt="" />,
                role: showRole
            });
        }
    }

    const onSelectChange = (selectedRowKeys: any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
    };

    const RemoveAdmin = (id: String) => {
        if(window.confirm('Bạn có muốn bỏ quyền admin không?')){
            console.log(id);
            // toastDefault('Xóa sách thành công')
        }
    }
    const UpdateAdmin = (id: String) => {
        if(window.confirm('Bạn có muốn thêm quyền admin không?')){
            console.log(id);
            // toastDefault('Xóa sách thành công')
        }
    }

    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onSearch = (value: string) => console.log(value);

    const handleChageSearch = (e: any) => {
        const search = inputSearchRef.current.input.value;
        setKeySearch(search);
    }
    return (
        <div>
             <Search
                placeholder="Tìm kiếm theo email"
                allowClear
                size="large"
                onSearch={onSearch}
                onChange={handleChageSearch}
                ref={inputSearchRef}
            />
            <div style={{ marginBottom: 16, padding: 20 }}>
                <Button type="primary" onClick={start} disabled={!hasSelected} loading={false}>
                    Bỏ chọn
                </Button>
                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data1} />
        </div>
    )
}
export default User