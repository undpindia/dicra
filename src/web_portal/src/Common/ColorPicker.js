import React, { Component } from "react";
import  Colorscale  from "./Colorpicker/ColorScaleIndex";
import ColorscalePicker from "./Colorpicker/ColorPickerIndex";
import { DEFAULT_SCALE } from "./Colorpicker/constants";
import { DEFAULTDEV_SCALE } from "./Colorpicker/constants";
import { Row, Col } from "reactstrap";
import { clone } from "ramda";
import { BiPalette, BiX } from "react-icons/bi";
import { connect } from 'react-redux';

const mapStateToProps = (ReduxProps) => {
  return {
    CurrentLayer: ReduxProps.CurrentLayer,
    LayerDescription: ReduxProps.LayerDescription,
    CurrentRegion: ReduxProps.CurrentRegion,
    DrawerChange: ReduxProps.ShowDrawer,
    CurrentVector: ReduxProps.CurrentVector,
  };
};
const mapDispatchToProps=(dispatch)=>{
  return{
    changecolor:(cl)=>dispatch({type:"SETCOLOR_SCALE",payload:cl}),
    devchangecolor:(cl)=>dispatch({type:"SETDEVCOLOR_SCALE",payload:cl}),
  }
}
class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showColorscalePicker: false,
      colorscale: DEFAULT_SCALE,
      devcolorscale: DEFAULTDEV_SCALE,
      data: [],
      active: false,
      isActive: true
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeDev = this.onChangeDev.bind(this);
    this.toggleColorscalePicker = this.toggleColorscalePicker.bind(this);
  }
    toggleButton() {
      const currentState = this.state.active;
      this.setState({ active: !currentState });
  };
  handleToggle = () => {
    this.setState({ isActive: !this.state.isActive });
  };
  recolorData = (dataToRecolor) => {
    const data = clone(dataToRecolor);
    return data;
  };

  onChange = (colorscale) => {
    const data = this.recolorData(this.state.data, colorscale);
    this.props.changecolor(colorscale);
    this.setState({
      data: data,
      colorscale: colorscale,
    });      
    
  };
  onChangeDev = (devcolorscale) => {
    const data = this.recolorData(this.state.data, devcolorscale);
    this.props.devchangecolor(devcolorscale);
    this.setState({
      data: data,
      devcolorscale: devcolorscale,
    });      
  };


  toggleColorscalePicker = () => {
    this.setState({ showColorscalePicker: !this.state.showColorscalePicker });
  };
  render() {
    let toggleButtonStyle = {};
    if (this.state.showColorscalePicker) {
      toggleButtonStyle = { borderColor: "#A2B1C6" };
    }
    const isActive = this.state.isActive;
    return (
      <div className="App">
      <div>
        <Row>
          <div className="col-10">
            {this.props.CurrentLayer === "DPPD" || this.props.CurrentLayer === "SOIL_M_DEV" || this.props.CurrentLayer === "LST_DPPD" ?
            (<Colorscale
              colorscale={this.state.devcolorscale}
              onClick={() => {}}
              width={180}
            />)
            :
            (<Colorscale
              colorscale={this.state.colorscale}
              onClick={() => {}}
              width={180}
            />)
          
          }
        
        </div>
        <Col>
        <div
        onClick={this.toggleColorscalePicker}
        className="toggleButton"
        style={toggleButtonStyle}
      >
       {isActive ? <BiPalette className="palette-icon" onClick={this.handleToggle}/> : <BiX className="palette-icon-close" onClick={this.handleToggle}/>} 
        </div>
        </Col>
        </Row>
        <Row style={{fontSize:"11px"}}>
          <Col style={{textAlign:"left"}}>Low</Col>
          <Col className="colorpicker-high" style={{ marginRight: "6px"}}>High</Col>
        </Row>
        {/* Toggle Colorscale Picker */}
      </div>
      {this.state.showColorscalePicker && (
        <ColorscalePicker
          onChange={this.props.CurrentLayer === "DPPD" || this.props.CurrentLayer === "SOIL_M_DEV" || this.props.CurrentLayer === "LST_DPPD" ? this.onChangeDev : this.onChange}
          colorscale={this.props.CurrentLayer === "DPPD" || this.props.CurrentLayer === "SOIL_M_DEV" || this.props.CurrentLayer === "LST_DPPD" ? this.state.devcolorscale :this.state.colorscale}
          width={300}
          disableSwatchControls
        />
      )}
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ColorPicker);