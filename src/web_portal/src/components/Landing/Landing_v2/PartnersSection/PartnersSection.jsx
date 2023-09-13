import React from 'react';
import './PartnersSection.css';
import SmallDividerImage from '../../../../assets/images/landing_page_v2/small-divider.svg';

import UndpLogo from '../../../../assets/images/partners/undp.png';
import IcrisatLogo from '../../../../assets/images/partners/icrisat.png';
import JadsLogo from '../../../../assets/images/partners/jads.png';
import RichLogo from '../../../../assets/images/partners/rich.png';
import TilburgLogo from '../../../../assets/images/partners/tilburg.png';
import MisteoLogo from '../../../../assets/images/partners/misteo.png';
import RockefellerLogo from '../../../../assets/images/partners/rockefeller.png';
import TelanganaLogo from '../../../../assets/images/partners/telangana.png';
import TelAgriLogo from '../../../../assets/images/partners/tel-agri.png';

import { CustomAdaptiveCard } from '../../UI/UiElements';

const PartnersSection = () => {
  const partners = [
    {
      name: 'UNDP',
      logo: UndpLogo,
    },
    {
      name: 'Telangana Govt',
      logo: TelanganaLogo,
    },
    {
      name: 'Rockerfeller Foundation',
      logo: RockefellerLogo,
    },
    {
      name: 'ICRISAT',
      logo: IcrisatLogo,
    },
    {
      name: 'JADS',
      logo: JadsLogo,
    },
    {
      name: 'RICH',
      logo: RichLogo,
    },
    {
      name: 'Tel Agriculutre',
      logo: TelAgriLogo,
    },
    {
      name: 'Tilburg University',
      logo: TilburgLogo,
    },
    {
      name: 'MistEO',
      logo: MisteoLogo,
    },
  ];
  return (
    <div className="partners-section-container" id="partners">
      <div className="partners-top-section">
        <div className="partners-top-left-section">
          <span>Our Partners with DiCRA</span>
        </div>
        <div className="partners-divider-section">
          <img src={SmallDividerImage} alt="divider" />
        </div>
        <div className="partners-top-right-section">
          <span>
            The platform is facilitated by Government of Telangana and UNDP, in
            collaboration with Zero Huger Lab (Netherlands), JADS (Netherlands),
            ICRISAT, PJTSAU, and RICH. It is part of UNDP’s ‘Data for Policy’
            initiative supported by Rockefeller Foundation.
          </span>
        </div>
      </div>

      <div className="partners-card-views">
        <div className="partners-card-views-container">
          {partners.map((partner, index) => (
            <CustomAdaptiveCard
              key={index}
              imageSource={partner.logo}
              hasTitle={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
