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
                <h6 className="page-heading">Terms of use</h6>
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
                    The DiCRA Platform is an open data platform managed by the United Nations Development Programme. These Terms of Service (hereafter ‘Terms’ or ‘these Terms’) describe how DiCRA is managed and how the platform should be used. UNDP will update these Terms as needed, and will post notice of significant updates on our GitHub Page and through the DiCRA Platform. All organizations and individuals using this platform are bound by these Terms. If you do not agree with the Terms, you should discontinue use of DiCRA. If you have any questions or comments about these Terms or DiCRA, please leave a comment
                     on the Discussions tab of our GitHub repository or send an email to <a href="mailto:acceleratorlab.in@undp.org">acceleratorlab.in@undp.org</a>
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
