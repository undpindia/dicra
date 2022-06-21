import React from "react";
import Header from "../Common/Header";
import { BiX } from "react-icons/bi";
import { Link } from "react-router-dom";
import "../Common/common.css";
class Help extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div></div>
        <div className="help-body">
          <div>
            <div className="row" style={{ paddingBottom: "10px" }}>
              <div className="col">
                <h6 className="page-heading">Help</h6>
              </div>
              <div className="col">
                <Link to="/">
                  <BiX className="page-close" />
                </Link>
              </div>
            </div>
            <hr />
            <div>
              <div className="container help-page">
                <div className="row">
                  <h3 className="about-heading">Heading</h3>
                  <div className="col about-content">
                    <a>
                      UNDP has partnered with the Government of Telangana to
                      jointly initiate the NextGenGov 'Data for Policy'
                      initiative on Food Systems. The aim is to incorporate
                      anticipatory governance models for future-fit food systems
                      in Telangana using data-driven policymaking tools and
                      ecosystem-driven approaches. UNDP is keen on augmenting
                      learning capabilities, increasing the predictive or
                      anticipatory capacity to feed-in to evidence-driven
                      policies in the state, and create radical traceability and
                      transparency across the system from producers to consumers
                      by building provenance documentation around food that can
                      help build trust in the system at the same time nurture
                      sustainable and healthy practices. The goal is to design,
                      develop and demonstrate anticipatory governance models for
                      food systems in Telangana using digital public goods and
                      community-centric approaches to strengthen data-driven
                      policy making in the state.
                    </a>
                  </div>
                </div>
                <div className="row">
                  <h3 className="about-heading">Heading</h3>
                  <div className="col about-content">
                    <a>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </a>
                  </div>
                </div>
                <div className="row">
                  <h3 className="about-heading">Heading</h3>
                  <div className="col about-content">
                    <a>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </a>
                  </div>
                </div>
                <div className="row">
                  <h3 className="about-heading">Heading</h3>
                  <div className="col about-content">
                    <a>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Help;
