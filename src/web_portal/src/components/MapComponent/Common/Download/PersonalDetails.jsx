import React, { Component } from 'react';
import { Button, FormGroup } from 'reactstrap';
import { Form, Label, Input, FormText } from 'reactstrap';
import Captcha from 'demos-react-captcha';
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';
import { message } from 'antd';

const mapStateToProps = (props) => {
  return {
    DownloadLayer: props.DownloadLayer,
    DownloadLayerDate: props.DownloadLayerDate,
    DownloadLayerRegion: props.DownloadLayerRegion,
    DownloadLayerType: props.DownloadLayerType,
    DownloadFile: props.DownloadFile,
    LayerDescription: props.LayerDescription,
    DownloadLayerDesc: props.DownloadLayerDesc,
  };
};

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      size: 'default',
      name: null,
      mailID: null,
      usage: null,
      purpose: null,
      download: true,
      downloadlayer: props.DownloadLayer,
      downloadfile: props.DownloadFile,
      captchaVerified: false,
      captchaKey: 1,
    };
    this.onChange = this.onChange.bind(this);
    this.downloadfile = this.downloadfile.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: [e.target.value],
    });
  }

  handleCaptchaVerification = (verified) => {
    this.setState({ captchaVerified: verified });
  };

  handleReload() {
    this.setState((prevState) => ({
      captchaKey: prevState.captchaKey + 1,
      captchaVerified: false,
    }));
  }

  async downloadfile() {
    try {
      saveAs(
        process.env.REACT_APP_APIEND_DOWNLOADS.replace(
          'LAYER_ID',
          String(this.props.DownloadLayerDesc.id)
        )
          .replace('FILE_NAME', String(this.state.downloadfile))
          .replace('USER_NAME', String(this.state.name[0]))
          .replace('EMAIL_ID', String(this.state.mailID[0]))
          .replace('USAGE_TYPE', String(this.state.usage[0]))
          .replace('PURPOSE', String(this.state.purpose[0]))
      );
      this.handleReload();
    } catch (err) {
      message.error('Failed to connect to server');
      this.handleReload();
    }
  }

  isFormValid = () => {
    const { name, mailID, usage, purpose, captchaVerified } = this.state;
    return (
      name &&
      name[0] &&
      mailID &&
      mailID[0] &&
      usage &&
      usage[0] &&
      purpose &&
      purpose[0] &&
      captchaVerified
    );
  };

  render() {
    const { captchaVerified, captchaKey } = this.state;
    const isFormValid = this.isFormValid();

    return (
      <React.Fragment>
        <div
          className="download-section-personal"
          style={{ marginTop: '10px' }}
        >
          <div className="downloads-content">
            <Form style={{ display: 'block', border: 'none' }}>
              <FormGroup>
                <Input
                  type="name"
                  name="name"
                  id="examplename"
                  placeholder="Name"
                  style={{
                    background: 'rgba(60, 60, 60, 0.3)',
                    backdropFilter: 'blur(112px)',
                    borderRadius: '5px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '12px',
                    lineHeight: '20px',
                    color: '#979797',
                    'mix-blend-mode': 'normal',
                  }}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="email"
                  name="mailID"
                  id="email"
                  placeholder="Email ID"
                  style={{
                    background: 'rgba(60, 60, 60, 0.3)',
                    backdropFilter: 'blur(112px)',
                    borderRadius: '5px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '12px',
                    lineHeight: '20px',
                    color: '#979797',
                    'mix-blend-mode': 'normal',
                  }}
                  onChange={this.onChange}
                />
              </FormGroup>
              <br />
              <FormGroup tag="fieldset">
                <legend
                  style={{
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '14px',
                    lineHeight: '25px',
                    color: '#FFFFFF',
                  }}
                >
                  Usage Type
                </legend>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="usage"
                      label="Commercial"
                      value="Commercial"
                      className="radio-usage"
                      style={{
                        fontWeight: '400',
                        fontSize: '12px',
                        lineHeight: '20px',
                        color: '#C1C1C1',
                      }}
                      onClick={this.onChange}
                    />{' '}
                    Commercial
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="usage"
                      label="Non-Commercial"
                      value="Non - Commercial"
                      className="radio-usage"
                      style={{
                        fontWeight: '400',
                        fontSize: '12px',
                        lineHeight: '20px',
                        color: '#C1C1C1',
                      }}
                      onClick={this.onChange}
                    />
                    Non - Commercial
                  </Label>
                </FormGroup>
              </FormGroup>
              <br />
              <FormGroup>
                <Label
                  for="exampleSelect"
                  style={{
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '14px',
                    lineHeight: '25px',
                    color: '#FFFFFF',
                  }}
                >
                  Purpose
                </Label>
                <Input
                  type="select"
                  name="purpose"
                  id="PurposeSelect"
                  className="download-select"
                  style={{
                    backdropFilter: 'blur(112px)',
                    borderRadius: '5px',
                    border: 'none',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px',
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#FFFFFF',
                  }}
                  onChange={this.onChange}
                >
                  <option value="Academia" disabled selected>
                    Purpose
                  </option>
                  <option value="Academia">Academia</option>
                  <option value="Business">Business</option>
                  <option value="Government Use">Government Use</option>
                  <option value="R&D">R&D</option>
                  <option value="Journalistic">Journalistic</option>
                  <option value="Others">Others</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <div className="captcha">
                  <Captcha
                    Captcha
                    key={captchaKey}
                    onChange={this.handleCaptchaVerification}
                    placeholder="Enter captcha"
                    length={6}
                  />
                </div>
              </FormGroup>
              <br />
              <Button
                className="btn-downloads"
                disabled={!isFormValid}
                onClick={this.downloadfile}
              >
                Download
              </Button>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(PersonalDetails);
