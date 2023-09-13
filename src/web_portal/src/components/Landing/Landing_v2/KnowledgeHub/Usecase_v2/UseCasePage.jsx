import React, { useState } from 'react';
import SidebarNav from '../../Sidebar/SidebarNav';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import UseCaseV2 from './UseCase_v2';

import './UseCasePage.css';
import ScrollToTop from '../../../../../utils/scroll-helper/ScrollToTop';

const UseCasePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div
      style={{
        backgroundColor: '#F5F5F5',
      }}
    >
      <ScrollToTop />
      {isSidebarOpen ? (
        <SidebarNav toggleSidebar={handleToggleSidebar} />
      ) : (
        <Navbar toggleSidebar={handleToggleSidebar} />
      )}
      <div className="usecase-section-container">
        <div className="usecase-heading">
          <span className="usecase-heading-title">Knowledge Hub</span>
          <span className="usecase-heading-subtitle">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis,
            dignissimos. Deleniti saepe eveniet quisquam, quas sunt pariatur
            nobis dolore dolor culpa ab sint architecto amet maiores id totam
            officiis quaerat?
          </span>
        </div>
      </div>

      <div
        style={{
          padding: '0 30px',
        }}
      >
        <UseCaseV2 />
      </div>
      <Footer />
    </div>
  );
};

export default UseCasePage;
