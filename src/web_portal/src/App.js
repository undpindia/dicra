import React, { useState, useEffect} from "react";
import logo from "./img/logo.png";
import "./App.css";
import Map from "./Map/Map";
import Usecases from "./pages/Usecases";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Policy from "./pages/Policy";
import Terms from "./pages/Terms";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoadingScreen from "react-loading-screen";
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
        window.layerType = "Raster";
      }, 5000);
    }
  }, [loading]);
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {/* <React.Suspense fallback={<p></p>
          }> */}
          <Route exact path="/">
            <LoadingScreen
              loading={loading}
              bgColor="#f1f1f1"
              spinnerColor="#9ee5f8"
              textColor="#676767"
              logoSrc={logo}
              text="DiCRA"
              style={{ fontSize: "30px" }}
            >
              {" "}
              </LoadingScreen>

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
