import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox,
} from "availity-reactstrap-validation";

import Captcha from "demos-react-captcha";
import { connect } from "react-redux";
import axiosConfig from "../axios_Config";
import { saveAs } from "file-saver";
import { message } from "antd";
const options = [
  { label: "Commercial", value: "Commercial" },
  { label: "Non-Commercial", value: "Non-commercial" },
];
const mapStateToProps = (props) => {
  return {
    DownloadLayer: props.DownloadLayer,
    DownloadLayerDate: props.DownloadLayerDate,
    DownloadLayerRegion: props.DownloadLayerRegion,
    DownloadLayerType: props.DownloadLayerType,
  };
};

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      size: "default",
      name: "",
      mailID: "",
      usage: "",
      purpose: "",
      download: true,
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeCaptcha = this.onChangeCaptcha.bind(this);
    this.downloadfile = this.downloadfile.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: [e.target.value],
    });
  }
  onChangeCaptcha(value) {
    console.log(value);
    if (value == true) {
      this.setState({
        download: false,
      });
    } else {
      this.setState({
        download: true,
      });
    }
  }
  async downloadfile() {
    if (this.props.DownloadLayerType == "Raster") {
      try {
        saveAs(
          "http://52.172.226.109:5004/downloadraster?&parameter=" +
            String(this.props.DownloadLayer) +
            "&date=" +
            String(this.props.DownloadLayerDate) +
            "&name=" +
            String(this.state.name[0]) +
            "&email=" +
            String(this.state.mailID[0]) +
            "&usage_type=" +
            String(this.state.usage[0]) +
            "&purpose=" +
            String(this.state.purpose[0]),
          "NDVI.tif"
        );
      } catch (err) {
        message.error("Failed to connect to server");
      }
    } else if (this.props.DownloadLayerType == "Vector") {
      try {
        saveAs(
          "http://52.172.226.109:5004/downloadvector?&parameter=" +
            String(this.props.DownloadLayer) +
            "&date=" +
            String(this.props.DownloadLayerDate) +
            "&name=" +
            String(this.state.name[0]) +
            "&email=" +
            String(this.state.mailID[0]) +
            "&usage_type=" +
            String(this.state.usage[0]) +
            "&purpose=" +
            String(this.state.purpose[0]) +
            "&region=" +
            String(this.props.DownloadLayerRegion),
          "Vector.Geojson"
        );
      } catch (err) {
        message.error("Failed to connect to server");
      }
    }
  }
  render() {
    return (
      <React.Fragment>
        <hr style={{ marginTop: "30px" }} />
        <div className="download-section">
          <div className="downloads-content">
            <AvForm onValidSubmit={this.downloadfile}>
              <AvGroup>
                <AvInput
                  type="name"
                  name="name"
                  id="name"
                  placeholder="Name"
                  onChange={this.onChange}
                  style={{
                    backgroundColor: "#03182C",
                    color: "#fff",
                    border: "none",
                  }}
                  required
                />
                <AvFeedback>Please enter your name.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <AvInput
                  type="email"
                  name="mailID"
                  id="email"
                  placeholder="Email ID"
                  onChange={this.onChange}
                  style={{
                    backgroundColor: "#03182C",
                    color: "#fff",
                    border: "none",
                  }}
                  required
                />
                <AvFeedback>Please enter your email Id.</AvFeedback>
              </AvGroup>
              <div style={{ textAlign: "left", paddingBottom: "5px" }}>
                USAGE TYPE
              </div>
              <div style={{ paddingLeft: "5px" }}>
                <AvRadioGroup
                  name="radioExample"
                  label=""
                  required
                  errorMessage="Please select usage type."
                >
                  <AvRadio
                    type="radio"
                    name="usage"
                    label="Commercial"
                    value="Commercial"
                    className="radio-usage"
                    onClick={this.onChange}
                  />
                  <AvRadio
                    type="radio"
                    name="usage"
                    label="Non-Commercial"
                    value="Non - Commercial"
                    className="radio-usage"
                    onChange={this.onChange}
                  />
                </AvRadioGroup>
              </div>
              <div style={{ textAlign: "left", paddingBottom: "5px" }}>
                PURPOSE
              </div>
              <AvField
                type="select"
                name="purpose"
                id="PurposeSelect"
                errorMessage="Please select purpose."
                onChange={this.onChange}
                required
                style={{
                  backgroundColor: "#03182C",
                  color: "#fff",
                  border: "none",
                }}
              >
                <option value="" selected disabled>
                  Purpose
                </option>
                <option value="Academia">Academia</option>
                <option value="Business">Business</option>
                <option value="Government Use">Government Use</option>
                <option value="R&D">R&D</option>
                <option value="Journalistic">Journalistic</option>
                <option value="Others">Others</option>
                <AvFeedback>Please select an option</AvFeedback>
              </AvField>
              <FormGroup>
                <div className="captcha">
                  <Captcha
                    onChange={this.onChangeCaptcha}
                    placeholder="Enter captcha"
                    required
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <Button
                  type="submit"
                  className="btn-downloads"
                  disabled={this.state.download}
                >
                  Download
                </Button>
              </FormGroup>
            </AvForm>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(PersonalDetails);
