import './Header.css';
import { Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import Telangana from '../../../assets/images/telangana.png';
import Undp from '../../../assets/images/undp-logo-blue.svg';
import Config from '../Config/config';
import Nabard from '../../../assets/images/partners/nabard.png'
const Header = () => {
  return (
    <Fragment>
      <div className="header">
        <div className="topnav-left">
          <Row style={{ marginTop: '5px' }}>
            <Col className="dicra">
              <a className="landing-link" href="/">
                DiCRA
              </a>
              <span className="state-name">{Config.state}</span>
            </Col>
          </Row>
          <div className="heading">Data in Climate Resilient Agriculture</div>
        </div>
        <div className="topnav-right">
          <Row>
          {Config.stateImage.length > 0 ? (
                  <Col className="state-logo">
                  <img
                    src={Config.stateImage}
                    // width={50}
                    height={40}
                    alt="Telengana"
                  />
            </Col>
            ) : null}
             <Col className="nabard-logo">
                    <img src={Nabard} height={45} alt="Nabard" />
             </Col>
            <Col className="undp-logo">
              <img src={Undp} width={25} height={50} alt="Undp" />
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
