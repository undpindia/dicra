import React from 'react';
import './UiElements.css';
import RightArrow from '../../../assets/images/landing_page_v2/right-arrow.svg';
import { Link } from 'react-scroll';

export const CustomButton = ({
  hasArrow = false,
  buttonLabel,
  onClick,
  ...props
}) => {
  return (
    <div className="custom-button-wrapper">
      <Link className="custom-button" onClick={onClick} {...props}>
        {buttonLabel}
        {hasArrow && <img src={RightArrow} alt="right-arrow" />}
      </Link>
    </div>
  );
};

export const CustomAdaptiveCard = ({
  imageSource,
  title,
  hasTitle = false,
}) => {
  return (
    <div className={hasTitle ? 'custom-adaptive-card' : 'custom-card'}>
      <img src={imageSource} alt="adaptive-card" />
      {hasTitle && (
        <div className="custom-adaptive-card-content">
          <span className="custom-adaptive-card-title">{title}</span>
        </div>
      )}
    </div>
  );
};

export const CustomInput = ({ label, ...props }) => {
  return (
    <div className="custom-input-wrapper">
      <input className="custom-input" {...props} />
    </div>
  );
};
