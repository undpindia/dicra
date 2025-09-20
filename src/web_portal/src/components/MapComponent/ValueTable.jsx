import React, { Component } from "react";
import { connect } from "react-redux";

const mapStateToProps = (ReduxProps) => {
    return {
      CurrentLayer: ReduxProps.CurrentLayer,
      CurrentRegion: ReduxProps.CurrentRegion,
      LayerDescription: ReduxProps.LayerDescription,
      currentLayerType: ReduxProps.CurrentLayerType,
      pixelvalue: ReduxProps.pixelvalue,
      lulcpercentage: ReduxProps.setLulcPercentage,
      croppercentage: ReduxProps.setCropPercentage
    };
  };
class ValueTable extends Component {
  constructor(props) {
    super(props);
    
  }
  render() {
    return (
      <div>
        <span className="drawer-value">
          <div className="container" style={{ fontSize: "12px" }}>
            <div className="row" style={this.props.CurrentLayer === 'LULC' ? {} : {display:"none"}}>
              <div className="col lulc-header">Water</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[1]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Trees</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[2]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Flooded Vegetation</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[4]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Crops</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[5]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Built Area</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[7]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Bare ground</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[8]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Snow or Ice</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[9]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Clouds</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[10]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rangeland</div>
              <div className="col">
                {parseFloat(this.props.lulcpercentage[11]).toFixed(2)} %
              </div>
            </div>
            <div className="row" style={this.props.CurrentLayer === 'crop_intensity' ? {} : {display:"none"}}>
              <div className="col lulc-header">Single Crop</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[1]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Double Crop</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[2]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Triple Crop</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[3]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Other LULC</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[4]).toFixed(2)} %
              </div>
            </div>
            <div className="row" style={this.props.CurrentLayer === 'crop_land' ? {} : {display:"none"}}>
              <div className="col lulc-header">Cropland</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[1]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">NonCropland</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[2]).toFixed(2)} %
              </div>
            </div>
            <div style={this.props.CurrentLayer === 'crop_type' ? {} : {display:"none"}}>
            <div className="row" style={this.props.LayerDescription.id === 129 || this.props.LayerDescription.id === 207 ? {} : {display:"none"}}>
              <div className="col lulc-header">Irrigated-DC-rice-rice</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[1]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-DC-rice-pulses</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[2]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-DC-pulses/maize-maize</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[3]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-sugarcane</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[4]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-DC-cotton-rice</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[5]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-DC-sorghum-chickpea/fallow</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[6]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-rice-fallow</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[7]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC_pigeonpea/groundnut</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[8]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-cotton/groundnut</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[9]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-pulses</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[10]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-groundnut</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[11]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Mixed crops</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[12]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Other LULC</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[13]).toFixed(2)} %
              </div>
            </div> 
            <div className="row" style={this.props.LayerDescription.id === 134 ? {} : {display:"none"}}>
              <div className="col lulc-header">Irrigated-DC-rice-pulses</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[1]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-TC-pulses/rice-rice</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[2]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-DC-maize/potato-wheat</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[3]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-sugarcane</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[4]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-DC-pulses/maize-wheat</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[5]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-supplemental-DC-cotton</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[6]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC_pigeonpea/groundnut</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[7]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-cotton/groundnut</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[8]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-millet</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[9]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-DC-sorghum-chickpea/fallow</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[10]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-pulses</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[11]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-rice-fallow</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[12]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Mixed crops</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[13]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Other LULC</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[14]).toFixed(2)} %
              </div>
            </div>
            <div className="row" style={this.props.LayerDescription.id === 135 ? {} : {display:"none"}}>
              <div className="col lulc-header">Irrigated-DC-rice-rice/pulses</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[1]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-TC-pulses/rice-rice</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[2]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Irrigated-DC-pulses/maize-maize</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[3]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-supplemental-DC-cotton</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[4]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC_pigeonpea/groundnut</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[5]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-cotton/groundnut</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[6]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-millet</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[7]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-DC-sorghum-chickpea/fallow</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[8]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-pulses</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[9]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Rainfed-SC-rice-fallow</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[10]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">mixed crops</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[11]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Other LULC</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[12]).toFixed(2)} %
              </div>
             
             
            </div>
            </div>
            <div className="row" style={this.props.CurrentLayer === 'crop_stress' ? {} : {display:"none"}}>
              <div className="col lulc-header">No crop stress</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[1]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Mild stress</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[2]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Moderate stress</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[3]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Severe stress</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[4]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Cropland/cloud</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[5]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Water bodies</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[6]).toFixed(2)} %
              </div>
              <div className="w-100"></div>
              <div className="col lulc-header">Other LULC</div>
              <div className="col">
                {parseFloat(this.props.croppercentage[7]).toFixed(2)} %
              </div>
            </div>
          </div>
        </span>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ValueTable);
