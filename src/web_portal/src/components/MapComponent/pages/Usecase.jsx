import React, { useState, useEffect } from "react";
import Header from "../Common/Header";
import {
  FormGroup,
  Label,
  Input,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Modal,
  Row,
  Col,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
} from "reactstrap";
import { message } from "antd";
import Captcha from "demos-react-captcha";
import axios from "axios";
import "./style.css";
import Sidebar from "../Common/Sidebar";
import { select } from "d3-selection";

const Usecase = () => {
  const [useCaseData, setuseCaseData] = useState([]);
  const [alluseCaseData, setAlluseCaseData] = useState([]);
  const [currentUsecase, setcurrentUsecase] = useState([]);
  const [modalShow, setmodalShow] = useState(false);
  const [modalAdd, setmodalAdd] = useState(false);
  const [name, setName] = useState('');
  const [projType, setprojType] = useState('');
  const [longDescription, setlongDescription] = useState('');
  const [shortDescription, setshortDescription] = useState('');
  const [url, setUrl] = useState('');
  const [selectedImage, setselectedImage] = useState(null);
  const [username, setUsername] = useState('');
  const [emailid, setEmail] = useState('');
  const [regionId, setregionId] = useState('1')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [nameError, setNameError] = useState('');
  const [projTypeError, setprojTypeError] = useState('');
  const [longDescriptionError, setlongDescriptionError] = useState('');
  const [shortDescriptionError, setshortDescriptionError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [selectedImageError, setselectedImageError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    getUsecase();
  }, []);

  async function getUsecase() {
    try {
      const res = await axios.get(`https://dicra-api-v2-dev.eastus.cloudapp.azure.com/api/v2/usecases/1`);
      //   const parseData = JSON.parse(JSON.stringify(res.data.items));
      // const img = res.data.items[1].image;
      setuseCaseData(res.data.items);
      setAlluseCaseData(res.data.items);
    } catch (err) {
      console.log();
    }
  }
  async function addUsecase(event) {
    event.preventDefault();
    if (name.trim() === '') {
      setNameError('feild is required');
    } else {
      setNameError('');
    }
    if (projType.trim() === '') {
      setprojTypeError('feild is required');
    } else {
      setprojTypeError('');
    }
    if (longDescription.trim() === '') {
      setlongDescriptionError('feild is required');
    } else {
      setlongDescriptionError('');
    }
    if (shortDescription.trim() === '') {
      setshortDescriptionError('feild is required');
    } else {
      setshortDescriptionError('');
    }
    if (url.trim() === '') {
      setUrlError('URL is required');
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError('URL must start with http:// or https://');
    } else {
      setUrlError('');
    }
    
    if (username.trim() === '') {
      setUsernameError('feild is required');
    } else {
      setUsernameError('');
    }
    if (emailid.trim() === '') {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(emailid)) {
      setEmailError('Email is invalid');
    } else {
      setEmailError('');
    }
     try {
      const formData = new FormData();
      formData.append("project_name", name);
      formData.append("project_type", projType);
      formData.append("short_description", shortDescription);
      formData.append("long_description", longDescription);
      formData.append("url", url);
      formData.append("image", selectedImage);
      formData.append("username", username);
      formData.append("email_id", emailid);
      formData.append("region_id", regionId);
    const res = await axios.post("https://dicra-api-v2-dev.eastus.cloudapp.azure.com/api/v2/createusecase", formData );
      if (res.status === 201) {
        message.success("UseCase Added");
      } else {
        message.error("Something Happened !");
      }
    } catch (err) {
      console.log();
    }
  }
  

  const onChangeCaptcha = (value) => {
    if (value === true) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  };
  function seemore(data) {
    setcurrentUsecase(data);
    setmodalShow(true);
  }
  function togglemodal() {
    setmodalShow(!modalShow);
  }
  function toggleUsecaseAdd() {
    setmodalAdd(!modalAdd);
  }
  function changetype(type) {
    // console.log("TYPE", type);
    if (type == "All") {
      setuseCaseData(alluseCaseData);
    } else {
      let result;
      result = alluseCaseData.reduce(function (r, a) {
        r[a.project_type] = r[a.project_type] || [];
        r[a.project_type].push(a);
        return r;
      }, Object.create(null));
      setuseCaseData(result[type]);
    }
  }
  const isFormValid = name && projType && shortDescription && longDescription && url && selectedImage && username && emailid;
  const submitButtonDisabled = !isFormValid;
  return (
    <Sidebar>     
    <div>
 <Header />
      <div className="container-page" style={{overflowX:"hidden"}}>
        <Row>
          <Col>
          <div className="row" style={{ display: "flex", marginTop: "70px" }}>
          <FormGroup
            tag="fieldset"
            style={{
              display: "flex",
              gap: "35px",
              background: "#143461",
              "border-radius": "8px",
              color: "white",
              padding: "20px",
              position: "relative",
              top: "30px",
              left: "50px",
              width: "500px"
            }}
          >
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  defaultChecked={true}
                  onClick={(e) => {
                    changetype("All");
                  }}
                />{" "}
                All
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  onClick={(e) => {
                    changetype("Article");
                  }}
                />{" "}
                Article
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  onClick={(e) => {
                    changetype("Analytics");
                  }}
                />{" "}
                Analytics
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  onClick={(e) => {
                    changetype("Project");
                  }}
                />{" "}
                Projects
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  onClick={(e) => {
                    changetype("News");
                  }}
                />{" "}
                News
              </Label>
            </FormGroup>
          </FormGroup>
         
        </div>
          </Col>
          <Col>
           <Button
            className="add-btn"
            onClick={toggleUsecaseAdd}
            style={{    position: "relative",
              top: "100px",
              right: "38px",
              float: "right"}}
          >
            Add{" "}
          </Button>
          </Col>
        </Row>
        
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: 30,
            gap: "30px",
            padding: 40,
            flexWrap: "wrap",
            paddingLeft: "0px",
            paddingRight: "0px",
          }}
        >
          {useCaseData != undefined ? (
            useCaseData.map((items, index) => {
              return (
                <Card
                  style={{
                    width: "30%",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    background: "#143461",
                    borderRadius: 8,
                  }}
                  key={index}
                >
                  <CardImg
                    width="100px"
                    height="250px"
                    src={"https://dicra-api-v2-dev.eastus.cloudapp.azure.com/static/" + items.image}
                    alt="GFG Logo"
                  />
                  <CardBody style={{ color: "white" }}>
                    <CardTitle tag="h5"> {items.project_name} </CardTitle>
                    <CardText>{items.short_description}</CardText>
                  </CardBody>
                  <div style={{ width: "100%" }}>
                    <Button
                      style={{
                        background: "#091B33",
                        width: "100%",
                        padding: 12,
                      }}
                      onClick={(e) => {
                        seemore(items);
                      }}
                    >
                      View More
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <p>No data found</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalShow}
        toggle={togglemodal}
        // className={this.props.className}
        size="xl"
        centered
        backdrop="static"
      >
        <ModalHeader toggle={togglemodal}>Use Cases</ModalHeader>
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
                  "https://dicra-api-v2-dev.eastus.cloudapp.azure.com/static/" + currentUsecase.image
                }
                alt="..."
                className="cover"
              />
              <div className="centered">{currentUsecase.project_name}</div>
            </div>
            <div className="container">
              <div className="content-heading">
                <h3 style={{ padding: "0px", marginBottom: "10px" }}>
                  {currentUsecase.short_description}
                </h3>
              </div>
              <div className="content-body">
                <Row style={{ marginBottom: "10px" }}>
                  <Col
                    md={6}
                    style={{ fontWeight: "bold", textAlign: "left" }}
                  >
                    <p> Uploaded By : {currentUsecase.username}</p>
                  </Col>
                  <Col
                    md={6}
                    style={{ fontWeight: "bold", textAlign: "right" }}
                  >
                    <p> Created on : {currentUsecase.created_date}</p>
                  </Col>
                  <Col md={12} style={{ textAlign: "left" }}>
                    <a href={() => false} style={{ fontWeight: "bold" }}>
                      URL :{" "}
                    </a>{" "}
                    <a
                      href={currentUsecase.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {currentUsecase.url}
                    </a>
                  </Col>
                </Row>
                {currentUsecase.long_description}
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modalAdd}
        toggle={toggleUsecaseAdd}
        // className={this.props.className}
        size="xl"
        centered
        backdrop="static"
        className="modal-addUsecase"
      >
        <ModalHeader toggle={toggleUsecaseAdd}>Add Use Cases</ModalHeader>
        <ModalBody
          style={{
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            paddingBottom: "0px"
          }}
        >
          <Form className="form-add" style={{ fontSize: "14px" }} onSubmit={addUsecase}>
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
                  <FormGroup>
                    <Label for="project_name">Name</Label>
                    <Input
                      type="name"
                      name="name"
                      id="project_name"
                      placeholder="Project name"
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        background: "rgba(60, 60, 60, 0.3)",
                        backdropFilter: "blur(112px)",
                        borderRadius: "5px",
                        border: "none",
                        // height: "56px",
                        fontWeight: "600",
                        fontSize: "12px",
                        lineHeight: "20px",
                        color: "#979797",
                        "mix-blend-mode": "normal",
                      }}
                    />
                    {nameError && <span style={{color:"red"}}>{nameError}</span>}

                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup>
                    <Label for="projecttype">Type</Label>
                    <Input type="select" name="select" id="projecttype"
                    onChange={(e) => setprojType(e.target.value)}
                    style={{
                    background: "rgba(60, 60, 60, 0.3)",
                    backdropFilter: "blur(112px)",
                    borderRadius: "5px",
                    border: "none",
                    // height: "56px",
                    fontWeight: "600",
                    fontSize: "12px",
                    lineHeight: "20px",
                    color: "#979797",
                    "mix-blend-mode": "normal",
                  }}>
                      <option value="" selected disabled>
                        Project Type
                      </option>
                      <option value="Article">Article</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Project">Project</option>
                      <option value="News">News</option>
                      
                    </Input>
                    {projTypeError && <span style={{color:"red"}}>{projTypeError}</span>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <FormGroup>
                    <Label for="short_desc">Short Description</Label>
                    <Input
                      type="text"
                      name="short_desc"
                      id="short_desc"
                      placeholder="Short Description"
                      onChange={(e) => setshortDescription(e.target.value)}
                      style={{
                        background: "rgba(60, 60, 60, 0.3)",
                        backdropFilter: "blur(112px)",
                        borderRadius: "5px",
                        border: "none",
                        // height: "56px",
                        fontWeight: "600",
                        fontSize: "12px",
                        lineHeight: "20px",
                        color: "#979797",
                        "mix-blend-mode": "normal",
                      }}
                    />
                  {shortDescriptionError && <span style={{color:"red"}}>{shortDescriptionError}</span>}
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="long_desc">Long Description</Label>
                <Input
                  type="textarea"
                  name="long_desc"
                  id="long_desc"
                  onChange={(e) => setlongDescription(e.target.value)}
                  placeholder="Long Description"
                  style={{
                    background: "rgba(60, 60, 60, 0.3)",
                    backdropFilter: "blur(112px)",
                    borderRadius: "5px",
                    border: "none",
                    // height: "56px",
                    fontWeight: "600",
                    fontSize: "12px",
                    lineHeight: "20px",
                    color: "#979797",
                    "mix-blend-mode": "normal",
                  }}
                />
                {longDescriptionError && <span style={{color:"red"}}>{longDescriptionError}</span>}
              </FormGroup>
              <Row>
                <Col lg={6}>
                  <FormGroup>
                    <Label for="proj_url">URL</Label>
                    <Input
                      type="url"
                      name="url"
                      id="proj_url"
                      placeholder="Project url"
                      onChange={(e) => setUrl(e.target.value)}
                      style={{
                        background: "rgba(60, 60, 60, 0.3)",
                        backdropFilter: "blur(112px)",
                        borderRadius: "5px",
                        border: "none",
                        // height: "56px",
                        fontWeight: "600",
                        fontSize: "12px",
                        lineHeight: "20px",
                        color: "#979797",
                        "mix-blend-mode": "normal",
                      }}
                    />
                    <p style={{ fontSize: "10px" }}>https://www.example.com</p>
                    {urlError && <span style={{color:"red"}}>{urlError}</span>}
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup>
                    <Label for="img">Image Upload</Label>
                    <Input
                      type="file"
                      name="img"
                      id="img"
                      placeholder="Image Upload"
                      onChange={(e) =>  setselectedImage(e.target.files[0])}
                      style={{
                        background: "rgba(60, 60, 60, 0.3)",
                        backdropFilter: "blur(112px)",
                        borderRadius: "5px",
                        border: "none",
                        // height: "56px",
                        fontWeight: "600",
                        fontSize: "12px",
                        lineHeight: "20px",
                        color: "#979797",
                        "mix-blend-mode": "normal",
                      }}
                    />
                   {selectedImageError && <span style={{color:"red"}}>{selectedImageError}</span>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <FormGroup>
                    <Label for="username">User Name</Label>
                    <Input
                      type="username"
                      name="username"
                      id="username"
                      placeholder="User Name"
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        background: "rgba(60, 60, 60, 0.3)",
                        backdropFilter: "blur(112px)",
                        borderRadius: "5px",
                        border: "none",
                        // height: "56px",
                        fontWeight: "600",
                        fontSize: "12px",
                        lineHeight: "20px",
                        color: "#979797",
                        "mix-blend-mode": "normal",
                      }}
                    />
                    {usernameError && <span style={{color:"red"}}>{usernameError}</span>}
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup>
                    <Label for="email_id">Email ID</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email_id"
                      placeholder="Email ID"
                      onChange={(e) => setEmail(e.target.value)} 
                      style={{
                        background: "rgba(60, 60, 60, 0.3)",
                        backdropFilter: "blur(112px)",
                        borderRadius: "5px",
                        border: "none",
                        // height: "56px",
                        fontWeight: "600",
                        fontSize: "12px",
                        lineHeight: "20px",
                        color: "#979797",
                        "mix-blend-mode": "normal",
                      }}
                    />
                   {emailError && <span style={{color:"red"}}>{emailError}</span>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <FormGroup>
                    <div className="captcha">
                      <Captcha
                        onChange={onChangeCaptcha}
                        placeholder="Enter captcha"
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <ModalFooter style={{ paddingBottom: "0px" }}>
              <Button
                className="add-btn"
                onClick={addUsecase}
                disabled={isSubmitDisabled || submitButtonDisabled}
              >
                Add
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </div>
    </Sidebar>

  );
};

export default Usecase;
