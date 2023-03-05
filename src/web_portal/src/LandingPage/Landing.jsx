import React from "react";
import { Row, Col } from "reactstrap";
import "../LandingPage/landing.css";
import { Link } from "react-router-dom";
import image1 from "../img/landing page/telangana.png";
import image2 from "../img/landing page/uttarakhand.png";
import image3 from "../img/landing page/maharashtra.png";
import image4 from "../img/landing page/jharkhand.png";
import image5 from "../img/landing page/gujarat.png";
import image6 from "../img/landing page/kerala.png";
import image7 from "../img/landing page/odisha.png";
import image8 from "../img/landing page/uttar_pradesh.png";
import Undp from "../img/undp-logo-blue.svg";

class LandingPage extends React.Component {
  render() {
    document.body.style.backgroundColor = "#091B33";
    return (
      <React.Fragment>
        <div>
          <div className="landing-header">
            <div className="topnav-left">
              <Row style={{marginTop:"5px"}}>
                <Col
                  style={{
                    position: "relative",
                    "text-align": "left",
                    "font-size": "20px",
                    "margin-left": "20px",
                    color: "#FFFFFF",
                    top: "6px",
                  }}
                >
                  DiCRA
                </Col>
              </Row>
              <div
                style={{
                  position: "relative",
                  "text-align": "left",
                  "font-size": "10px",
                  "margin-left": "21px",
                  color: "#FFFFFF",
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
              marginTop: "90px",
              marginLeft: "45px",
              marginRight: "45px",
              color: "#FFFFFF",
              textAlign: "justify",
            }}
          >
            <p style={{ fontSize: "22px", paddingBottom: "0px" }}>DiCRA</p>
            <p style={{ fontSize: "14px" }}>
              Data in Climate Resilient Agriculture (DiCRA) is a collaborative
              digital public good which provides open access to key geospatial
              datasets pertinent to climate resilient agriculture. These
              datasets are curated and validated through collaborative efforts
              of hundreds of data scientists and citizen scientists across the
              world. The pattern detection and data insights emerging from DiCRA
              are aimed towards strengthening evidence-driven policy making for
              climate resilient food systems. DiCRA is guided by the digital
              public good principles of open access, open software, open code
              and open APIs.
            </p>
            <p style={{ fontSize: "22px", paddingBottom: "0px" }}>
              Select State
            </p>
            <div>
              <ul class="cards">
                <li class="cards_item">
                <Link to="/telangana">
                    <img src={image1} width="200" alt="" />
                    </Link>
                </li>
                <li class="cards_item">
                  <div class="img-card">
                    <img src={image2} width="200" alt="" />
                  </div>
                </li>
                <li class="cards_item">
                  <div class="img-card">
                    <img src={image3} width="200" alt="" />
                  </div>
                </li>
                <li class="cards_item">
                  <div class="img-card">
                    <img src={image4} width="200" alt="" />
                  </div>
                </li>
                <li class="cards_item">
                  <div class="img-card">
                    <img src={image5} width="200" alt="" />
                  </div>
                </li>
                <li class="cards_item">
                  <div class="img-card">
                    <img src={image6} width="200" alt="" />
                  </div>
                </li>
                <li class="cards_item">
                  <div class="img-card">
                    <img src={image7} width="200" alt="" />
                  </div>
                </li>
                <li class="cards_item">
                  <div class="img-card">
                    <img src={image8} width="200" alt="" />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default LandingPage;
