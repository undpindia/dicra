import React from 'react';
import "../Common/common.css";
import Header from "../Common/Header";
import { BiX } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Row, Col} from "reactstrap";
import PDF from "../pdf/Climate Resilient Agriculture_Filed Stories_Telangana.pdf"
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const FieldStories = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div>
          <div>
            <div style={{ paddingBottom: "10px" }}>
                <h6 className="page-heading">Climate Resilient Agriculture Field Stories</h6>
                <Link to="/">
                  <BiX className="page-close" />
                </Link>
            </div>
            <hr />
            <div>
              <div className="container about-page">
                <Row>
                  <Col className="pdf-wrapper">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                  <div >
                    <Viewer fileUrl={PDF} plugins={[defaultLayoutPluginInstance]} />
                  </div>
                </Worker>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
};
export default FieldStories;
