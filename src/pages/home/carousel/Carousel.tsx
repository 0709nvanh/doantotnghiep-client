import { Carousel } from 'antd';
import banner1 from '../../../assets/images/banner1.jpg'
import banner2 from '../../../assets/images/banner2.jpg'
import banner3 from '../../../assets/images/banner3.webp'
const CarouselComponent = () => {
    return (
        <Carousel autoplay>
            <div>
                <img style={{ width: '100%', height: '400px', objectFit: 'cover' }} src={banner1} alt="" />
            </div>
            <div>
                <img style={{ width: '100%', height: '400px', objectFit: 'cover' }} src={banner2} alt="" />
            </div>
            <div>
                <img style={{ width: '100%', height: '400px', objectFit: 'cover' }} src={banner3} alt="" />
            </div>
        </Carousel>
    )
}

export default CarouselComponent
