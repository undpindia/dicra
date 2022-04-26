import React, { useState, useEffect } from "react";
import BottomNavigation from "reactjs-bottom-navigation";
import "reactjs-bottom-navigation/dist/index.css";
import { useHistory, Link, Route } from "react-router-dom";
import { Modal, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axiosConfig from "../Common/axios_Config";
import { setlayerlist, setcurrentlayer, setdownloadlayer } from "../actions";
import { Collapse, message } from "antd";
import ReactTooltip from "react-tooltip";
import Multistep from "react-multistep";
import LayerDetails from "./Download/LayerDetails";
import { AiFillGithub } from "react-icons/ai";
import PersonalDetails from "./Download/PersonalDetails";
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
  BiDotsHorizontalRounded
} from "react-icons/bi";
import { Form, FormGroup, Label, Input, FormText, Row, Col } from "reactstrap";
const steps = [
  { name: "StepOne", component: <LayerDetails /> },
  { name: "StepTwo", component: <PersonalDetails /> },
];
const { Panel } = Collapse;
const BottomNav = (props) => {
  const selectedLayer = useSelector((state) => state.CurrentLayer);
  const selectedRegion = useSelector((state) => state.CurrentRegion);
  const selectedDowndate = useSelector((state) => state.DownloadLayerDate);
  const LayerToggle = useSelector((state) => state.RasterOpacity);
  const DownLayerDesc = useSelector((state) => state.DownloadLayerDesc);
  const DownLayer = useSelector((state) => state.DownloadLayer);
  const Keymap = useSelector((state) => state.MapKey);
  const history = useHistory();
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
  function getVector(layer, desc) {
    dispatch(setcurrentlayer(layer));
    dispatch({ type: "HIDEDRAWER" });
    dispatch({ type: "CHANGELAYERDESC", payload: desc });
    props.resetZoom();
    if (selectedRegion != "CUSTOM") {
      setTimeout(function () {
        props.changeCurrentLayer();
      }, 3000);
    }
  }
  const onOpenDownloads = (layer, desc) => {
    dispatch({ type: "SETDOWNLOADLAYER", payload: layer });
    dispatch({ type: "DOWNCHANGELAYERDESC", payload: desc });
    // dispatch(setdownloadlayer(layer));
    setIsModalDownload(true);
    setIsModalVisible(false);
  };
  // items
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "hidden");
  }, []);

  const bottomNavItems = [
    {
      title: "Layers",

      icon: <BiLayer style={{ fontSize: "18px", color: "#90989B" }} />,

      activeIcon: <BiLayer style={{ fontSize: "18px", color: "#90989B" }} />,
      onClick: () => {
        setIsModalVisible(true);
        setIsModalDownload(false);
        setIsModalOther(false);
      },
    },

    {
      title: "Downloads",

      icon: <BiDownload style={{ fontSize: "18px", color: "#90989B" }} />,

      activeIcon: <BiDownload style={{ fontSize: "18px", color: "#90989B" }} />,
      onClick: () => {
        setIsModalDownload(true);
        setIsModalVisible(false);
        setIsModalOther(false);
      },
    },

    {
      title: "Use Cases",

      icon: (
        <Link to="/use-cases">
          <BiFolder style={{ fontSize: "18px", color: "#90989B" }} />
        </Link>
      ),

      activeIcon: <BiFolder style={{ fontSize: "18px", color: "#90989B" }} />,
    },

    {
      title: "Others",

      icon: <BiDotsHorizontalRounded style={{ fontSize: "18px", color: "#90989B" }} />,

      activeIcon: <BiDotsHorizontalRounded style={{ fontSize: "18px", color: "#90989B" }} />,
      onClick: () => {
        setIsModalOther(true);
        setIsModalDownload(false);
        setIsModalVisible(false);
      },
    },
  ];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDownload, setIsModalDownload] = useState(false);
  const [isModalOther, setIsModalOther] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk1 = () => {
    setIsModalDownload(false);
  };

  const handleCancel1 = () => {
    setIsModalDownload(false);
  };
  const handleOtherOk = () => {
    setIsModalOther(false);
  };

  const handleOtherCancel = () => {
    setIsModalOther(false);
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
  function callback(key) {
    // console.log(key);
  }
  useEffect(() => {
    getLayers();
    if (DownLayerDesc.multiple_files == true) {
      if (selectedDowndate != "") {
        setActivebutton(true);
      } else {
        setActivebutton(false);
      }
    } else {
      setActivebutton(true);
    }
  }, [Layercount, selectedDowndate, isActivebutton, DownLayer]);

  function toggleLayer() {
    if (LayerToggle == true) {
      dispatch({ type: "HIDERASTER" });
    } else {
      dispatch({ type: "SHOWRASTER" });
    }
  }
  const prevStyle = {
    background: "#195995",
    "border-radius": "3px",
    border: "none",
    float: "left",
    transform: "translateY(-60%)",
  };
  const nextStyle = {
    background: "#195995",
    "border-radius": "3px",
    border: "none",
    float: "right",
    transform: "translateY(-60%)",
  };
  const nextDisabled = {
    background: "#797B7C",
    "border-radius": "3px",
    border: "none",
    float: "right",
    transform: "translateY(-60%)",
    "pointer-events": "none",
    cursor: "not-allowed",
  };
  return (
    <React.Fragment>
      <div>
        <BottomNavigation
          items={bottomNavItems}
          onItemClick={(item) => console.log(item)}
        />
      </div>
      <div>
        <>
          <Modal
            title="Layers"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            mask={false}
            footer={null}
            className="layer-modal"
            bodyStyle={{
              overflowX: "scroll",
              backgroundColor: "#073d6f",
              color: "white",
              height: "323px",
            }}
          >
            <Collapse
              accordion
              bordered={false}
              defaultActiveKey={["0"]}
              onChange={callback}
              classname="collapse"
            >
              {Categorylist.map((layers, index) => {
                return (
                  <Panel header={layers} key={index} className="layer-header">
                    {Layers[0][layers].map((items) => {
                      return (
                        <FormGroup tag="fieldset" className="btn-radio">
                          <Row>
                            <div className="col-8"
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
                                {items.display_name}
                              </Label>
                            </div>
                            <div className="col-4">
                              <div className="tool-tip">
                                <div
                                  style={
                                    selectedLayer == items.layer_name
                                      ? {}
                                      : { display: "none" }
                                  }
                                >
                                  <BiShow
                                    data-tip
                                    data-for="show-btn"
                                    onClick={(e) => toggleLayer()}
                                    style={
                                      LayerToggle ? {} : { display: "none" }
                                    }
                                  />
                                  <BiHide
                                    data-tip
                                    data-for="show-btn"
                                    onClick={(e) => toggleLayer()}
                                    style={
                                      LayerToggle ? { display: "none" } : {}
                                    }
                                  />
                                </div>
                                <ReactTooltip
                                  id="show-btn"
                                  place="top"
                                  effect="solid"
                                  multiline={true}
                                >
                                  Show/Hide Layer
                                </ReactTooltip>
                                &nbsp;&nbsp;
                                <div
                                  style={
                                    selectedLayer == items.layer_name
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
                            </div>
                          </Row>
                        </FormGroup>
                      );
                    })}
                  </Panel>
                );
              })}
            </Collapse>
          </Modal>
          <Modal
            title="Downloads"
            visible={isModalDownload}
            onOk={handleOk1}
            onCancel={handleCancel1}
            mask={false}
            footer={null}
            className="layer-modal"
            bodyStyle={{
              overflowX: "scroll",
              backgroundColor: "#073d6f",
              color: "white",
              height: "323px",
            }}
          >
            <Multistep
              activeStep={0}
              showNavigation={true}
              steps={steps}
              prevStyle={prevStyle}
              // nextStyle={isActivebutton ? nextStyle : nextDisabled}
              nextStyle={nextStyle}
            />
          </Modal>
          <Modal
            title="Other"
            visible={isModalOther}
            onOk={handleOtherOk}
            onCancel={handleOtherCancel}
            mask={false}
            footer={null}
            className="layer-modal"
            bodyStyle={{
              overflowX: "scroll",
              backgroundColor: "#073d6f",
              color: "white",
              height: "323px",
            }}
          >
            <div style={{ fontSize: "16px" }}>
              <div class="row">
                <div class="col mb-2">
                  <Link to="/about-project" className="mobile-link">
                    {" "}
                    <BiErrorCircle />
                    &nbsp;About Project
                  </Link>
                </div>
                <div class="w-100"></div>
                <div class="col mb-2">
                  <div className="mobile-link"
                  onClick={(e) => {
                    {
                      window
                        .open("https://dev.misteo.co/dicrahelp/", "_blank")
                        .focus();
                    }
                  }}
                  >
                    <BiHelpCircle />
                    &nbsp;Help
                  </div>
                </div>
                <div class="w-100"></div>
                <div class="col mb-2">
                  <Link to="/analytics" className="mobile-link">
                    <BiBarChartAlt />
                    &nbsp;Site Analytics
                  </Link>
                </div>
                <div class="w-100"></div>
                <div
                  class="col"
                  className="mobile-link"
                  onClick={handleClick}
                >
                  <AiFillGithub />
                  &nbsp;Github
                </div>
              </div>
            </div>
          </Modal>
        </>
      </div>
    </React.Fragment>
  );
};
export default BottomNav;
