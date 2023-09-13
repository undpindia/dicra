import React from 'react';
import './SidebarNav.css';
import { Link as ScrollLink } from 'react-scroll';
import { CustomButton } from '../../UI/UiElements';
import CloseIcon from '../../../../assets/images/landing_page_v2/close-icon.svg';

const SidebarNav = ({ toggleSidebar }) => {
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
      link: '#',
    },
    {
      name: 'DPG',
      link: '#',
    },
    {
      name: 'Use Cases',
      link: '#',
    },
    {
      name: 'Feedback',
      link: '#',
    },
  ];

  return (
    <div className="sidebar-container" onClick={toggleSidebar}>
      <div className="sidebar-icon" onClick={toggleSidebar}>
        <img src={CloseIcon} alt="close-icon" />
      </div>

      <div className="sidebar-wrapper">
        {menuItems.map((item, index) => (
          <div className="sidebar-menu" key={index}>
            <ScrollLink
              className="sidebar-links"
              to={item.link}
              onClick={toggleSidebar}
            >
              {item.name}
            </ScrollLink>
          </div>
        ))}
      </div>

      <div className="sidebar-btn-wrapper">
        <CustomButton buttonLabel="View States" />
      </div>
    </div>
  );
};

export default SidebarNav;
