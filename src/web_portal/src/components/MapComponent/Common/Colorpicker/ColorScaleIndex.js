import React, { Component } from "react";
import {DEFAULT_SCALE,DEFAULTDEVCF_SCALE, DEFAULTDEV_SCALE } from "./constants";

export default class Colorscale extends Component {
  render() {
    const scale = this.props.colorscale ? this.props.colorscale : DEFAULT_SCALE;
    const devscalecf = this.props.colorscale
      ? this.props.colorscale
      : DEFAULTDEVCF_SCALE;
    const devscale = this.props.colorscale
      ? this.props.colorscale
      : DEFAULTDEV_SCALE;

    return (
      <div style={{ width: "100%" }} className="colorscale-container">
        {this.props.label ? (
          <div
            className="colorscale-label"
            style={{
              fontSize: "12px",
              color: "#ffffff",
              display: "inline-block",
              width: "25%",
              textAlign: "start",
            }}
          >
            {this.props.label}
          </div>
        ) : null}
        <div
          className="colorscale-palette-container"
          style={{
            display: "inline-block",
            textAlign: "start",
            width: this.props.label ? "75%" : "100%",
          }}
        >
          {this.props.currentLayer === "NO2_DPPD" || this.props.currentLayer === "PM25_DPPD" || this.props.currentLayer === "LST_DPPD"|| this.props.currentLayer === "DPPD" ?
          (
            <div
              className="colorscale-block"
              style={{
                fontSize: "0px",
                display: "inline-block",
                width: "100%",
              }}
              onClick={() =>
                this.props.onClick(devscalecf, this.props.start, this.props.rot)
              }
            >
              {devscalecf.map((x, i) => (
                <div
                  key={i}
                  className="colorscale-swatch"
                  style={{
                    backgroundColor: x,
                    width: "" + 100.0 / scale.length + "%",
                    height: "20px",
                    margin: "0 auto",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          ) : this.props.currentLayer === "SOIL_M_DEV" ||
          this.props.currentLayer === "LAI_DPPD" ||
          this.props.currentLayer === "SOC_DPPD" ||
          this.props.currentLayer === "NDVI_DPPD" ?
          (
          <div
              className="colorscale-block"
              style={{
                fontSize: "0px",
                display: "inline-block",
                width: "100%",
              }}
              onClick={() =>
                this.props.onClick(devscale, this.props.start, this.props.rot)
              }
            >
              {devscale.map((x, i) => (
                <div
                  key={i}
                  className="colorscale-swatch"
                  style={{
                    backgroundColor: x,
                    width: "" + 100.0 / scale.length + "%",
                    height: "20px",
                    margin: "0 auto",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          ) 
          : (
            <div
              className="colorscale-block"
              style={{
                fontSize: "0px",
                display: "inline-block",
                width: "100%",
              }}
              onClick={() =>
                this.props.onClick(scale, this.props.start, this.props.rot)
              }
            >
              {scale.map((x, i) => (
                <div
                  key={i}
                  className="colorscale-swatch"
                  style={{
                    backgroundColor: x,
                    width: "" + 100.0 / scale.length + "%",
                    height: "20px",
                    margin: "0 auto",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
