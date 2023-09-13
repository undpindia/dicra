import React, { useState } from 'react';
import Navbar from './Navbar/Navbar';
import HeroSection from './HeroSection/HeroSection';
import StatesSection from './StatesSection/StatesSection';
import SidebarNav from './Sidebar/SidebarNav';
import PartnersSection from './PartnersSection/PartnersSection';
import DPGSection from './DPGSection/DPGSection';
import Footer from './Footer/Footer';
import FeedbackSection from './FeedbackSection/FeedbackSection';
import KnowledgeHub from './KnowledgeHub/KnowledgeHub';
import ScrollToTop from '../../../utils/scroll-helper/ScrollToTop';

export const LandingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    console.log('clicked');
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

      <HeroSection />
      <StatesSection />
      <PartnersSection />
      <DPGSection />
      <KnowledgeHub />
      <FeedbackSection />
      <Footer />
    </div>
  );
};
