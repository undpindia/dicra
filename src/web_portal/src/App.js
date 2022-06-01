import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./Map/Map";
import Usecases from "./pages/Usecases";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Policy from "./pages/Policy";
import Terms from "./pages/Terms";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// const Map = React.lazy(() => import('./Map/Map.js'));
// const Usecases = React.lazy(() => import('./pages/Usecases'));
// const About = React.lazy(() => import('./pages/About.js'));
// const Help = React.lazy(() => import('./pages/Help.js'));
// const Analytics = React.lazy(() => import('./pages/Analytics.js'));

function App() {
  const [loading, setLoading] = useState(true);
 
  // console.clear()
  useEffect(() => {
    // console.clear()
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        window.layerType = "Raster";
      }, 5000);
    }
  }, [loading]);
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
          <Map />
          </Route>
          <Route path="/use-cases">
            <Usecases />
          </Route>
          <Route path="/about-project">
            <About />
          </Route>
          <Route path="/analytics">
            <Analytics />
          </Route>
          <Route path="/terms">
            <Terms />
          </Route>
          <Route path="/policy">
            <Policy />
          </Route>
          {/* </React.Suspense> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
