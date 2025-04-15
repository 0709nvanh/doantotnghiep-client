import React from 'react'

interface Props {
    
}

const Concact = (props: Props) => {
    return (
        <div style={{padding: 100, fontSize: 30}}>
            <h5>Thông tin liên hệ</h5>
                <p>Tên cửa hàng: Cửa hàng sách SkyBooks</p>
                <p>Địa chỉ:  Số 83 Lý Nam Đế, Phường Cửa Đông, Hoàn Kiếm, Hà Nội</p>
                <p>Số điện thoại: 024 3843 8220</p>
                <p>Website: <a target="_blank" rel="noreferrer" href="http://skybooks.vn/">http://skybooks.vn/</a></p>
        </div>
    )
}

export default Concact
