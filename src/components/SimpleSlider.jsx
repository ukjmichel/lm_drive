import { Box, Img } from '@chakra-ui/react';
import React from 'react';
import Slider from 'react-slick';
import view from '../assets/images/lm_b.jpg';
import view2 from '../assets/images/lm_e.jpg';
import view3 from '../assets/images/lm_s.jpg';

function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Box w={'100%'} className="slider-container">
      <Slider {...settings}>
        <Box>
          <Img src={view}></Img>
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
