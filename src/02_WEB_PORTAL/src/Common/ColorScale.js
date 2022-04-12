import React from "react";
import { render } from "react-dom";
import chroma from "chroma-js";

const styles = {
  fontFamily: "sans-serif",
};

const LENGTH = 15;

const getIndices = (length) =>
  Array.from({ length }, (k, v) => v * (1 / length));

const getColors = (scale, length) =>
  getIndices(length)
    .map(scale)
    .map((x) => `rgba(${x._rgb.map((x) => parseInt(x, 10)).join(",")})`);
const Scale = ({ brewer = "qwqwqw" }) => {
  const colors = getColors(chroma.scale(brewer).domain([0,1]), LENGTH);
  return (
    <div>
      {colors.map(Color)}
      <div className="row" style={{ width: 175, fontWeight:"lighter"}}>
        <div className="col" style={{paddingTop:"0px", fontSize:"10px"}}>Low</div>
        <div className="col" style={{paddingTop:"0px", fontSize:"10px", textAlign:"right"}}>High</div>
      </div>
    </div>
  );
};

const Color = (color) => (
  <div
    style={{
      backgroundColor: color,
      width: 10,
      height: 10,
      display: "inline-block",
    }}
  />
);

const scales = ["Spectral"];
const ColorScale = () => (
  <div style={styles}>
    {scales.map((s) => (
      <Scale key={s} brewer={s} />
    ))}
  </div>
);

export default ColorScale;
