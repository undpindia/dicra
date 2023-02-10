import React, { useState } from 'react';
import "../Common/common.css";
import Header from "../Common/Header";
import { BiX } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Row, Col} from "reactstrap";
import { Document, Page, pdfjs  } from 'react-pdf';
import PDF from "../pdf/Climate Resilient Agriculture_Filed Stories_Telangana.pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FieldStories = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber] = useState(1);
  
    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }
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
                    <Document
                    file={PDF}
                    onLoadSuccess={onDocumentLoadSuccess}
                >{Array.apply(null, Array(numPages))
                  .map((x, i)=>i+1)
                  .map(page => <Page pageNumber={page}/>)}
                    
                </Document>
      <p>Page {pageNumber} of {numPages}</p>
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
