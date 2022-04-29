import React, { useEffect, useState }  from "react";
import ColorScale from "./ColorScale";
import { useSelector, useDispatch } from "react-redux";
import ColorPicker from "./ColorPicker";
var valueKey=1
function Legend() {
  let setval = useSelector((state) => state.setval);
  let setplace = useSelector((state) => state.setplace);
  let currentLayer = useSelector((state) => state.CurrentLayer);
  let currentLayerDesc = useSelector((state) => state.LayerDescription);
  useEffect(() => {
    valueKey=valueKey+1
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
          <div className="col" style={{ fontSize: "24px", color: "#fff" }} >
            <span style={currentLayer == "LULC" ? { display: "none" } : {}} key={valueKey}>
              {setval}{" "}{currentLayerDesc.unit}
            </span>
          </div>
          <div className="w-100"></div>
          <div className="col" style={{ color: "rgba(215 215 215)" }}>
            {currentLayer} | {currentLayerDesc.last_updated.slice(0, 10)}
          </div>
          <div className="w-100"></div>
          <div className="col" style={{ color: "rgba(215 215 215)" }}>
            {setplace}
          </div>
          <div className="w-100"></div>
          <div className="col">
            <ColorPicker />
            {/* <ColorScale /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Legend;
