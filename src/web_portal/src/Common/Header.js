import React, { Component } from "react";
import "./common.css";
import Undp from "../img/undp-logo-blue.svg";
import Telangana from "../img/telangana.png";

import { Row, Col } from "reactstrap";

export default class Header extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="topnav-left">
 
            <Row>
              <Col className="dicra">
                DiCRA<span className="telangana">Telangana</span>
              </Col>
              {/* <div className="col" style={{ paddingLeft: "0px" }}>
              <div className="telangana">Telangana</div>
            </div> */}
            </Row>
              <div className="heading">
                Data in Climate Resilient Agriculture
              </div>

        </div>
        <div className="topnav-right">
          <Row>
            <Col className="telangana-logo">
              <img src={Telangana} width={50} height={50} alt="Telengana"/>
            </Col>
            <Col className="undp-logo">
              <img src={Undp} width={25} height={50} alt="Undp" />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
