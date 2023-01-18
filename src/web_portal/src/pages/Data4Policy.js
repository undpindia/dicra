import React from "react";
import "../Common/common.css";
import Header from "../Common/Header";
import { BiX } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Row, Col} from "reactstrap";

import { connect } from "react-redux";
const mapStateToProps = (ReduxProps) => {
  return {
    Layers: ReduxProps.Layers,
  };
};
class Terms extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div>
          <div>
            <div style={{ paddingBottom: "10px" }}>
                <h6 className="page-heading">Data4Policy Experimentation</h6>
                <Link to="/">
                  <BiX className="page-close" />
                </Link>
            </div>
            <hr />
            <div>
              <div className="container about-page">
                <Row>
                  <Col className="about-content">
                    <p style={{ fontSize: "16px" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis convallis tellus id interdum. Auctor eu augue ut lectus arcu bibendum at. Tristique risus nec feugiat in fermentum posuere. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Condimentum lacinia quis vel eros. In tellus integer feugiat scelerisque. Fames ac turpis egestas sed tempus urna et pharetra pharetra. Sit amet justo donec enim diam vulputate ut pharetra. Aliquam sem et tortor consequat id porta nibh. Commodo elit at imperdiet dui accumsan sit amet. Urna neque viverra justo nec ultrices dui. Eu non diam phasellus vestibulum lorem sed. Quis ipsum suspendisse ultrices gravida dictum. Massa vitae tortor condimentum lacinia quis vel eros donec ac. Ultricies mi quis hendrerit dolor.
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default connect(mapStateToProps)(Terms);
