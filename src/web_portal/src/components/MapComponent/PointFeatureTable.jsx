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
    croppercentage: ReduxProps.setCropPercentage,
    pointfeature: ReduxProps.pointfeature,
  };
};

class PointFeature extends Component {
  render() {
    const properties = this.props.pointfeature?.properties || {};

    return (
      <div className="drawer-value">
        <div className="point-container">
          {/* Warehouse Layer */}
          {this.props.CurrentLayer === "WH" && (
            <div className="layer-section warehouse-info">
              <p className="point-row">
                <span className="point-label">Capacity :</span>
                <span className="point-value">{properties["Total Storage Capacity (MT)"] || "N/A"}  MT</span>
              </p>
              <p className="point-row">
                <span className="point-label">Warehouse Name :</span>
                <span className="point-value">{properties["Owner's Name"] || "N/A"}</span>
              </p>
              <p className="point-row">
                <span className="point-label">District :</span>
                <span className="point-value">{properties["Owner's District Name"] || "N/A"}</span>
              </p>
            </div>
          )}
          {this.props.CurrentLayer === "FIREEV" && (
            <div className="layer-section fireev-info">
              <p className="point-row">
                <span className="point-label">FRP :</span>
                <span className="point-value">{properties["frp"] || "N/A"}</span>
              </p>
              <p className="point-row">
                <span className="point-label">Date :</span>
                <span className="point-value">{properties["acq_date"] || "N/A"}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(PointFeature);
