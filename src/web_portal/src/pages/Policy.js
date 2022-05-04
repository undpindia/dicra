import React from "react";
import "../Common/common.css";
import Header from "../Common/Header";
import { BiX } from "react-icons/bi";
import { useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Table } from "reactstrap";
import undplogo from "../img/undp-logo.png";
import telenganalogo from "../img/telengana-logo.png";
import telenganaagri from "../img/telengana-agri.png";
import icrisat from "../img/icrisat.png";
import jads from "../img/jads.png";
import rich from "../img/rich.jpg";
import rockefeller from "../img/rockefeller.png";
import tilburg from "../img/tilburg.png";
import misteo from "../img/MistEO_Logo_Square.png";
import { connect } from "react-redux";
const mapStateToProps = (ReduxProps) => {
  return {
    Layers: ReduxProps.Layers,
  };
};
class Policy extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div>
          <div>
            <div style={{ paddingBottom: "10px" }}>
                <h6 className="page-heading">Privacy policy</h6>
                <Link to="/">
                  <BiX className="page-close" />
                </Link>
            </div>
            <hr />
            <div>
              <div class="container about-page">
                <Row>
                  {/* <h3 className="about-heading">About DiCRA</h3> */}
                  <Col className="about-content">
                    <p style={{ fontSize: "16px" }}>
                    User contact details are only shared with the administrator of the DiCRA Platform if the user needs to download datasets.

UNDP upholds the highest standard of data protection for the personal data of DiCRA users and organization administrators. In case such personal data is exposed, UNDP will notify all affected individuals and remedy the incident.

UNDP continually seeks to understand the behavior of users on the DiCRA platform in order to make improvements. To do so, UNDP uses third-party analytics services, such as Google Analytics. This service use cookies stored on users’ devices to send encrypted information to Google Analytics about how users arrived at DiCRA, what pages they visited on DiCRA, and their actions within those pages. UNDP does not send identifying information (including names, usernames, or email addresses) to Google Analytics. Google Analytics’ use of the data collected from the DiCRA platform is governed by their respective Terms of Use. If you would like to disable the tracking described above, you can install the Google Analytics Opt-out Browser Add-on to disable Google Analytics tracking. The data collected by these tracking systems will be retained indefinitely in order to understand how user behavior is changing over time.
                    </p>
                    {/* <div
                      style={{
                        textAlign: "left",
                        fontSize: "18px",
                        paddingBottom: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      Partners
                    </div> */}
                    {/* <p style={{ fontSize: "16px" }}>
                      The platform is facilitated by Government of Telangana and
                      UNDP, in collaboration with Zero Huger Lab (Netherlands),
                      JADS (Netherlands), ICRISAT, PJTSAU, and RICH. It is part
                      of UNDP’s ‘Data for Policy’ initiative supported by
                      Rockefeller Foundation.
                    </p> */}
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
export default connect(mapStateToProps)(Policy);
