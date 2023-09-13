import React from 'react';
import './Navbar.css';
import DicraLogo from '../../../../assets/images/landing_page_v2/dicra-logo.svg';
import BarsIcon from '../../../../assets/images/landing_page_v2/bars-icon.svg';

import { Link as ScrollLink, scroller } from 'react-scroll';
import { CustomButton } from '../../UI/UiElements';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
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

  const scrollToSection = (section) => {
    navigate('/');

    setTimeout(() => {
      scroller.scrollTo(section, {
        duration: 100,
        smooth: true,
        offset: -80,
      });
    }, 0);
  };

  return (
    <div className="navbar-custom">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={DicraLogo} alt="logo" />
        </div>

        <div className="mobile-icon" onClick={toggleSidebar}>
          <img src={BarsIcon} alt="bars-icon" />
        </div>

        <div className="navbar-menu">
          {menuItems.map((item, index) => (
            <ul className="menu-items" key={index}>
              <ScrollLink
                className="menu-links"
                to={item.link}
                spy={true}
                smooth={true}
                offset={-80}
                duration={300}
                activeClass="menu-links-active"
                onClick={() => scrollToSection(item.link)}
              >
                {item.name}
              </ScrollLink>
            </ul>
          ))}
        </div>

        <div className="navbar-button-wrapper">
          <CustomButton
            buttonLabel="View States"
            onClick={() => scrollToSection('states')}
            offset={-80}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
