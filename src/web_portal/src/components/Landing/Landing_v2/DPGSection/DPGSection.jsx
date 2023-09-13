import React from 'react';
import './DPGSection.css';
import { CustomButton } from '../../UI/UiElements';
import RightImage from '../../../../assets/images/landing_page_v2/dpg-image.svg';
import DividerImage from '../../../../assets/images/landing_page_v2/section-divider.svg';
import DpgTagImage from '../../../../assets/images/landing_page_v2/dpg-tag.svg';

const DPGSection = () => {
  return (
    <div className="dpg-section" id="dpg">
      <div className="dpg-left">
        <div className="dpg-left-heading">
          <span>Digital Pubic Goods</span>
          <img src={DpgTagImage} alt="dpg-tag" />
        </div>
        <div className="dpg-left-description">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation Ut enim ad minim veniam,
            quis nostrud
          </span>
        </div>
        <div className="dpg-left-btn-wrapper">
          <CustomButton
            buttonLabel="Visit Page"
            hasArrow={true}
            onClick={() =>
              window.open(
                'https://digitalpublicgoods.net/',
                '_blank',
                'noopener noreferrer'
              )
            }
          />
        </div>
      </div>
      <div className="dpg-section-divider">
        <img
          className="dpg-divider-content-image-1"
          src={DividerImage}
          alt="divider"
        />
      </div>
      <div className="dpg-right">
        <img src={RightImage} alt="right" />
      </div>
    </div>
  );
};

export default DPGSection;
