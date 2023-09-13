import React from 'react';
import './HeroSection.css';
import { CustomButton } from '../../UI/UiElements';
import RightImage from '../../../../assets/images/landing_page_v2/right-img.svg';
import DividerImage from '../../../../assets/images/landing_page_v2/section-divider.svg';

const HeroSection = () => {
  return (
    <div className="hero-section" id="home" name="Home">
      <div className="hero-left">
        <div className="left-tag">
          <span>DiCRA</span>
        </div>
        <div className="left-heading">
          <span>Data in Climate Resilient Agriculture</span>
        </div>
        <div className="left-description">
          <span>
            DiCRA is a collaborative digital public good which provides open
            access to key geospatial datasets pertinent to climate resilient
            agriculture. These datasets are curated and validated through
            collaborative efforts of hundreds of data scientists and citizen
            scientists across the world.
          </span>
        </div>
        <div className="left-btn-wrapper">
          <CustomButton
            buttonLabel="View States"
            hasArrow={true}
            to="states"
            offset={-80}
          />
        </div>
      </div>
      <div className="section-divider">
        <img
          className="divider-content-image-1"
          src={DividerImage}
          alt="divider"
        />
        <img
          className="divider-content-image-2"
          src={DividerImage}
          alt="divider"
        />
      </div>
      <div className="hero-right">
        <img src={RightImage} alt="right" />
      </div>
    </div>
  );
};

export default HeroSection;
