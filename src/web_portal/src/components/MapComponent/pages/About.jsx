import React, { useState, useEffect } from 'react';
import './style.css';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';
import Header from '../Common/Header';
import image1 from '../../../assets/images/partners/undp.png';
import image2 from '../../../assets/images/partners/rockefeller.png';
import image3 from '../../../assets/images/partners/icrisat.png';
import image4 from '../../../assets/images/From the people of Japan.jpg';
import image5 from '../../../assets/images/partners/rich.png';
import image6 from '../../../assets/images/partners/jads.png';
import image7 from '../../../assets/images/partners/tilburg.png';
import image8 from '../../../assets/images/partners/misteo.png';
import { getlayers } from '../../../assets/api/apiService';
import Config from '../Config/config';
import Sidebar from '../Common/Sidebar';

function About(props) {
  const [open, setOpen] = useState('');
  const [allLayers, setLayers] = useState([]);
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  const getLayersdetails = (id) => {
    getlayers(id).then((json) => {
      // console.log("JSON HERER LAYERS", json)
      let result;
      result = json.data;
      setLayers(result);
      // console.log("RESULT ", result)
      // layerList([result]);
      // setCategorylist(Object.keys([result][0]));
    });
  };
  useEffect(() => {
    getLayersdetails(1);
  }, []);
  return (
    <Sidebar>
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div className="container-page">
          <div
            style={{
              marginTop: '100px',
              marginBottom: '50px',
              marginLeft: '45px',
              marginRight: '45px',
              color: '#FFFFFF',
              textAlign: 'justify',
            }}
          >
            <div className="about-heading">About Project</div>
            <div className="about-content" style={{ marginBottom: '44px' }}>
              Data in Climate Resilient Agriculture (DiCRA) is a collaborative
              digital public good which provides open access to key geospatial
              datasets pertinent to climate resilient agriculture. These
              datasets are curated and validated through collaborative efforts
              of hundreds of data scientists and citizen scientists across the
              world. The pattern detection and data insights emerging from DiCRA
              are aimed towards strengthening evidence-driven policy making for
              climate resilient food systems. DiCRA is guided by the digital
              public good principles of open access, open software, open code
              and open APIs.
            </div>
            <div className="about-sub-heading">Partners</div>
            <div className="partner-content" style={{ marginBottom: '44px' }}>
              The platform is facilitated by Government agencies and UNDP, in
              collaboration with Zero Huger Lab (Netherlands), JADS
              (Netherlands), ICRISAT, and RICH. It is part of UNDP’s ‘Data for
              Policy’ initiative supported by Rockefeller Foundation and
              'Climate Adaptation'' initiative with the generous financial
              contribution from the Government and the People of Japan.
            </div>
            <div className="partner-img" style={{ marginBottom: '44px' }}>
              <ul
                className="brands"
                style={{
                  listStyle: 'none',
                  paddingLeft: '0',
                  paddingRight: '0',
                }}
              >
                <li className="brands__item">
                  <a href="#">
                    <img src={Config.stateImage} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image1} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image2} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image3} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image4} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image5} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image6} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image7} alt="" />
                  </a>
                </li>
                <li className="brands__item">
                  <a href="#">
                    <img src={image8} alt="" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="about-sub-heading">Data Source</div>
            <div>
              {allLayers.map((item, index) =>
                item.isavailable ? (
                  <Accordion flush open={open} toggle={toggle}>
                    <AccordionItem style={{ background: '#091b33' }}>
                      <AccordionHeader
                        targetId={index + '1'}
                        className="about-accordion-heading"
                      >
                        {item.display_name}
                      </AccordionHeader>
                      <AccordionBody
                        accordionId={index + '1'}
                        className="about-accordion-content"
                      >
                        <div className="about-layer">
                          <div
                            className="layer-heading"
                            style={{ marginBottom: '25px' }}
                          >
                            Description
                          </div>
                          <div
                            className="layer-description"
                            style={{ marginBottom: '25px' }}
                          >
                            {item.long_description}
                          </div>
                          <div
                            className="layer-heading"
                            style={{ marginBottom: '25px' }}
                          >
                            Source
                          </div>
                          <div
                            className="layer-description"
                            style={{ marginBottom: '25px' }}
                          >
                            {item.source}
                          </div>
                          <div
                            className="layer-heading"
                            style={{ marginBottom: '25px' }}
                          >
                            Citation
                          </div>
                          <div
                            className="layer-description"
                            style={{ marginBottom: '25px' }}
                          >
                            {item.citation}
                          </div>
                          <div
                            className="layer-heading"
                            style={{ marginBottom: '25px' }}
                          >
                            Standards
                          </div>
                          <div className="layer-description">
                            {item.standards}
                          </div>
                        </div>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                ) : null
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    </Sidebar>
  );
}
export default About;
