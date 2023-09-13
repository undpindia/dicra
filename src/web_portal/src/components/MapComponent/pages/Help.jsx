import React, { useState } from 'react';
import './style.css';
import Header from '../Common/Header';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';
import Config from '../Config/config';
import Sidebar from '../Common/Sidebar';
import BottomNav from '../Common/BottomNav/BottomNav';
function Help(props) {
  const [open, setOpen] = useState('');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  return (
    <Sidebar>
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>
        <div className="container-page">
          <div className="help-section-wrapper">
            <div className="help-heading">Help</div>
            <div className="help-content">
              <div>
                <Accordion flush open={open} toggle={toggle}>
                  <AccordionItem>
                    <AccordionHeader
                      targetId="1"
                      className="help-accordion-heading"
                    >
                      Background
                    </AccordionHeader>
                    <AccordionBody
                      accordionId="1"
                      className="help-accordion-content"
                    >
                      UNDP has partnered with the Government of {Config.state}{' '}
                      to jointly initiate the NextGenGov ‘Data for Policy’
                      initiative on Food Systems. The aim is to incorporate
                      anticipatory governance models for future-fit food systems
                      in {Config.state}
                      using data-driven policymaking tools and ecosystem-driven
                      approaches. UNDP is keen on augmenting learning
                      capabilities, increasing the predictive or anticipatory
                      capacity to feed-in to evidence-driven policies in the
                      state, and create radical traceability and transparency
                      across the system from producers to consumers by building
                      provenance documentation around food that can help build
                      trust in the system at the same time nurture sustainable
                      and healthy practices. The goal is to design, develop and
                      demonstrate anticipatory governance models for food
                      systems in {Config.state} using digital public goods and
                      community-centric approaches to strengthen data-driven
                      policy making in the state.{' '}
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader
                      targetId="2"
                      className="help-accordion-heading"
                    >
                      About Data for Policy in Food Systems Geospatial Platform
                    </AccordionHeader>
                    <AccordionBody
                      accordionId="2"
                      className="help-accordion-content"
                    >
                      The Food Systems Innovation platform for {Config.state} is
                      envisioned as a Digital Public Good that will
                      strategically feed into data-driven decision making in the
                      state. The platform will have the capability to visualize
                      and analyze high resolution geospatial data (both vector
                      as well as raster layers). The digital platform will
                      curate, integrate and visualise such critical datasets and
                      assets to answer the basic question of - What is growing
                      where? How much is there and the spatial and temporal
                      changes within the state across various indicators
                      relevant to Agriculture and Food Systems. The platform
                      should be able to visualize over time the changes that
                      have happened to the agriculture ecosystem in terms of
                      crop diversity, changes in soil/ground water, tree cover,
                      and other indicators at higher resolution to support
                      policy decisions. Such a synthesis of data and analytics
                      can help identify farms which are doing exceptionally well
                      (Positive Deviance) through which repositories of good
                      practices and indigenous knowledge can be documented. This
                      also helps in identifying farms that are not doing good as
                      per the defined indicators (Negative Deviance). Positive
                      and negative deviance would be particularly interesting to
                      policy makers since they provide valuable intelligence on
                      – which farms are having exceptionally high productivity
                      compared to others? Which farms are most resilient (or
                      most vulnerable) to extreme weather incidents? Such
                      intelligence when combined with farmer-centric
                      ethnographic research on the ground will provide insights
                      and patterns on climate resilient agriculture practices
                      that are already working well on the ground. The
                      combination of data-driven and community-centric
                      approaches when translated into policy insights can
                      generate policy effects for strengthening climate
                      resilient agriculture.
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader
                      targetId="3"
                      className="help-accordion-heading"
                    >
                      Data Flow
                    </AccordionHeader>
                    <AccordionBody
                      accordionId="3"
                      className="help-accordion-content"
                    >
                      Data collaboration and synchronization is vital for
                      implementing this technology solution. This platform aims
                      to incorporate data from Open data platforms, Non-Public
                      Domain datasets through data partnerships and incorporate
                      data from open APIs.{' '}
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
        <BottomNav pathName="help" />
      </React.Fragment>
    </Sidebar>
  );
}
export default Help;
