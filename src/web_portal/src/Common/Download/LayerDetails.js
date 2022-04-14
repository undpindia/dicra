import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
} from "reactstrap";
import { DatePicker, Radio, Space, message } from "antd";
import axiosConfig from "../../Common/axios_Config";
import { arrayExpression } from "@babel/types";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { connect } from "react-redux";
import {
  setdownloadlayer,
  setdownloadlayerdate,
  setdownloadlayerregion,
  setdownloadlayertype,
} from "../../actions";
const mapStateToProps = (props) => {
  return {
    layers: props.Layers,
    currentLayer: props.CurrentLayer,
    DownloadLayerType: props.DownloadLayerType,
    DownloadLayer: props.DownloadLayer,
    LayerDescription: props.LayerDescription,
    DownloadLayerDesc: props.DownloadLayerDesc,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setdownloadlayer: (inc) =>
      dispatch({ type: "SETDOWNLOADLAYER", payload: inc }),
    setdownloadlayerdate: (inc) =>
      dispatch({ type: "SETLAYERDATE", payload: inc }),
    setdownloadlayerregion: (inc) =>
      dispatch({ type: "SETLAYERREGION", payload: inc }),
    setdownloadlayertype: (inc) =>
      dispatch({ type: "SETLAYERTYPE", payload: inc }),
    setdownloadlayerdesc: (inc) =>
      dispatch({ type: "DOWNCHANGELAYERDESC", payload: inc }),
  };
};
class LayerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "default",
      close: true,
      availableDates: [],
      showRegion: false,
      keycalender: 1,
      DownloadLayer: "NDVI",
      layerDesc:
        "Normalized Difference Vegetation Index (NDVI) quantifies vegetation by measuring the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs)",
      layersource: "GLAM NDVIDB",
    };
    this.disabledates = this.disabledates.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onChangeLayerType = this.onChangeLayerType.bind(this);
  }
  onChange = (e) => {
    console.log("radio1 checked", e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  readMore = () => {
    this.setState({
      close: !this.state.close,
    });
  };
  async getavailabledates() {
    try {
      const res = await axiosConfig.get(
        `/availabledates/` + this.props.DownloadLayer
      );
      this.setState(
        {
          availableDates: res.data.available_dates,
        },
        () => {
          this.setState({
            keycalender: this.state.keycalender + 1,
          });
        }
      );
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  disabledates(current) {
    var arr_list = [];
    this.state.availableDates.map(function (dates) {
      arr_list.push(dates.available_date);
    });
    var date = new Date(current);
    var to_dd = String(date.getDate()).padStart(2, "0");
    var to_mm = String(date.getMonth() + 1).padStart(2, "0");
    var to_yyyy = date.getFullYear();
    var to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
    if (arr_list.includes(to_date)) {
      return false;
    } else {
      return true;
    }
  }
  handleDateChange(dateString) {
    const date = new Date(dateString);
    this.setState({
      defaultdate: date,
    });
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var date_conv = yyyy + "-" + mm + "-" + dd;
    this.props.setdownloadlayerdate(String(date_conv));
    if (date_conv >= 0) {
      // this.setState({
      //   download: false,
      // });
      console.log("true");
    } else {
      // this.setState({
      //   download: true,
      // });
      console.log("false");
    }
    console.log("date", date_conv);
  }
  onChangeLayerType(type) {
    if (type == "Raster") {
      this.props.setdownloadlayertype("Raster");
      this.setState({
        showRegion: false,
      });
    } else if (type == "Vector") {
      this.props.setdownloadlayertype("Vector");
      this.setState({
        showRegion: true,
      });
    }
  }

  changeLayer(e) {
    this.props.setdownloadlayer(e.target.value);
    this.props.setdownloadlayerdesc(this.props.layers[e.target.selectedIndex]);

    this.setState(
      {
        DownloadLayer: e.target.value,
        layerDesc: this.props.layers[e.target.selectedIndex].long_description,
        layersource: this.props.layers[e.target.selectedIndex].source,
      },
      () => {
        this.getavailabledates();
      }
    );
  }
  componentDidMount() {
    this.getavailabledates();
  }
  render() {
    const { size } = this.state;
    const { close } = this.state;
    return (
      <React.Fragment>
        <hr style={{ marginTop: "30px" }} />
        <div className="download-section">
          <div className="downloads-content">
            <Form>
              <FormGroup>
                <Input
                  type="select"
                  name="name"
                  id="Nameselect"
                  className="dropdown"
                  value={this.props.DownloadLayer}
                  onChange={(e) => this.changeLayer(e)}
                >
                  {this.props.layers.map(function (layer) {
                    return (
                      <option value={layer.layer_name}>
                        {layer.display_name}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>

              <div style={{ textAlign: "left" }}>
                {this.props.DownloadLayerDesc.long_description}
              </div>
              <br />
              <div style={{ textAlign: "left" }}>
                {" "}
                Source : {this.state.layersource}{" "}
              </div>
              <div>&nbsp;</div>
              <FormGroup
                style={
                  this.props.DownloadLayerDesc.multiple_files ? {} : { display: "none" }
                }
              >
                <DatePicker
                  disabledDate={this.disabledates}
                  onChange={this.handleDateChange}
                  format="YYYY-MM-DD"
                  key={this.state.keycalender}
                />
              </FormGroup>
              <FormGroup>
                <div style={{ textAlign: "left", paddingBottom: "5px" }}>
                  TYPE
                </div>
                <Row style={{ fontSize: "14px" }}>
                  <Col>
                    <FormGroup style={{ textAlign: "left", marginLeft: "5px" }}>
                      <Label>
                        <Input
                          type="checkbox"
                          defaultChecked
                          checked={
                            this.props.DownloadLayerType === "Raster"
                              ? true
                              : false
                          }
                          onClick={(e) => {
                            this.onChangeLayerType("Raster");
                          }}
                        />{" "}
                        Raster
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup
                      check
                      style={{ textAlign: "left", marginLeft: "5px" }}
                    >
                      <Label>
                        <Input
                          type="checkbox"
                          checked={
                            this.props.DownloadLayerType === "Vector"
                              ? true
                              : false
                          }
                          onClick={(e) => {
                            this.onChangeLayerType("Vector");
                          }}
                        />{" "}
                        Vector
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup
                style={this.state.showRegion ? {} : { display: "none" }}
              >
                <div style={{ textAlign: "left", paddingBottom: "5px" }}>
                  VECTOR BOUNDARY
                </div>
                <Input
                  type="select"
                  name="region"
                  id="exampleSelect"
                  className="dropdown"
                  onChange={(e) =>
                    this.props.setdownloadlayerregion(e.target.value)
                  }
                >
                  <option value="DISTRICT">District</option>
                  <option value="MANDAL">Mandal</option>
                </Input>
              </FormGroup>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LayerDetails);
