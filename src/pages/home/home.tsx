import React from 'react';
import AboutComponent from './about/aboutComponent';
import Aboutfooter from './aboutfooter/aboutfooter';
import CarouselComponent from './carousel/Carousel';
import Footerhover from './footerhover/footerhover';
import ProductComponent from './product/productComponent';


interface Props {
    
}

const Home = (props: Props) => {
    return (
        <div>
            <CarouselComponent />
            <ProductComponent page={0} />
            <AboutComponent />
            <ProductComponent page={1} />
            <Footerhover />
        </div>
    )
}

export default Home
