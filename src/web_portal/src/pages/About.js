import React from "react";
import "../Common/common.css";
import Header from "../Common/Header";
import { BiX } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "reactstrap";
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
let notavailable = 1;
class About extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div className="about-body">
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h6 className="page-heading">About DiCRA</h6>
              <Link to="/">
                <BiX className="page-close" />
              </Link>
            </div>
            <hr />
            <div>
              <div className="container about-page">
                <Row>
                  {/* <h3 className="about-heading">About DiCRA</h3> */}
                  <Col className="about-content">
                    <p style={{ fontSize: "16px" }}>
                      Data in Climate Resilient Agriculture (DiCRA) is a
                      collaborative digital public good which provides open
                      access to key geospatial datasets pertinent to climate
                      resilient agriculture. These datasets are curated and
                      validated through collaborative efforts of hundreds of
                      data scientists and citizen scientists across the world.
                      The pattern detection and data insights emerging from
                      DiCRA are aimed towards strengthening evidence-driven
                      policy making for climate resilient food systems. DiCRA is
                      guided by the digital public good principles of open
                      access, open software, open code and open APIs.
                    </p>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "18px",
                        paddingBottom: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      Partners
                    </div>
                    <p style={{ fontSize: "16px" }}>
                      The platform is facilitated by Government of Telangana and
                      UNDP, in collaboration with Zero Huger Lab (Netherlands),
                      JADS (Netherlands), ICRISAT, PJTSAU, and RICH. It is part
                      of UNDP’s ‘Data for Policy’ initiative supported by
                      Rockefeller Foundation.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <ul className="org-logo">
                    <li className="org-logo-item">
                      <a
                        href="https://www.undp.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={undplogo} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="https://www.telangana.gov.in/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={telenganalogo} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="https://www.rockefellerfoundation.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={rockefeller} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="https://www.icrisat.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={icrisat} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="https://www.jads.nl/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={jads} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="http://www.rich.telangana.gov.in/team.html"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={rich} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="https://www.pjtsau.edu.in/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={telenganaagri} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="https://www.tilburguniversity.edu/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={tilburg} alt="" />
                      </a>
                    </li>
                    <li className="org-logo-item">
                      <a
                        href="https://misteo.co/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={misteo} alt="" />
                      </a>
                    </li>
                  </ul>
                </Row>
                <div>
                  <div
                    style={{
                      textAlign: "left",
                      fontSize: "18px",
                      paddingBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Data Source
                  </div>
                  <Table
                    size="sm"
                    className="table-source"
                    style={{ textAlign: "left", fontSize: "16px" }}
                    bordered
                    id="data-source"
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Source</th>
                        <th style={{ width: "300px" }}>Citation</th>
                        <th>Standards</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.Layers.map((data, index) => {
                        if (data.isavailable) {
                          return (
                            <tr key={index}>
                              <td>{data.display_name}</td>
                              <td>{data.long_description}</td>
                              <td>{data.source}</td>
                              <td>{data.citation}</td>
                              <td>{data.standards}</td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default connect(mapStateToProps)(About);
