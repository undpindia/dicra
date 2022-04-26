import React from "react";
import axios from "axios";
import "../Common/common.css";
import { Radio, message } from "antd";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Row,
  Col,
} from "reactstrap";
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
import { BiChevronRightCircle, BiX } from "react-icons/bi";
import Header from "../Common/Header";
import { FiPlus } from "react-icons/fi";
import paddy from "../img/paddy.jpg";
import { useHistory, Link } from "react-router-dom";
// import AddUsecases from "./AddUsecases";
import axiosConfig from "../Common/axios_Config";

const plainOptions = ["All", "Article", "Analytics", "Project", "News"];

class Usecases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalShow: false,
      usecase: [],
      allUsecases: [],
      disableAdd: true,
      valuesArray: [],
      showLoader: true,
      project_name: "",
      project_type: "",
      short_description: "",
      selectedType: "All",
      long_description: "",
      url: "",
      selectedImage: null,
      email_id: "",
      approved: "",
      username: "",
      currentUsecase: [],
    };
    this.toggle = this.toggle.bind(this);
    this.modalShow = this.modalShow.bind(this);
    this.addUsecase = this.addUsecase.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCaptcha = this.onChangeCaptcha.bind(this);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  async modalShow(data) {
    this.setState({
      modalShow: !this.state.modalShow,
      currentUsecase: data,
    });
  }
  ChangeCaseType = (e) => {  
    this.setState({
      selectedType: e.target.value,
    });
    if (e.target.value == "All") {
      this.setState({
        usecase: this.state.allUsecases,
      });
    } else {
      let result;
      result = this.state.allUsecases.reduce(function (r, a) {
        r[a.project_type] = r[a.project_type] || [];
        r[a.project_type].push(a);
        return r;
      }, Object.create(null));    
      this.setState({
        usecase: result[e.target.value],
      });
    }
  };
  async getUsecase() {
    try {
      const res = await axiosConfig.get(`/usecases`);
      const parseData = JSON.parse(JSON.stringify(res.data.items));
      // const img = res.data.items[1].image;
      this.setState({
        usecase: parseData,
        allUsecases: parseData,
        showLoader: false,
      });
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  componentDidMount() {
    this.getUsecase();
  }
  onChange(ev) { 
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }
  async addUsecase() {
    const formData = new FormData();
    formData.append("project_name", this.state.project_name);
    formData.append("project_type", this.state.project_type);
    formData.append("short_description", this.state.short_description);
    formData.append("long_description", this.state.long_description);
    formData.append("url", this.state.url);
    formData.append("image", this.state.selectedImage);
    formData.append("username", this.state.username);
    formData.append("email_id", this.state.email_id);  
    const response = await axiosConfig
      .post("/addusecase", formData)
      .then((usecaseres) => {     
        if (usecaseres.data.success == true) {
          message.success("UseCase Added");
        } else {
          message.error("Something Happened !");
        }
      });
  }
  onChangeCaptcha(value) {  
    if (value == true) {
      this.setState({
        disableAdd: false,
      });
    } else {
      this.setState({
        disableAdd: true,
      });
    }
  }
  onImageUpload = (event) => {
    // Update the state
    this.setState({ selectedImage: event.target.files[0] });
  };
  render() {
    const { value1 } = this.state;
    const usecaseImage = this.state;
    return (
      <React.Fragment>
        <div className="page-header">
          <Header />
        </div>

        <div style={{'overflow': 'hidden'}}>
          <Row>
            <Col>
              <h6 className="page-heading">Use cases</h6>
            </Col>
            <Col>
              <Link to="/">
                <BiX className="usecase-close" />
              </Link>
              <Button className="btn-add" onClick={this.toggle}>
                <FiPlus style={{ fontSize: "16px" }} /> Add
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="btn-usecase-filter">
              <Radio.Group
                options={plainOptions}
                onChange={this.ChangeCaseType}
                value={this.state.selectedType}
              />
            </Col>
          </Row>
          <div className="container usecases-cards">
            <Row>
              {this.state.usecase.map((data) => {
                return (
                  <Col className="usecase-mobile" style={{ marginBottom: "20px" }}>
                    <div className="card" style={{ width: "300px" }}>
                      <img
                        src={
                          "https://internalapidev.chickenkiller.com/static/" +
                          data.image
                        }
                        class="card-img-top"
                        alt="..."
                      />
                      <div className="top-left">{data.project_type}</div>
                      <div className="card-body">
                        <Row style={{ paddingBottom: "10px" }}>
                          <Col>
                            <a className="card-calender">20 March 2021</a>
                          </Col>
                          <Col>
                            <a className="card-link">{data.url}</a>
                          </Col>
                        </Row>
                        <h5 class="card-title">{data.project_name}</h5>
                        <p class="card-text">{data.short_description}</p>
                        <div className="card-more">
                          <BiChevronRightCircle style={{ fontSize: "22px" }} />{" "}
                          <a
                            onClick={(e) => {
                              {
                                this.modalShow(data);
                              }
                            }}
                          >
                            Find out More
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle}
                className={this.props.className}
                size="xl"
                centered
                backdrop="static"
              >
                <ModalHeader toggle={this.toggle}>Add Use Cases</ModalHeader>
                <ModalBody
                  style={{
                    maxHeight: "calc(100vh - 190px)",
                    overflowY: "auto",
                    paddingBottom: "0px",
                  }}
                >
                  {/* <AddUsecases /> */}
                  <AvForm style={{ fontSize: "14px" }}>
                    <div
                      style={{
                        maxHeight: "calc(100vh - 290px)",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                      className="add-usecases-body"
                    >
                      <Row>
                        <Col lg={6}>
                          <AvField
                            name="project_name"
                            label="Project Name"
                            id="proj_name"
                            placeholder="Project name"
                            onChange={this.onChange}
                            required
                          />
                        </Col>
                        <Col lg={6}>
                          <AvField
                            type="select"
                            label="Project Type"
                            name="project_type"
                            id="proj_type"
                            placeholder="Project type"
                            onChange={this.onChange}
                            required
                          >
                            <option value="" selected disabled>
                              Project Type
                            </option>
                            <option value="Article">Article</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Project">Project</option>
                            <option value="News">News</option>
                          </AvField>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <AvGroup>
                            <Label for="short_desc">Short Description</Label>
                            <AvInput
                              type="text"
                              name="short_description"
                              id="short_desc"
                              placeholder="Short Description"
                              onChange={this.onChange}
                              required
                            />
                            <AvFeedback>This field is invalid!</AvFeedback>
                          </AvGroup>
                        </Col>
                      </Row>
                      <AvGroup>
                        <Label for="long_desc">Long Description</Label>
                        <AvInput
                          type="textarea"
                          name="long_description"
                          id="long_desc"
                          placeholder="Long Description"
                          onChange={this.onChange}
                          required
                        />
                        <AvFeedback>This field is invalid!</AvFeedback>
                      </AvGroup>
                      <Row>
                        <Col lg={6}>
                          <AvGroup>
                            <Label for="proj_url">URL</Label>
                            <AvInput
                              type="url"
                              name="url"
                              id="proj_url"
                              placeholder="Url"
                              onChange={this.onChange}
                              required
                            />
                            <AvFeedback>This field is invalid!</AvFeedback>
                            <p style={{ fontSize: "10px" }}>
                              https://www.example.com
                            </p>
                          </AvGroup>
                        </Col>
                        <Col lg={6}>
                          <AvGroup>
                            <Label for="img">Image Upload</Label>
                            <AvInput
                              type="file"
                              onChange={this.onImageUpload}
                              name="image"
                              id="img"
                              required
                            />
                            <AvFeedback>This field is invalid!</AvFeedback>
                          </AvGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}>
                          <AvGroup>
                            <Label for="uname">User Name</Label>
                            <AvInput
                              type="name"
                              name="username"
                              id="uname"
                              placeholder="Username"
                              onChange={this.onChange}
                              required
                            />
                            <AvFeedback>This field is invalid!</AvFeedback>
                          </AvGroup>
                        </Col>
                        <Col lg={6}>
                          <AvGroup>
                            <Label for="email_id">Email ID</Label>
                            <AvInput
                              type="email"
                              name="email_id"
                              id="email_id"
                              placeholder="Email ID"
                              onChange={this.onChange}
                              required
                            />
                            <AvFeedback>This field is invalid!</AvFeedback>
                          </AvGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup>
                            <div className="captcha">
                              <Captcha
                                onChange={this.onChangeCaptcha}
                                placeholder="Enter captcha"
                              />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <ModalFooter>
                      <Button
                        onClick={this.addUsecase}
                        disabled={this.state.disableAdd}
                        type="submit"
                      >
                        Add
                      </Button>
                    </ModalFooter>
                  </AvForm>
                </ModalBody>
              </Modal>

              <Modal
                isOpen={this.state.modalShow}
                toggle={this.modalShow}
                className={this.props.className}
                size="xl"
                centered
                backdrop="static"
              >
                <ModalHeader toggle={this.modalShow}>Use Cases</ModalHeader>
                <ModalBody
                  style={{
                    maxHeight: "calc(100vh - 120px)",
                    overflowY: "auto",
                  }}
                >
                  <div>
                    {" "}
                    <div>
                      <img
                        src={
                          "https://internalapidev.chickenkiller.com/static/" +
                          this.state.currentUsecase.image
                        }
                        className="cover"
                      />
                      <div className="centered">
                        {this.state.currentUsecase.project_name}
                      </div>
                    </div>
                    <div className="container">
                      <div className="content-heading">
                        <h3  style={{padding:"0px", marginBottom:"10px"}}>{this.state.currentUsecase.short_description}</h3>
                      </div>
                      <div className="content-body">
                        <Row style={{marginBottom:"10px"}}>
                          <Col md={12} style={{ fontWeight: "bold", textAlign:"left"}}>
                           <p> Uploaded By : {this.state.currentUsecase.username}</p>
                          </Col>
                          <Col md={12}  style={{ textAlign:"left"}}>
                            <a style={{fontWeight: "bold"}}>URL : </a> <a
                              href={this.state.currentUsecase.url}
                              target="_blank"
                            >
                              {this.state.currentUsecase.url}
                            </a>
                          </Col>
                        </Row>
                        {this.state.currentUsecase.long_description}
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Usecases;
