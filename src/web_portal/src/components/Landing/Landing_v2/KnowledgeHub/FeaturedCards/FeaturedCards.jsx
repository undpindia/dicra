import React from 'react';
import './FeaturedCards.css';
import { CustomButton } from '../../../UI/UiElements';
// import telanganaImg from '../../../../../assets/images/landing_page_v2/states/telangana.svg';
import { useNavigate } from 'react-router-dom';

const FeaturedCards = ({ usecasedata }) => {
  const navigate = useNavigate();
  const cardData = usecasedata.map((item) => {
    return {
      imageSource:
        'https://dicra-api-v2-dev.eastus.cloudapp.azure.com/static/' +
        item.image,
      title: item.project_name,
      description: item.short_description,
    };
  });

  return (
    <div className="featured-cards-container">
      <div className="featured-cards-header">
        <span>Featured</span>
        <CustomButton
          buttonLabel={'View All'}
          hasArrow
          onClick={() => navigate('/usecases-v2')}
        />
      </div>

      <div className="featured-cards-wrapper">
        {cardData.map((card, index) => (
          <div className="featured-card" key={index}>
            <div className="featured-card-image">
              <img src={card.imageSource} alt="card" />
            </div>
            <div className="featured-card-body">
              <div className="featured-card-title">{card.title}</div>
              <div className="featured-card-subtitle">{card.description}</div>
            </div>

            <div className="featured-card-btn">
              <CustomButton
                buttonLabel={'Visit'}
                hasArrow
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCards;
