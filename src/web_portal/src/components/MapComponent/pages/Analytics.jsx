import React from 'react';
import './style.css';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import { BiX } from 'react-icons/bi';
import { Link } from 'react-router-dom';

class Analytics extends React.Component {
  constructor() {
    super();
    this.state = {
      //  loader : true
    };
  }
  // hideLoader = () => {
  //   this.setState({
  //     loader: false
  //   });
  // };

  render() {
    return (
      <Sidebar>
        <React.Fragment>
          <div className="page-header">
            <Header />
          </div>
          <div className="container-page">
            <div className="site-analytics-wrapper ">
              <div className="site-analytics-top-header">
                <h6 className="site-analytics-page-heading">Site Analytics</h6>
                <Link to={`${process.env.PUBLIC_URL}/map`}>
                  <BiX className="site-analytics-page-close" />
                </Link>
              </div>
              <hr />
              <div className="iframe-container">
                <iframe
                  className="google-analytics"
                  title="Analytics"
                  width="100%"
                  height={2000}
                  src="https://datastudio.google.com/embed/reporting/2aef4516-1c78-4a08-84d8-00eed13cd07b/page/1M"
                  frameBorder={0}
                  style={{ border: '0' }}
                  allowFullScreen
                  // onLoad={this.hideLoader}
                ></iframe>
              </div>
            </div>
          </div>
        </React.Fragment>
      </Sidebar>
    );
  }
}
export default Analytics;
