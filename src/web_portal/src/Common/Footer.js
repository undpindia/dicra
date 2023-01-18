import React, { Component } from "react";
import {Link } from "react-router-dom";
export default class Footer extends Component {
  render() {
    return (
        <p>
          <span style={{marginRight:"10px"}}><Link to="/terms" style={{color:"#90989B", fontSize:"13px"}}>Terms of use</Link></span>  
          &nbsp;
          <span  style={{marginRight:"10px"}}><Link to="/policy" style={{color:"#90989B", fontSize:"13px"}}>Privacy policy</Link></span>
          &nbsp;
        </p>
    );
  }
}
