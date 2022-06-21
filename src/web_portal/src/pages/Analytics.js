import React from "react";
import "../Common/common.css";
import Header from "../Common/Header";
import { BiX } from "react-icons/bi";
import {Link } from "react-router-dom";
import { connect } from "react-redux";
import Loader from "../Common/Loader.js"
const mapStateToProps = (ReduxProps) => {
  return {
    Layers: ReduxProps.Layers,
  };
};
class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     loader : true
  }
}
hideLoader = () => {
  this.setState({
    loader: false
  });
};

  render() {
    return (
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div className="about-body">
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h6 className="page-heading">Site Analytics</h6>
              <Link to="/">
                <BiX className="page-close" />
              </Link>
            </div>
            <hr />
            <div>
            {this.state.loader ? (
                    <Loader/>
                  ) : null}
              <div className="container analytics-page">
                <div className="iframe-container">
                 
                  <iframe
                    className="google-analytics"
                    title="Analytics"
                    width="100%"
                    height={2000}
                    src="https://datastudio.google.com/embed/reporting/2aef4516-1c78-4a08-84d8-00eed13cd07b/page/1M"
                    frameBorder={0}
                    style={{ border: "0" }}
                    allowFullScreen
                    onLoad={this.hideLoader}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default connect(mapStateToProps)(Analytics);
