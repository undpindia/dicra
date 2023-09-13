import React from 'react';
// import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import './StatesSection.css';
import SmallDividerImage from '../../../../assets/images/landing_page_v2/small-divider.svg';

import TileView from './TileView/TileView';

const StatesSection = () => {
  return (
    <div className="state-section-container" id="states">
      <div className="state-top-section">
        <div className="state-top-left-section">
          <span>States</span>
        </div>
        <div className="state-divider-section">
          <img src={SmallDividerImage} alt="divider" />
        </div>
        <div className="state-top-right-section">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation
          </span>
        </div>
      </div>

      <div className="state-section-views">
        <TileView />
      </div>
    </div>
  );
};

export default StatesSection;
