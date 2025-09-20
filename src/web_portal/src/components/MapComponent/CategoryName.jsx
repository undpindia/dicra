import React, { Component } from "react";
import { connect } from "react-redux";

const mapStateToProps = (ReduxProps) => {
    return {
      CurrentLayer: ReduxProps.CurrentLayer,
      CurrentRegion: ReduxProps.CurrentRegion,
      LayerDescription: ReduxProps.LayerDescription,
      currentLayerType: ReduxProps.CurrentLayerType,
      pixelvalue: ReduxProps.pixelvalue,
    };
  };
class CategoryName extends Component {
  constructor(props) {
    super(props);
    
  }
  render() {
    return (
      <div>
        <span className="drawer-value">
          <div className="container" style={{ fontSize: "30px" }}>
            <div className="row" style={this.props.CurrentLayer === 'LULC' ? {} : {display:"none"}}>
              <span>{parseInt(this.props.pixelvalue) === 1 ? "water" :
              parseInt(this.props.pixelvalue)  === 2 ? "Trees" :
              parseInt(this.props.pixelvalue)  === 4 ? "Flooded Vegitation" :
              parseInt(this.props.pixelvalue)  === 5 ? "Crops" :
              parseInt(this.props.pixelvalue)  === 7 ? "Built Area" :
              parseInt(this.props.pixelvalue)  === 8 ? "Bare Ground" :
              parseInt(this.props.pixelvalue)  === 9 ? "Snow/Ice" :
              parseInt(this.props.pixelvalue)  === 10 ? "Clouds" :
              parseInt(this.props.pixelvalue)  === 11 ? "Rangeland" : null}</span>
            </div>
            <div className="row" style={this.props.CurrentLayer === 'crop_intensity' ? {} : {display:"none"}}>
            <span>{parseInt(this.props.pixelvalue) === 1 ? "Single Crop" :
              parseInt(this.props.pixelvalue)  === 2 ? "Double Crop" :
              parseInt(this.props.pixelvalue)  === 3 ? "Triple Crop" :
              parseInt(this.props.pixelvalue)  === 4 ? "Other LULC" : null}</span>
            </div>
            <div className="row" style={this.props.CurrentLayer === 'crop_land' ? {} : {display:"none"}}>
            <span>{parseInt(this.props.pixelvalue) === 1 ? "Cropland" :
              parseInt(this.props.pixelvalue)  === 2 ? "NonCropland" : null}</span>
            </div>
            <div style={this.props.CurrentLayer === 'crop_type' ? {} : {display:"none"}}>
            <div className="row" style={this.props.LayerDescription.id === 129 ||  this.props.LayerDescription.id === 207 ? {} : {display:"none"}}>
            <span>{parseInt(this.props.pixelvalue) === 1 ? "Irrigated-DC-rice-rice" :
              parseInt(this.props.pixelvalue)  === 2 ? "Irrigated-DC-rice-pulses" :
              parseInt(this.props.pixelvalue)  === 3 ? "Irrigated-DC-pulses/maize-maize" :
              parseInt(this.props.pixelvalue)  === 4 ? "Irrigated-sugarcane" :
              parseInt(this.props.pixelvalue)  === 5 ? "Rainfed-DC-cotton-rice" :
              parseInt(this.props.pixelvalue)  === 6 ? "Rainfed-DC-sorghum-chickpea/fallow" :
              parseInt(this.props.pixelvalue)  === 7 ? "Rainfed-SC-rice-fallow" :
              parseInt(this.props.pixelvalue)  === 8 ? "Rainfed-SC_pigeonpea/groundnut" :
              parseInt(this.props.pixelvalue)  === 9 ? "Rainfed-SC-cotton/groundnut" :
              parseInt(this.props.pixelvalue)  === 10 ? "Rainfed-SC-pulses" :
              parseInt(this.props.pixelvalue)  === 11 ? "Rainfed-groundnut" :
              parseInt(this.props.pixelvalue)  === 12 ? "Mixed crops" :
              parseInt(this.props.pixelvalue)  === 13 ? "Other LULC" :
              parseInt(this.props.pixelvalue)  === 14 ? "Rangeland" : null}</span>
            </div> 
            <div className="row" style={this.props.LayerDescription.id === 134 ? {} : {display:"none"}}>
            <span>{parseInt(this.props.pixelvalue) === 1 ? "Irrigated-DC-rice-pulses" :
              parseInt(this.props.pixelvalue)  === 2 ? "Irrigated-TC-pulses/rice-rice" :
              parseInt(this.props.pixelvalue)  === 3 ? "Irrigated-DC-maize/potato-wheat" :
              parseInt(this.props.pixelvalue)  === 4 ? "Irrigated-sugarcane" :
              parseInt(this.props.pixelvalue)  === 5 ? "Irrigated-DC-pulses/maize-wheat" :
              parseInt(this.props.pixelvalue)  === 6 ? "Rainfed-supplemental-DC-cotton" :
              parseInt(this.props.pixelvalue)  === 7 ? "Rainfed-SC_pigeonpea/groundnut" :
              parseInt(this.props.pixelvalue)  === 8 ? "Rainfed-SC-cotton/groundnut" :
              parseInt(this.props.pixelvalue)  === 9 ? "Rainfed-SC-millet" :
              parseInt(this.props.pixelvalue)  === 10 ? "Rainfed-DC-sorghum-chickpea/fallow" :
              parseInt(this.props.pixelvalue)  === 11 ? "Rainfed-SC-pulses" :
              parseInt(this.props.pixelvalue)  === 12 ? "Rainfed-SC-rice-fallow" :
              parseInt(this.props.pixelvalue)  === 13 ? "Mixed crops" :
              parseInt(this.props.pixelvalue)  === 14 ? "Other LULC" : null}</span>
            </div>
            <div className="row" style={this.props.LayerDescription.id === 135 ? {} : {display:"none"}}>
            <span>{parseInt(this.props.pixelvalue) === 1 ? "Irrigated-DC-rice-rice/pulses" :
              parseInt(this.props.pixelvalue)  === 2 ? "Irrigated-TC-pulses/rice-rice" :
              parseInt(this.props.pixelvalue)  === 3 ? "Irrigated-DC-pulses/maize-maize" :
              parseInt(this.props.pixelvalue)  === 4 ? "Rainfed-supplemental-DC-cotton" :
              parseInt(this.props.pixelvalue)  === 5 ? "Rainfed-SC_pigeonpea/groundnut" :
              parseInt(this.props.pixelvalue)  === 6 ? "Rainfed-SC-cotton/groundnut" :
              parseInt(this.props.pixelvalue)  === 7 ? "Rainfed-SC-millet" :
              parseInt(this.props.pixelvalue)  === 8 ? "Rainfed-DC-sorghum-chickpea/fallow" :
              parseInt(this.props.pixelvalue)  === 9 ? "Rainfed-SC-pulses" :
              parseInt(this.props.pixelvalue)  === 10 ? "Rainfed-SC-rice-fallow" :
              parseInt(this.props.pixelvalue)  === 11 ? "mixed crops" :
              parseInt(this.props.pixelvalue)  === 12 ? "Other LULC" : null}</span>
            </div>
            </div>
            <div className="row" style={this.props.CurrentLayer === 'crop_stress' ? {} : {display:"none"}}>
            <span>{parseInt(this.props.pixelvalue) === 1 ? "No crop stress" :
              parseInt(this.props.pixelvalue)  === 2 ? "Mild stress" :
              parseInt(this.props.pixelvalue)  === 3 ? "Moderate stress" :
              parseInt(this.props.pixelvalue)  === 4 ? "Severe stress" :
              parseInt(this.props.pixelvalue)  === 5 ? "Cropland/cloud" :
              parseInt(this.props.pixelvalue)  === 6 ? "Water bodies" :
              parseInt(this.props.pixelvalue)  === 7 ? "Other LULC" : null}</span>
            </div>
          </div>
        </span>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CategoryName);
