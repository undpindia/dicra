import React from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import MaplibreComponent from './components/MapComponent/Map/MaplibreGl.jsx'
// import About from './components/MapComponent/pages/About.jsx';
import Analytics from './components/MapComponent/pages/Analytics.jsx';
// import Usecase from './components/MapComponent/pages/Usecase.jsx';
import Help from './components/MapComponent/pages/Help';

function App() {
  const baseUrl = process.env.PUBLIC_URL;
  const location = useLocation();
  console.log(location);
  return (
    <div>
      <Routes basename={baseUrl} forceRefresh={true}>
        <Route exact path="/" element={<MaplibreComponent />} />
        <Route path={`${process.env.PUBLIC_URL}/`} element={<MaplibreComponent />} />
        <Route path={`${process.env.PUBLIC_URL}/map`} element={<MaplibreComponent />} />
        {/* <Route path={`${process.env.PUBLIC_URL}/about`} element={<About />} /> */}
        <Route
          path={`${process.env.PUBLIC_URL}/analytics`}
          element={<Analytics />}
        />
        {/* <Route
          path={`${process.env.PUBLIC_URL}/usecases`}
          element={<Usecase />}
        /> */}
        <Route path={`${process.env.PUBLIC_URL}/Help`} element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;
