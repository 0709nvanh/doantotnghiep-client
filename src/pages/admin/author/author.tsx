import React, { useState, useRef } from 'react'
import { Table, Button, Spin, Input} from 'antd';
import { useQuery, useMutation } from '@apollo/client';
import { getAuthors, getBooks } from '../../../graphql-client/query';
import { Link } from 'react-router-dom';
import { deleteAuthor } from '../../../graphql-client/mutations';
import { toastDefault } from '../../../common/toast';
const { Search } = Input;

interface Props {

}

const columns = [
    {
        title: 'Tác giả',
        dataIndex: 'name',
    },
    {
        title: 'Tuổi',
        dataIndex: 'age',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
    },    
];



const Author: React.FC = (props: Props) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
    const [keySearch, setKeySearch] = useState<string>('');
    const { loading, error, data } = useQuery(getAuthors)
    const [add, Mutation] = useMutation<any>(deleteAuthor);
    const inputSearchRef = useRef<any>("");
    if (loading) {
        return <Spin size="large" />
    }
    if (error) {
        return <p>error authors ...</p>
    }
    const start = () => {
        setTimeout(() => {
            setSelectedRowKeys([]);
        }, 1000);
    };
    if (Mutation.loading) {
        return <Spin size="large" />
    }
    // if (Mutation.loading) {
    //     toastDefault('Xóa tác giả thành công')
    // }

    const data1: any[] | undefined = [];
    for (let i = 0; i < data.authors.length; i++) {
        if(data.authors[i].name.includes(keySearch)){
            const link = '/admin/editauthor/' + data.authors[i].slug
            data1.push({
                key: data.authors[i].id,
                name: data.authors[i].name,
                address: data.authors[i].address,
                age: data.authors[i].age,
            });
        }
    }

    const onSelectChange = (selectedRowKeys: any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
    };

    const onRemove = () => {
        if(window.confirm('Khi xóa tác giả, các tác phẩm của tác giả cũng bị xóa, bạn có muốn tiếp tục ?')){
            console.log('id', selectedRowKeys)
            selectedRowKeys.forEach(id => {
                add({
                    variables: {id},
                    refetchQueries: [{ query: getAuthors }, {query: getBooks}]
                },)
            })
            setSelectedRowKeys([])
            toastDefault('Xóa tác giả thành công')
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
                placeholder="Tìm kiếm"
                allowClear
                size="large"
                onSearch={onSearch}
                onChange={handleChageSearch}
                ref={inputSearchRef}
            />
            <div style={{ marginBottom: 16, paddingTop: 30 }}>
                <Button type="primary" onClick={start} disabled={!hasSelected} loading={false}>
                    Bỏ chọn
                </Button>
                <Button danger style={{ marginLeft: 20}} type="primary" onClick={onRemove} disabled={!hasSelected} loading={false}>
                    Xóa
                </Button>
                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data1} />
        </div>
    )
}
export default Author