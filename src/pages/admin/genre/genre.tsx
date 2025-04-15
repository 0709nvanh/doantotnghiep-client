import React, { useState } from 'react'
import { Table, Button, Spin, Input} from 'antd';
import { useQuery, useMutation } from '@apollo/client';
import { getGenres, getBooks } from '../../../graphql-client/query';
import { deleteGenre } from '../../../graphql-client/mutations';
import { toastDefault } from '../../../common/toast';
const { Search } = Input
interface Props {

}

const columns = [
    {
        title: 'Thể loại',
        dataIndex: 'name',
    },
    {
        title: 'Tác phẩm tiêu biểu',
        dataIndex: 'books',
    },    
];



const Genre: React.FC = (props: Props) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
    const { loading: loading1, error: error1, data: data2 } = useQuery(getBooks)
    const { loading, error, data: data3 } = useQuery(getGenres)
    const [add, Mutation] = useMutation<any>(deleteGenre);
    const [keySearch, setKeySearch] = useState<string>('');
    const inputSearchRef = React.useRef<any>("");
    if (loading || loading1) {
        return <Spin size="large" />
    }
    if (error || error1) {
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

    const data1: any[] | undefined = [];
    for (let i = 0; i < data3?.genres.length; i++) {
        const m = data2.books.filter((item: any) => item?.genre?.id === data3.genres[i].id);
        if(data3.genres[i].name.includes(keySearch)){
            data1.push({
                key: data3.genres[i].id,
                name: data3.genres[i].name,
                books: m.map((item: any, index: number) => (
                    index <= 1 ?
                    <p key={item.id}>{item.name}</p> : '...'
                ))
            });
        }
    }

    const onSelectChange = (selectedRowKeys: any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
    };

    const onRemove = () => {
        if(window.confirm('Khi xóa thể loại, các tác phẩm của thể loại cũng bị xóa, bạn có muốn tiếp tục ?')){
            selectedRowKeys.forEach(id => {
                add({
                    variables: {id},
                    refetchQueries: [{ query: getGenres }, {query: getBooks}]
                },)
            })
            setSelectedRowKeys([])
            toastDefault('Xóa thể loại thành công');
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
            <div style={{ marginBottom: 16, padding: 20 }}>
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
export default Genre