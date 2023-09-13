import React from 'react';
import '../Sidebar.css';
import Marker from '../../../../assets/images/locationMK.png'
function FELegend() {
 
  return (
    <div className="legend-section-lulc">
    <div className="container">
      <div
        className="row"
        style={{
          textAlign: 'left',
        }}
      >
        <div className="container">
          <div className="row">
            <div
                className="row"
                style={{
                  textAlign: "left",
                }}
              >
                <div
                  className="col legend-layer-name"
                  style={{ color: "rgba(215 215 215)", fontWeight: "bold" }}
                >
                 <span><img src={Marker} width="15px" alt="Location Marker"/><span style={{marginLeft:"20px"}}>Fire Events&nbsp;&nbsp;</span></span>
                </div>
                <div className="w-100"></div>
                <div
                  className="col"
                  style={{
                    color: "rgba(215 215 215)",
                    fontSize: "10px",
                    marginTop: "10px",
                  }}
                >
                  *FRP : Fire Radiative Power
                </div>
              </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
  </div>
  );
}
export default FELegend;
