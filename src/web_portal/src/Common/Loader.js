import React from "react";
import { ThreeBounce } from "better-react-spinkit";
import img from "../img/logo.png";
import "./common.css"

export default function Loader() {
  return (
      <div className="centered-element">
        <div style={{ textAlign: "center"}}>
          <img src={img} alt="loader" width={150} />
        </div>
        <div
          style={{ textAlign: "center", marginBottom: "5px", marginTop: "15px" }}
        >
          <ThreeBounce size={15} color="#9ee5f8" />
        </div>

        <div
          style={{
            fontSize: "50px",
            textAlign: "center",
            color: "#676767",
            fontWeight: "bold",
          }}
        >
          DiCRA
        </div>
      </div>
  );
}
