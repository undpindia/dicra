import React from "react";
import { PropTypes } from "prop-types";
import Legend from "../Common/legend";
import { connect } from "react-redux";
import locationMarker from "../img/locationMK.png";
const mapStateToProps = (props) => {
  return {
    CurrentLayer: props.CurrentLayer,
  };
};



class LegendMobile extends React.Component {

  render() {

    return (
      
        <React.Fragment>

        <div
          className="tab-legend"
          style={
            this.props.CurrentLayer === "FIREEV" ||
            this.props.CurrentLayer === "WEATHER" ||
            this.props.CurrentLayer === "WH" ||
            this.props.CurrentLayer === "CP" ||
            this.props.CurrentLayer === "LULC" 
              ? { display: "none" }
              : {}
          }
        >
          <Legend />
        </div>
        <div
          className="tab-legend"
          style={this.props.CurrentLayer === "FIREEV" ? {} : { display: "none" }}
        >
          <div className="legend-section">
            <div className="container">
              <div
                className="row"
                style={{
                  textAlign: "left",
                }}
              >
                <div
                  className="col-md-2"
                  style={{ color: "rgba(215 215 215)" }}
                >
                  <img src={locationMarker} width="13px" />
                </div>
                <div
                  className="col"
                  style={{ color: "rgba(215 215 215)", fontWeight: "bold" }}
                >
                  Fire Events
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
        </div>
        <div
          className="tab-legend"
          style={this.props.CurrentLayer === "WH" ? {} : { display: "none" }}
        >
          <div className="legend-section">
            <div className="container">
              <div
                className="row"
                style={{
                  textAlign: "left",
                }}
              >
                <div
                  className="col-md-2"
                  style={{ color: "rgba(215 215 215)" }}
                >
                  <img src={locationMarker} width="13px" />
                </div>
                <div
                  className="col"
                  style={{ color: "rgba(215 215 215)", fontWeight: "bold" }}
                >
                  Warehouses
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="tab-legend"
          style={this.props.CurrentLayer === "CP" ? {} : { display: "none" }}
        >
          <div className="legend-section">
            <div className="container">
              <div
                className="row"
                style={{
                  textAlign: "left",
                }}
              >
                <div
                  className="col-md-2"
                  style={{ color: "rgba(215 215 215)" }}
                >
                  <img src={locationMarker} width="13px" />
                </div>
                <div
                  className="col"
                  style={{ color: "rgba(215 215 215)", fontWeight: "bold" }}
                >
                  Markets
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
                  {/* *FRP : Fire Radiative Power */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="tab-legend"
          style={this.props.CurrentLayer === "LULC" ? {} : { display: "none" }}
        >
          <div className="legend-section-lulc">
            <div className="container">
              <div
                className="row"
                style={{
                  textAlign: "left",
                }}
              >
                <div class="container" style={{fontSize:"12px"}}>
                    <div class="row">
                      <div class="col" style={{marginTop:"10px"}}>
                       <span style={{height:"12px", width:"12px",backgroundColor:"#dc0f0f", display:"inline-block" }}></span>  Water
                      </div>
                      <div class="col" style={{marginTop:"10px"}}>
                      <span style={{height:"12px", width:"12px",backgroundColor:"#44ce5d", display:"inline-block" }}></span>  Trees
                      </div>
                    </div>
                    <div class="row">
                    <div class="col">
                      <span style={{height:"12px", width:"12px",backgroundColor:"#de8313", display:"inline-block" }}></span>  Flooded Vegitation
                      </div>
                      <div class="col">
                      <span style={{height:"12px", width:"12px",backgroundColor:"#dfef4d", display:"inline-block" }}></span>  Crops
                      </div>
                    </div>
                    <div class="row">
                       <div class="col">
                      <span style={{height:"12px", width:"12px",backgroundColor:"#bb3cc9", display:"inline-block" }}></span>  Built Area
                      </div>
                      <div class="col">
                      <span style={{height:"12px", width:"12px",backgroundColor:"#455dca", display:"inline-block" }}></span>  Bare Ground
                      </div>
                    </div>
                    <div class="row">
                    <div class="col">
                      <span style={{height:"12px", width:"12px",backgroundColor:"#3feabd", display:"inline-block" }}></span>  Snow / Ice
                      </div>
                      <div class="col">
                      <span style={{height:"12px", width:"12px",backgroundColor:"#cf3c8d", display:"inline-block" }}></span>  Clouds
                      </div>
                    </div>
                    <div class="row">
                    <div class="col">
                      <div class="col">
                      <span style={{height:"12px", width:"12px",backgroundColor:"#64caef", display:"inline-block" }}></span>  Rangeland
                      </div>
                    </div>
                    </div>
                 </div>
                <div className="mb-2"></div>
              </div>
            </div>
          </div>
        </div>
        </React.Fragment>
    );
  }

};
export default connect(mapStateToProps, null)(LegendMobile);
