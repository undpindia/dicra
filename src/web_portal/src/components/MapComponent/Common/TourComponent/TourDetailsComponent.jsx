import React from 'react';
import './TourDetailsComponent.css';

const TourDetailsComponent = ({
  heading,
  content,
  skipBtnAction,
  currentStep,
  nextBtnAction,
}) => {
  return (
    <div className="tour-component">
      <div className="tour-heading">
        <span className="tour-heading-span">{heading}</span>
        <span className="skip-span" onClick={skipBtnAction}>
          Skip
        </span>
      </div>
      <div className="tour-content">
        <span className="tour-content-span">{content}</span>
      </div>
      <div className="tour-btn-wrapper">
        <span className="steps-span">Steps {currentStep}/19</span>
        <button className="tour-next-btn" onClick={nextBtnAction}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TourDetailsComponent;
