import React, { useState, useEffect, lazy } from "react";
import logo from "./img/undp-logo-blue.svg";
import "./App.css";
import Map from "./Map/Map.js";
import Usecases from "./pages/Usecases";
import About from "./pages/About.js";
import Help from "./pages/Help.js";
import Analytics from "./pages/Analytics.js";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoadingScreen from 'react-loading-screen';
// const Map = React.lazy(() => import('./Map/Map.js'));
// const Usecases = React.lazy(() => import('./pages/Usecases'));
// const About = React.lazy(() => import('./pages/About.js'));
// const Help = React.lazy(() => import('./pages/Help.js'));
// const Analytics = React.lazy(() => import('./pages/Analytics.js'));


function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [loading]);
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {/* <React.Suspense fallback={<p></p>
          }> */}
        <Route  exact path="/">
         <LoadingScreen
              loading={loading}
              bgColor='#f1f1f1'
              spinnerColor='#9ee5f8'
              textColor='#676767'
              // logoSrc={logo}
              text='DiCRA'
              style={{fontSize:"30px"}}
            /> 
             
             <Map />
            </Route>
          <Route path="/use-cases">
            <Usecases />
          </Route>
          <Route path="/about-project">
            <About />
          </Route>
          <Route path="/help">
            <Help />
          </Route>
          <Route path="/analytics">
            <Analytics />
          </Route>
          {/* </React.Suspense> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
