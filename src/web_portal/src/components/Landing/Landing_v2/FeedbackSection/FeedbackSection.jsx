import React from 'react';
import './FeedbackSection.css';
import { CustomButton, CustomInput } from '../../UI/UiElements';

const FeedbackSection = () => {
  return (
    <div className="feedback-section" id="feedback">
      <div className="feedback-section-heading">
        <span className="feedback-heading">Feedback for us?</span>
        <span className="feedback-subheading">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation{' '}
        </span>
      </div>

      <div className="feedback-section-form">
        <div className="top-row">
          <CustomInput
            placeholder="Name"
            style={{
              width: '697px',
            }}
          />
          <CustomInput
            placeholder="Email"
            style={{
              width: '697px',
            }}
          />
        </div>

        <div className="bottom-row">
          <CustomInput
            placeholder="Message"
            style={{
              width: '92vw',
            }}
          />
        </div>

        <div className="feedback-form-btn-wrapper">
          <CustomButton
            buttonLabel="Submit"
            hasArrow={false}
            style={{
              width: '500px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
