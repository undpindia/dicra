import React from 'react';
import { Row, Col } from 'reactstrap';
import './Landing.css';
import { Link } from 'react-router-dom';
import image1 from '../../assets/images/landing page/telangana.png';
import image2 from '../../assets/images/landing page/uttarakhand.png';
import image3 from '../../assets/images/landing page/maharashtra.png';
import image4 from '../../assets/images/landing page/jharkhand.png';
import image5 from '../../assets/images/landing page/gujarat.png';
import image6 from '../../assets/images/landing page/kerala.png';
import image7 from '../../assets/images/landing page/odisha.png';
import image8 from '../../assets/images/landing page/uttar_pradesh.png';
import Undp from '../../assets/images/undp-logo-blue.svg';
import { useNavigate, useLocation } from 'react-router-dom';
export default function Landing() {
  let history = useNavigate();
  document.body.style.backgroundColor = '#091B33';
  return (
    <React.Fragment>
      <div>
        <div className="landing-header">
          <div className="topnav-left">
            <Row style={{ marginTop: '5px' }}>
              <Col
                style={{
                  position: 'relative',
                  'text-align': 'left',
                  'font-size': '26px',
                  'margin-left': '20px',
                  color: '#FFFFFF',
                  top: '-1px',
                }}
              >
                DiCRA
              </Col>
            </Row>
            <div
              style={{
                position: 'relative',
                'text-align': 'left',
                'font-size': '10px',
                'margin-left': '21px',
                color: '#FFFFFF',
                marginTop: '-7px',
              }}
            >
              Data in Climate Resilient Agriculture
            </div>
          </div>
          <div className="topnav-right">
            <Row>
              <Col className="undp-logo-new">
                <img src={Undp} width={23} height={50} alt="Undp" />
              </Col>
            </Row>
          </div>
        </div>
        <div
          style={{
            marginTop: '80px',
            marginLeft: '45px',
            marginRight: '45px',
            color: '#FFFFFF',
            textAlign: 'justify',
          }}
        >
          <p
            style={{
              fontSize: '26px',
              paddingBottom: '0px',
              fontWeight: '700',
              display: 'flex',
              color: '#FFFFFF',
            }}
          >
            DiCRA
          </p>
          <p
            style={{ fontSize: '18px', fontWeight: '400', lineHeight: '44px' }}
          >
            Data in Climate Resilient Agriculture (DiCRA) is a collaborative
            digital public good which provides open access to key geospatial
            datasets pertinent to climate resilient agriculture. These datasets
            are curated and validated through collaborative efforts of hundreds
            of data scientists and citizen scientists across the world. The
            pattern detection and data insights emerging from DiCRA are aimed
            towards strengthening evidence-driven policy making for climate
            resilient food systems. DiCRA is guided by the digital public good
            principles of open access, open software, open code and open APIs.
          </p>
          <p
            style={{
              fontSize: '26px',
              paddingBottom: '0px',
              fontWeight: '700',
            }}
          >
            Select State
          </p>
          <div>
            <ul className="cards">
              <li className="cards_item">
                <Link to="/telangana/map">
                  <img src={image1} width="180" alt="" />
                </Link>
              </li>
              <li className="cards_item">
                <Link to="/uttarakhand/map">
                  <img src={image2} width="180" alt="" />
                </Link>
              </li>
              <li className="cards_item">
                <Link to="/maharashtra/map">
                  <img src={image3} width="180" alt="" />
                </Link>
              </li>
              <li className="cards_item">
                <Link to="/jharkhand/map">
                  <img src={image4} width="180" alt="" />
                </Link>
              </li>
              <li className="cards_item">
                <Link to="/gujarat/map">
                  <img src={image5} width="180" alt="" />
                </Link>
              </li>
              <li className="cards_item">
                <Link to="/kerala/map">
                  <img src={image6} width="180" alt="" />
                </Link>
              </li>
              <li className="cards_item">
                <Link to="/odisha/map">
                  <img src={image7} width="180" alt="" />
                </Link>
              </li>
              {/* <li className="cards_item">
                <div className="img-card">
                  <img src={image8} width="180" alt="" />
                </div>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
