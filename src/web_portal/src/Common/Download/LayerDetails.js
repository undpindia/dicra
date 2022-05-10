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
    setdownloadfile: (inc) =>
      dispatch({ type: "SETDOWNLOADFILE", payload: inc }),
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
      selectedFile: "",
      DownloadLayer: "NDVI",
      availableFiles: [],
      layerDesc:
        "Normalized Difference Vegetation Index (NDVI) quantifies vegetation by measuring the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs)",
      layersource: "GLAM NDVIDB",
    };
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  readMore = () => {
    this.setState({
      close: !this.state.close,
    });
  };

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
        this.getavailableFiles();
      }
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.getavailableFiles();
    }
  }
  async getavailableFiles() {
    try {
      const res = await axiosConfig.get(
        `/getfilenames?parameter=` + this.props.DownloadLayer
      );
      this.setState(
        {
          availableFiles: res.data.available_files,
        },
        () => {
          this.props.setdownloadfile(
            this.state.availableFiles[0].filename_on_blob
          );
        }
      );
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  changeFile(e) {
    this.props.setdownloadfile(e.target.value);
    this.setState({
      selectedFile: e.target.value,
    });
  }
  componentDidMount() {
    this.getavailableFiles();
  }
  render() {
    const { size } = this.state;
    const { close } = this.state;
    return (
      <React.Fragment>
        <hr className="horizontal-line" style={{ marginTop: "30px" }} />

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
                  // disabled={this.props.layers.isavailable ? false : true}
                  onChange={(e) => this.changeLayer(e)}
                >
                  {this.props.layers.map(function (layer) {
                    if (layer.isavailable) {
                      return (
                        <option
                          value={layer.layer_name}
                          disabled={layer.isavailable ? false : true}
                        >
                          {layer.display_name}
                        </option>
                      );
                    }
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

              <FormGroup>
                <div style={{ textAlign: "left" }}> Available Files :</div>
                <Input
                  type="select"
                  name="name"
                  id="Nameselect"
                  className="dropdown"
                  style={{ marginTop: "10px" }}
                  value={this.state.selectedFile}
                  onChange={(e) => this.changeFile(e)}
                >
                  {this.state.availableFiles.map(function (layer) {
                    return (
                      <option value={layer.filename_on_blob}>
                        {layer.filename_on_blob}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            </Form>
          </div>
        </div>
        <p
          className="open-api"
          style={{
            "font-size": "10px",
            "font-family": "'proxima-nova', sans-serif",
            textAlign: "left",
            fontStyle: "italic",
          }}
        >
          You can also download the data using our open API.{" "}
          <a
            target="_blank"
            href={"https://internalapidev.chickenkiller.com/docs#"}
          >
            know more
          </a>
        </p>
      </React.Fragment>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LayerDetails);
