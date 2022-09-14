import React, { useState, useEffect, useRef } from "react";
import {
  BiLayer,
  BiDownload,
  BiFolder,
  BiErrorCircle,
  BiHelpCircle,
  BiX,
  BiHide,
  BiShow,
  BiBarChartAlt,
} from "react-icons/bi";
import { AiFillGithub } from "react-icons/ai";
import { Sidebar, Tab } from "./Sidetabs";
import { useSelector, useDispatch } from "react-redux";
import { FormGroup, Label, Input, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import LayerDetails from "./Download/LayerDetails";
import PersonalDetails from "./Download/PersonalDetails";
import Multistep from "react-multistep";
import axiosConfig from "../Common/axios_Config";
import { setlayerlist, setcurrentlayer } from "../actions";
import { Collapse, message } from "antd";
import DISTRICTBOUNDS from "../Shapes/TS_district_boundary.json";

const steps = [
  { name: "StepOne", component: <LayerDetails /> },
  { name: "StepTwo", component: <PersonalDetails /> },
];
const { Panel } = Collapse;
const SidebarComponent = (props) => {
  const selectedLayer = useSelector((state) => state.CurrentLayer);
  const selectedDowndate = useSelector((state) => state.DownloadLayerDate);
  const LayerToggle = useSelector((state) => state.RasterOpacity);
  const DownLayerDesc = useSelector((state) => state.DownloadLayerDesc);
  const DownLayer = useSelector((state) => state.DownloadLayer);
  const LayerDesc = useSelector((state) => state.LayerDescription);
  let currentlayerType = useSelector((state) => state.CurrentLayerType);
  const [openTab, setOpenTab] = useState("layer");
  const [isActive, setlegend] = useState(true);
  const [Layers, layerList] = useState([]);
  const [isActivebutton, setActivebutton] = useState(false);
  const [Layercount, setLayercount] = useState(0);
  const [Categorylist, setCategorylist] = useState([]);
  const dispatch = useDispatch();
  const handleClick = () => {
    window.open("https://github.com/UNDP-India/Data4Policy/");
  };
  const onClose = () => {
    setOpenTab(false);
    setlegend(!isActive);
  };

  const onOpen = (id) => {
    setOpenTab(id);
    setlegend(!isActive);
  };

  const onOpenDownloads = (layer, desc) => {
    dispatch({ type: "SETDOWNLOADLAYER", payload: layer });
    dispatch({ type: "DOWNCHANGELAYERDESC", payload: desc });
    // dispatch(setdownloadlayer(layer));
    setOpenTab("downloads");
  };
  const prevStyle = {
    background: "rgb(3, 53, 100)",
    borderRadius: "3px",
    border: "none",
    float: "left",
    transform: "translateY(118%)",
  };
  const nextStyle = {
    background: "rgb(3, 53, 100)",
    borderRadius: "3px",
    border: "none",
    float: "right",
    transform: "translateY(30%)",
  };

  const getLayers = async () => {
    try {
      const layers = await axiosConfig.get(`/getlayerconfig?`);
      // layerList(layers.data);
      dispatch(setlayerlist(layers.data));
      let result;
      result = layers.data.reduce(function (r, a) {
        r[a.category] = r[a.category] || [];
        r[a.category].push(a);
        return r;
      }, Object.create(null));
      layerList([result]);
      setCategorylist(Object.keys([result][0]));
      setLayercount(1);
    } catch (err) {
      message.error("Failed to connect to server");
    }
  };

  function getVector(layer, desc) {
    dispatch(setcurrentlayer(layer));
    dispatch({ type: "HIDEDRAWER" });
    // dispatch({ type: "HIDERASTER" });
    dispatch({ type: "SETCURRENTVECTOR", payload: DISTRICTBOUNDS});
    // dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Raster" });
    dispatch({ type: "SETCURRENTREGION", payload: "DISTRICT" });
    dispatch({ type: "CHANGELAYERDESC", payload: desc });
    // if(currentlayerType === "Raster" || window.layerType === "Raster"){
      if(currentlayerType === "Raster" || window.layerType === "Raster"){
      dispatch({ type: "SHOWRASTER" });
    } else {
      dispatch({ type: "HIDERASTER" });
    }
    if(layer === "LULC"){
      dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Raster" });
      window.layerType = "Raster";
      dispatch({ type: "SHOWRASTER" });
    }
     if(layer === "DPPD"){
      dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Vector" });
      window.layerType = "Vector";
      dispatch({ type: "HIDERASTER" });
    } 
    if(layer === "SOIL_M_DEV"){
      dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Vector" });
      window.layerType = "Vector";
      dispatch({ type: "HIDERASTER" });
    } 
    if(layer === "LST_DPPD"){
      dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Vector" });
      window.layerType = "Vector";
      dispatch({ type: "HIDERASTER" });
    } 
     else {
      dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Raster" });
      window.layerType = "Raster";
      dispatch({ type: "SHOWRASTER" });
    }
    props.resetZoom();
    // if (selectedRegion !== "CUSTOM") {
    setTimeout(function () {
      props.changeCurrentLayer();
    }, 3000);
    // }
  }
  function callback(key) {
    // console.log(key);
  }
  const changeLayer = useRef(() => {
    getLayers();
    if (DownLayerDesc.multiple_files === true) {
      if (selectedDowndate !== "") {
        setActivebutton(true);
      } else {
        setActivebutton(false);
      }
    } else {
      setActivebutton(true);
    }
  });
  useEffect(() => {
    changeLayer.current();
  }, [Layercount, selectedDowndate, isActivebutton, DownLayer]);

  function toggleLayer() {
    if (LayerToggle === true) {
      dispatch({ type: "HIDERASTER" });
    } else {
      dispatch({ type: "SHOWRASTER" });
    }
  }
  return (
    <React.Fragment>
      <div className="Sidebar">
        <Sidebar
          position="left"
          collapsed={!openTab}
          selected={openTab}
          closeIcon={<BiX />}
          onClose={onClose}
          onOpen={onOpen}
        >
          <Tab
            id="layer"
            header="Layers"
            icon={
              <BiLayer className="tab-icon icons" data-tip data-for="layer" />
            }
            active
          >
            <hr style={{ marginTop: "30px" }} />

            <Collapse
              accordion
              bordered={false}
              defaultActiveKey={["0"]}
              onChange={callback}
              classname="collapse"
            >
              {Categorylist.map((layers, index, datacategory) => {
                return (
                  <Panel header={layers} key={index} className="layer-header">
                    {Layers[0][layers].map((items, indexlayers, datalayers) => {
                      return (
                        <FormGroup
                          tag="fieldset"
                          className="btn-radio"
                          key={indexlayers}
                        >
                          <Row>
                            <Col
                              md={8}
                              style={{
                                paddingBottom: "0px",
                                paddingRight: "0px",
                              }}
                            >
                              <Label>
                                <Input
                                  type="radio"
                                  name="radio1"
                                  onChange={(e) =>
                                    getVector(items.layer_name, items)
                                  }
                                  defaultChecked={
                                    selectedLayer === items.layer_name
                                  }
                                  disabled={items.isavailable ? false : true}
                                />{" "}
                                {items.display_name === "Land Service Temperature (LST)" ? "Land Surface Temperature (LST)" : items.display_name}
                              </Label>
                            </Col>
                            <Col md={4}>
                              <div className="tool-tip">
                                <div
                                  style={
                                    selectedLayer === items.layer_name
                                      ? {}
                                      : { display: "none" }
                                  }
                                  // style={LayerDesc.raster_status===false?{"pointer-events": "none"}:{}}
                                  // disabled={LayerDesc.raster_status===false?true:false}
                                >
                                  {LayerDesc.raster_status === false ? (
                                    <BiShow
                                      data-tip
                                      data-for="show-disabledbtn"
                                      style={{ cursor: "not-allowed" }}
                                    />
                                  ) : LayerToggle ? (
                                    <BiShow
                                      data-tip
                                      data-for="show-btn"
                                      onClick={(e) => toggleLayer()}
                                      // style={
                                      //   LayerToggle ? {} : { display: "none" }
                                      // }
                                    />
                                  ) : (
                                    <BiHide
                                      data-tip
                                      data-for="show-btn"
                                      onClick={(e) => toggleLayer()}
                                      // style={
                                      //   LayerToggle ? { display: "none" } : {}
                                      // }
                                      // style= { LayerDesc.raster_status === false
                                      //   ? { cursor: "not-allowed" }
                                      //   : {}}
                                    />
                                  )}
                                  <ReactTooltip
                                    id="show-btn"
                                    place="bottom"
                                    effect="solid"
                                    multiline={true}
                                  >
                                    Show/Hide Layer
                                  </ReactTooltip>
                                </div>
                                &nbsp;&nbsp;
                                <div
                                  style={
                                    selectedLayer === items.layer_name
                                      ? {}
                                      : { display: "none" }
                                  }
                                >
                                  <BiDownload
                                    data-tip
                                    data-for="download-btn"
                                    onClick={(e) =>
                                      onOpenDownloads(items.layer_name, items)
                                    }
                                  />
                                </div>
                                <ReactTooltip
                                  id="download-btn"
                                  place="top"
                                  effect="solid"
                                  multiline={true}
                                >
                                  Downloads
                                </ReactTooltip>
                                &nbsp;&nbsp;
                                <div>
                                  <BiErrorCircle
                                    data-tip
                                    data-for={items.layer_name}
                                  />
                                </div>
                                <ReactTooltip
                                  id={items.layer_name}
                                  place="top"
                                  effect="solid"
                                  multiline={true}
                                >
                                  {items.isavailable
                                    ? items.short_description
                                    : "Work in progress"}
                                </ReactTooltip>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      );
                    })}
                  </Panel>
                );
              })}
            </Collapse>
          </Tab>
          <Tab
            id="downloads"
            header="Downloads"
            icon={
              <BiDownload
                className="tab-icon icons"
                data-tip
                data-for="downloads"
              />
            }
          >
            <Multistep
              activeStep={0}
              showNavigation={true}
              steps={steps}
              prevStyle={prevStyle}
              // nextStyle={isActivebutton ? nextStyle : nextDisabled}
              nextStyle={nextStyle}
            />
          </Tab>
          <Tab
            icon={
              <Link to="/use-cases">
                <BiFolder
                  className="tab-icon icons"
                  data-tip
                  data-for="use-cases"
                />
              </Link>
            }
          ></Tab>
          <Tab
            icon={
              <Link to="/about-project">
                <BiErrorCircle
                  className="tab-icon icons"
                  data-tip
                  data-for="about-project"
                />
              </Link>
            }
            anchor="bottom"
          ></Tab>
          <Tab
            icon={
              // <Link to="https://dev.misteo.co/dicrahelp">
              <BiHelpCircle
                className="tab-icon icons helppage"
                data-tip
                data-for="help"
                onClick={(e) => {
                  window
                    .open("https://dev.misteo.co/dicrahelp/", "_blank")
                    .focus();
                }}
              />
              // </Link>
            }
            anchor="bottom"
          ></Tab>
          <Tab
            icon={
              <Link to="/analytics">
                <BiBarChartAlt
                  className="tab-icon icons"
                  data-tip
                  data-for="analytics"
                />
              </Link>
            }
            anchor="bottom"
          ></Tab>
          <Tab
            icon={
              <AiFillGithub
                className="tab-icon icons"
                data-tip
                data-for="github"
                onClick={handleClick}
              />
            }
            anchor="bottom"
          ></Tab>
        </Sidebar>
      </div>
      <ReactTooltip
        className="react-tooltip"
        id="layer"
        place="right"
        effect="solid"
        multiline={true}
      >
        Layers
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="downloads"
        place="right"
        effect="solid"
        multiline={true}
      >
        Download
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="use-cases"
        place="right"
        effect="solid"
        multiline={true}
      >
        Use Cases
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="about-project"
        place="right"
        effect="solid"
        multiline={true}
      >
        About Project
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="help"
        place="right"
        effect="solid"
        multiline={true}
      >
        Help
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="analytics"
        place="right"
        effect="solid"
        multiline={true}
      >
        Site Analytics
      </ReactTooltip>
      <ReactTooltip
        className="react-tooltip"
        id="github"
        place="right"
        effect="solid"
        multiline={true}
      >
        Github
      </ReactTooltip>
    </React.Fragment>
  );
};

export default SidebarComponent;
