import { Carousel } from 'antd';
import React from 'react';

interface Props {

}

const CarouselComponent = (props: Props) => {
    return (
        <Carousel autoplay>
            <div>
                <img style={{width: '100%', height: '400px', objectFit: 'cover'}} src="http://amovietnam.vn/wp-content/uploads/2016/02/banner-doc-sach-vi-tuong-lai-amo-vietnam-2018.jpg" alt="" />
            </div>
            <div>
                <img style={{width: '100%', height: '400px', objectFit: 'cover'}} src="https://thaihabooks.com/wp-content/uploads/2019/09/banner-sach-ma_i-thang-9-2019-01.jpg" alt="" />
            </div>
            <div>
                <img style={{width: '100%', height: '400px', objectFit: 'cover'}} src="https://thaihabooks.com/wp-content/uploads/2019/10/Banner-FB-T10-1.jpg" alt="" />
            </div>
        </Carousel>
    )
}

export default CarouselComponent
