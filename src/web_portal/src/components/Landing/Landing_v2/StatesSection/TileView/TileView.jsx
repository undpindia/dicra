import React from 'react';
import './TileView.css';
import { CustomAdaptiveCard } from '../../../UI/UiElements';

import telanganaImg from '../../../../../assets/images/landing_page_v2/states/telangana.svg';
import gujaratImg from '../../../../../assets/images/landing_page_v2/states/gujarat.svg';
import jharkhandImg from '../../../../../assets/images/landing_page_v2/states/jharkhand.svg';
import kerelaImg from '../../../../../assets/images/landing_page_v2/states/kerela.svg';
import maharashtraImg from '../../../../../assets/images/landing_page_v2/states/maharashtra.svg';
import odishaImg from '../../../../../assets/images/landing_page_v2/states/odisha.svg';
import uttarPradeshImg from '../../../../../assets/images/landing_page_v2/states/uttar-pradesh.svg';
import uttrakhandImg from '../../../../../assets/images/landing_page_v2/states/uttrakhand.svg';
import { useNavigate } from 'react-router-dom';

const TileView = () => {
  const navigate = useNavigate();

  const states = [
    {
      name: 'Telangana',
      img: telanganaImg,
      link: '/map',
    },
    {
      name: 'Uttrakhand',
      img: uttrakhandImg,
    },
    {
      name: 'Maharashtra',
      img: maharashtraImg,
    },
    {
      name: 'Jharkhand',
      img: jharkhandImg,
    },
    {
      name: 'Gujarat',
      img: gujaratImg,
    },
    {
      name: 'Kerela',
      img: kerelaImg,
    },
    {
      name: 'Odisha',
      img: odishaImg,
    },
    {
      name: 'Uttar Pradesh',
      img: uttarPradeshImg,
    },
  ];
  return (
    <div className="tile-view-container" id="states">
      {states.map((state, index) => (
        <div key={index} onClick={() => state.link && navigate(state.link)}>
          <CustomAdaptiveCard
            imageSource={state.img}
            title={state.name}
            hasTitle={true}
          />
        </div>
      ))}
    </div>
  );
};

export default TileView;
