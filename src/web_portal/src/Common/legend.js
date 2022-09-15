import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ColorPicker from "./ColorPicker";
import Moment from "moment";
import { BiNavigation } from "react-icons/bi";

var valueKey = 1;

function Legend() {
  let setval = useSelector((state) => state.setval);
  let setplace = useSelector((state) => state.setplace);
  let currentLayer = useSelector((state) => state.CurrentLayer);
  let currentLayerDesc = useSelector((state) => state.LayerDescription);
  let hoverLatLon = useSelector((state) => state.Hoverlatlon);
  let currentlayerType = useSelector((state) => state.CurrentLayerType);
  useEffect(() => {
    valueKey = valueKey + 1;
  }, [setval]);

  return (
    <div className="legend-section">
      <div className="container">
        <div
          className="row"
          style={{
            textAlign: "left",
          }}
        >
          <div className="col" style={{ fontSize: "24px", color: "#fff" }}>
            <span
              style={currentLayer === "LULC" ? { display: "none" } : {}}
              key={valueKey}
            >
              {currentLayer === "POPULATION" ? parseInt(setval) : setval}{" "}
              <span style={{ fontSize: "18px" }}>{currentLayerDesc.unit}</span>
            </span>
          </div>
          <div className="w-100"></div>
          <div className="col" style={{ color: "rgba(215 215 215)" }}>
           {currentLayer === "DPPD" ? "CROP FIRES " : 
           currentLayer === "SOIL_M_DEV" ? "SOIL MOISTURE" : 
           currentLayer === "LST_DPPD" ? "LST"  : 
           currentLayer === "LAI_DPPD" ? "LAI"  : 
           currentLayer === "NDVI_DPPD" ? "NDVI"  : 
           currentLayer} |{" "}
            {Moment(currentLayerDesc.last_updated)
              .format("DD-MM-YYYY")
              .slice(0, 10)}
          </div>
          <div className="w-100"></div>
          {currentlayerType === "Raster" ? (
            <div className="col" style={{ color: "rgba(215 215 215)" }}>
              {hoverLatLon}
              <BiNavigation style={{ transform: "translate(1px, -2px)" }} />
            </div>
          ) : (
            <div className="col" style={{ color: "rgba(215 215 215)" }}>
              {setplace}
            </div>
          )}
          <div className="w-100"></div>
          <div className="col">
            <ColorPicker />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Legend;
