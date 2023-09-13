import React, { useState } from 'react';
import './KnowledgeHub.css';
import SmallDividerImage from '../../../../assets/images/landing_page_v2/small-divider.svg';
import FeaturedCards from './FeaturedCards/FeaturedCards';
import axios from 'axios';
import { useEffect } from 'react';

const KnowledgeHub = () => {
  const [usecaseData, setuseCaseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsecase = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://dicra-api-v2-dev.eastus.cloudapp.azure.com/api/v2/usecases/1`
      );

      if (res.status === 200 && res.data.items.length > 0) {
        setLoading(false);
        setuseCaseData(res.data.items);
      }
    } catch (err) {
      console.log();
    }
  };

  const firstFourUsecaseData = usecaseData.slice(0, 4);

  useEffect(() => {
    getUsecase();
  }, []);

  return (
    <div className="kh-section-container" id="use-cases">
      <div className="kh-top-section">
        <div className="kh-top-left-section">
          <span>Knowledge Hub</span>
        </div>
        <div className="kh-divider-section">
          <img src={SmallDividerImage} alt="divider" />
        </div>
        <div className="kh-top-right-section">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation
          </span>
        </div>
      </div>
      <div className="kh-bottom-section">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <FeaturedCards usecasedata={firstFourUsecaseData} />
        )}
      </div>
    </div>
  );
};

export default KnowledgeHub;
