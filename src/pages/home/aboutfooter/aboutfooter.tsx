import { Row, Typography } from 'antd';
import React from 'react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
// import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import './aboutfooter.css';

interface Props {

}

const Aboutfooter = (props: Props) => {
    return (
        <Row>
            <Typography.Title level={2} style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px auto' }}>
                LATEST FROM OUR BLOG
            </Typography.Title>
            <div className="slide-container" style={{ margin: '0 auto', width: '1200px'}}>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                >
                    <SwiperSlide>
                        <div>
                            <div className="img-about-slide">
                                <img width="100%" src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/06/blog2-320x189.jpg" alt="" />
                            </div>
                            <Typography.Title level={3} style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px auto' }}>
                                Sample post title with format chat
                            </Typography.Title>
                            <Typography.Title level={5} >
                                All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was…
                            </Typography.Title>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <div className="img-about-slide">
                                <img width="100%" src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/06/blog7-320x189.jpg" alt="" />
                            </div>
                            <Typography.Title level={3} style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px auto' }}>
                                Sample post title with format chat
                            </Typography.Title>
                            <Typography.Title level={5} >
                                All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was…
                            </Typography.Title>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <div className="img-about-slide">
                                <img width="100%" src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/06/blog6-320x189.jpg" alt="" />
                            </div>
                            <Typography.Title level={3} style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px auto' }}>
                                Sample post title with format chat
                            </Typography.Title>
                            <Typography.Title level={5} >
                                All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was…
                            </Typography.Title>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <div className="img-about-slide">
                                <img width="100%" src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/06/blog6-320x189.jpg" alt="" />
                            </div>
                            <Typography.Title level={3} style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px auto' }}>
                                Sample post title with format chat
                            </Typography.Title>
                            <Typography.Title level={5} >
                                All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was…
                            </Typography.Title>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div>
                            <div className="img-about-slide">
                                <img width="100%" src="https://skybook.woovina.net/demo-01/wp-content/uploads/2018/06/blog6-320x189.jpg" alt="" />
                            </div>
                            <Typography.Title level={3} style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px auto' }}>
                                Sample post title with format chat
                            </Typography.Title>
                            <Typography.Title level={5} >
                                All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was…
                            </Typography.Title>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </Row>
    )
}

export default Aboutfooter
