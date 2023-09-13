import React from 'react';
import './Footer.css';
import { Link as ScrollLink } from 'react-scroll';
import DicraLogo from '../../../../assets/images/landing_page_v2/dicra-logo-white.svg';

const Footer = () => {
  const footerLinks = [
    {
      name: 'Home',
      link: 'home',
    },
    {
      name: 'States',
      link: 'states',
    },
    {
      name: 'Partners',
      link: 'partners',
    },
    {
      name: 'DPG',
      link: 'dpg',
    },
    {
      name: 'Use Cases',
      link: 'use-cases',
    },
    {
      name: 'Feedback',
      link: 'feedback',
    },
  ];

  return (
    <div className="footer-container">
      <div className="footer-left">
        <div className="footer-logo">
          <img src={DicraLogo} alt="logo" />
        </div>
        <div className="footer-description">
          <span>© DiCRA 2023 - All Rights Reserved</span>
        </div>
      </div>
      <div className="footer-right">
        <div className="footer-link-items">
          <div className="footer-link-title">
            <span>Website</span>
          </div>
          {footerLinks.map((item, index) => (
            <ScrollLink
              to={item.link}
              smooth={true}
              duration={100}
              spy={true}
              exact="true"
              offset={-80}
              className="footer-link"
              key={index}
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>

        <div className="footer-link-items-right">
          <div className="footer-link-title">
            <span>Get in Touch</span>
          </div>
          <div className="footer-addres-desc">
            <span>123 anywhere street, your location, City 12345</span>
          </div>
          <div className="footer-addres-desc">
            <span>123-456-7890</span>
            <span>Mail</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
