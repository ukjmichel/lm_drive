import { Box, Img } from '@chakra-ui/react';
import Slider from 'react-slick';
import view from '../..//assets/images/lm_b.jpg';
import view2 from '../../assets/images/lm_e.jpg';
import view3 from '../../assets/images/lm_s.jpg';

function SimpleSlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Box
      className="slider-container"
      overflow={'hidden'}
      height={'300px'}
      width={{ base: '100%', md: '400px', lg: '500px', xl: '700px' }}
      borderRadius={'xl'}
    >
      <Slider {...settings}>
        <Box>
          <Img src={view} objectFit={'cover'}></Img>
        </Box>
        <Box>
          <Img src={view2}></Img>
        </Box>
        <Box>
          <Img src={view3}></Img>
        </Box>
      </Slider>
    </Box>
  );
}

export default SimpleSlider;
