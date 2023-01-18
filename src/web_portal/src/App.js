import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./Map/Map";
import Usecases from "./pages/Usecases";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Policy from "./pages/Policy";
import Terms from "./pages/Terms";
import FieldStories from "./pages/FieldStories";
import Data4Policy from "./pages/Data4Policy";
import { BrowserRouter, Route, Switch } from "react-router-dom";


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
          <Route path="/field-stories">
            <FieldStories />
          </Route>
          <Route path="/data4policy">
            <Data4Policy />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
