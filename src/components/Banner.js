import React from 'react';
import bannerImg from '../assets/banner_image.png';
import bannerImg_mobile from '../assets/banner_image_mobile.png';
import './styles/Banner.css';

const Banner = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="banner">
      <img
        src={isMobile ? bannerImg_mobile : bannerImg}
        alt="Banner with dogs"
        className="banner-img"
      />
      {/* <div className="banner-text">
        Home is Where<br /> the Paw Prints Are
      </div> */}
    </div>
  );
};

export default Banner;