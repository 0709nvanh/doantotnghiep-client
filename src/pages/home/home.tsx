import AboutComponent from './about/aboutComponent';
import CarouselComponent from './carousel/Carousel';
import Footerhover from './footerhover/footerhover';
import ProductComponent from './product/productComponent';

const Home = () => {
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
