import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Toggle from "../../../assets/images/toggle.png";
import Close from "../../../assets/images/close.png";
import Layer from "../../../assets/images/layer.png";
import Download from "../../../assets/images/download.png";
import Help from "../../../assets/images/help.png";
import Analytics from "../../../assets/images/siteanalytics.png";
import Git from "../../../assets/images/github.png";
import { NavLink } from "react-router-dom";
import Back from "../../../assets/images/back.png";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import LayerDetails from "./Download/LayerDetails";
import PersonalDetails from "./Download/PersonalDetails.jsx";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { getlayers } from "../../../assets/api/apiService";
import Nav from "../../../assets/images/navarrow.png";
import ColorPicker from "./ColorPicker";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Config from "../Config/config";
import { setcurrentlayer } from "../../../actions/index";
import { getraster } from "../../../assets/api/apiService";
import {
  BiDownload,
  BiInfoSquare,
  BiHide,
  BiShow,
  // BiSquare,
} from "react-icons/bi";
import { useTour } from "@reactour/tour";
import marker from "../../../assets/images/locationMK.png";
import LulcLegend from "../Common/Legend/LulcLegend";
import CropLegend from "../Common/Legend/CropLegend";
import FELegend from "./Legend/FELegend";

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChangeclass, setIsChangeclass] = useState(false);
  const [Showlayer, setShowlayer] = useState(false);
  const [Showdownload, setShowdownload] = useState(false);
  const [isSteps, setIsSteps] = useState(true);
  const [allLayers, setLayers] = useState([]);
  const [isCollapse, setIsCollapse] = useState([false]);
  const [isLegendshow, setIsLegendshow] = useState([false]);
  const [selectedCategory, setselectedCategory] = useState("SOCIO-ECONOMIC");
  const [selectedCategory_id, setselectedCategory_id] = useState("1");
  const [rasterurl, setrasterurl] = useState("");
  const LayerToggle = useSelector((state) => state.RasterOpacity);

  const { isOpen: isTourOpen, setIsOpen: setTourOpen } = useTour();

  let hoverLatLon = useSelector((state) => state.Hoverlatlon);
  let setval = useSelector((state) => state.setval);
  const LayerDesc = useSelector((state) => state.LayerDescription);
  const currentDate = useSelector((state) => state.setCurrentDate);
  const selectedLayer = useSelector((state) => state.CurrentLayer);
  const currentraster = useSelector((state) => state.RasterLayerUrl);
  let layertype = useSelector((state) => state.CurrentLayerType);
  const DownloadDesc = useSelector((state) => state.DownloadLayer);
  const setplace = useSelector((state) => state.setplace);
  const currentregion = useSelector((state) => state.CurrentRegion);
  var valueKey = 1;
  const toggleClass = () => {
    setIsChangeclass(!isChangeclass);
  };
  const dispatch = useDispatch();
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const toggleStep = () => setIsSteps(!isSteps);
  const toggleLegend = () => {
    setIsCollapse(!isCollapse);
    setShowlayer(!Showlayer);
    setShowdownload(false);
  };
  const toggleshow = () => setIsLegendshow(!isLegendshow);
  function toggleLayer() {
    if (LayerToggle === true) {
      dispatch({ type: "HIDERASTER" });
      setrasterurl(currentraster);
      // dispatch({ type: 'SETRASTERLAYERURL', payload: rasterurl });
      dispatch({ type: "CHANGEKEYMAP" });
    } else {
      dispatch({ type: "SHOWRASTER" });
      // dispatch({ type: 'SETRASTERLAYERURL', payload: rasterurl });
      dispatch({ type: "CHANGEKEYMAP" });
    }
  }
  const getLayers = (id) => {
    getlayers(id).then((json) => {
      let result;
      result = json.data.reduce(function (r, a) {
        r[a.category_id] = r[a.category_id] || [];
        r[a.category_id].push(a);
        return r;
      }, Object.create(null));
      setLayers(result);
      dispatch({ type: "CHANGELAYERDESC", payload: result[1][0] });
    });
  };
  
  const handleDocClick = () => {
    window.open("https://dicra.nabard.org/dicra-documents");
  };

  const handleClick = () => {
    window.open("https://github.com/UNDP-India/Data4Policy/");
  };
  const location = useLocation();

  useEffect(() => {
    getLayers(Config.regionID);
  }, []);

  useEffect(() => {
    valueKey = valueKey + 1;
  }, [setval]);

  function changeLayer(layername, layerdetails) {
    props.onClose();
    dispatch({
      type: "SETSELECTERCATEGORY",
      payload: selectedCategory,
    });
    dispatch({
      type: "SETSELECTERCATEGORYID",
      payload: selectedCategory_id,
    });
    dispatch({ type: "SETDOWNLOADLAYER", payload: layerdetails.display_name });
    dispatch({ type: "DOWNCHANGELAYERDESC", payload: layerdetails });
    dispatch({ type: "REMOVE_MARKER", payload: [0, 0] });
    dispatch(setcurrentlayer(layername));
    dispatch({ type: "CHANGELAYERDESC", payload: layerdetails });
    dispatch({ type: "SHOWDRAWER", payload: false });
    var layerID = layerdetails.id;
    dispatch({
      type: "SETRASLATLON",
      payload: [Config.loaderlatvector, Config.loaderlngvector],
    });

    getraster(layerID).then((json) => {
      if (
        layerdetails.raster_status === false ||
        layerdetails.layername === "SOIL_M_DEV" ||
        layerdetails.layername === "LAI_DPPD"
      ) {
        dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Vector" });
        dispatch({
          type: "SETRASLATLON",
          payload: [60.732421875, 80.67555881973475],
        });
        props.changecurrentlayer(layerdetails.id);
        dispatch({ type: "SETCURRENTREGION", payload: "DISTRICT" });
        dispatch({ type: "SETCUSTOMSTATUS", payload: false });
        dispatch({
          type: "SETCURRRENTBASEMAP",
          payload:
            "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        });
        dispatch({ type: "SETCURRRENTBASEMAPTYPE", payload: "Dark" });
      } else if (layerdetails.raster_status === true) {
        let result = process.env.REACT_APP_APIEND_RASTER.replace(
          "LAYER_DETAILS_ID",
          layerdetails.id
        );
        props.changecurrentlayer(layerdetails.id);
        dispatch({ type: "SETRASTERLAYERURL", payload: result });
        dispatch({ type: "SETCURRENTREGION", payload: "DISTRICT" });
        dispatch({ type: "SETCUSTOMSTATUS", payload: false });
        dispatch({
          type: "SETCURRRENTBASEMAP",
          payload:
            "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        });
        dispatch({ type: "SETCURRRENTBASEMAPTYPE", payload: "Dark" });
        dispatch({ type: "SHOWRASTER" });
        dispatch({ type: "SETCURRRENTLAYERTYPE", payload: "Raster" });
        dispatch({ type: "SHOWLAYERTYPE", payload: true });
      }
      let result = process.env.REACT_APP_APIEND_RASTER.replace(
        "LAYER_DETAILS_ID",
        layerdetails.id
      );
      props.changecurrentlayer(layerdetails.id);
      dispatch({ type: "SETCURRENTREGION", payload: "DISTRICT" });
      dispatch({ type: "SETRASTERLAYERURL", payload: result });
      dispatch({ type: "SETCUSTOMSTATUS", payload: false });
      dispatch({
        type: "SETCURRRENTBASEMAP",
        payload:
          "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      });
      dispatch({ type: "SETCURRRENTBASEMAPTYPE", payload: "Dark" });
      dispatch({ type: "SHOWRASTER" });
      dispatch({ type: "SHOWLAYERTYPE", payload: true });
    });
    localStorage.setItem("id", layerdetails.id);
  }
  const onOpenDownloads = (layer, desc) => {
    dispatch({
      type: "SETSELECTERCATEGORY",
      payload: selectedCategory,
    });
    dispatch({
      type: "SETSELECTERCATEGORYID",
      payload: selectedCategory_id,
    });
    dispatch({ type: "SETDOWNLOADLAYER", payload: layer });
    dispatch({ type: "DOWNCHANGELAYERDESC", payload: desc });
  };
  return (
    <div className="container-sidebar">
      <div
        style={{ width: isOpen ? "303px" : "4rem", padding: "10px" }}
        className="sidebar"
      >
        <div className="top_section">
          <div style={{ marginLeft: isOpen ? "5px" : "5px" }} className="bars">
            <img
              src={isOpen ? Close : Toggle}
              width="25px"
              alt=""
              onClick={() => {
                toggle();
                toggleClass();
              }}
            />
          </div>
        </div>
        <NavLink
          style={
            Showdownload
              ? { background: "#143461" }
              : Showlayer
              ? { background: "#0B202F", borderRadius: "5px" }
              : { background: "#143461" }
          }
          to={`${process.env.PUBLIC_URL}/`}
          key={1}
          className="link"
          activeclassName="active"
          onClick={() => {
            setShowlayer(!Showlayer);
            setShowdownload(false);
            setIsCollapse(false);
            setIsLegendshow(true);
          }}
        >
          <div className="icon">
            {
              <img
                src={Layer}
                width="33px"
                style={{ position: "relative", bottom: "3px", left: "2px" }}
                alt=""
              />
            }
          </div>
          <div
            style={{
              display: isOpen ? "block" : "none",
              textDecoration: "none",
            }}
            className="link_text layer"
          >
            {"Layers"}
          </div>
        </NavLink>
        <NavLink
          to={`${process.env.PUBLIC_URL}/`}
          style={
            Showdownload
              ? { background: "#0B202F", borderRadius: "5px" }
              : { background: "#143461" }
          }
          key={2}
          className="link download"
          onClick={() => {
            setShowlayer(false);
            setShowdownload(!Showdownload);
            setIsCollapse(false);
            setIsLegendshow(true);
          }}
        >
          <div className="icon">
            {
              <img
                src={Download}
                width="18px"
                style={{ position: "relative", left: "9px" }}
                alt=""
              />
            }
          </div>
          <div
            style={{
              display: isOpen ? "block" : "none",
              textDecoration: "none",
            }}
            className="link_text download"
          >
            {"Download"}
          </div>
        </NavLink>
        <div
          // to={`${process.env.PUBLIC_URL}/help`}
          // key={5}
          // className="link"
          // activeclassName="active"
          // onClick={() => {
          //   setShowlayer(false);
          //   setShowdownload(false);
          //   setIsLegendshow(false);
          // }}
          className="link"
          onClick={() => {
            setShowlayer(false);
            setShowdownload(false);
            // setIsLegendshow(true);
            handleDocClick();
          }}
        >
          <div className="icon">
            {
              <img
                src={Help}
                width="23px"
                style={{ position: "relative", left: "6px" }}
                alt=""
              />
            }
          </div>
          <div
            style={{
              display: isOpen ? "block" : "none",
              textDecoration: "none",
            }}
            className="link_text help"
          >
            {"Help"}
          </div>
        </div>
        <NavLink
          to={`${process.env.PUBLIC_URL}/analytics`}
          key={6}
          className="link"
          activeclassName="active"
          onClick={() => {
            setShowlayer(false);
            setShowdownload(false);
            setIsLegendshow(false);
          }}
        >
          <div className="icon">
            {
              <img
                src={Analytics}
                width="17px"
                style={{ position: "relative", left: "9px" }}
                alt=""
              />
            }
          </div>
          <div
            style={{
              display: isOpen ? "block" : "none",
              textDecoration: "none",
            }}
            className="link_text analytics"
          >
            {"Site Analytics"}
          </div>
        </NavLink>
        <div
          className="link"
          onClick={() => {
            setShowlayer(false);
            setShowdownload(false);
            // setIsLegendshow(true);
            handleClick();
          }}
        >
          <div className="icon">
            {
              <img
                src={Git}
                width="17px"
                style={{ position: "relative", left: "9px" }}
                alt=""
              />
            }
          </div>
          <div
            style={{
              display: isOpen ? "block" : "none",
              textDecoration: "none",
            }}
            className="link_text github"
          >
            {"GitHub"}
          </div>
        </div>
        {Showlayer && (
          <div className="layer-container">
            <div
              className={
                isChangeclass ? "side-drawer" : "side-drawer-collapsed"
              }
            >
              <div
                className="layer-content"
                style={{
                  padding: "10px",
                  height: "calc(100vh - 60px)",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <div>
                  <span
                    style={{
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "20px",
                      lineHeight: "30px",
                      color: "#FFFFFF",
                      padding: "10px",
                      margiTop: "20px",
                    }}
                  >
                    Layers
                  </span>
                </div>
                <div>
                  <div
                    className="radio-toolbar"
                    style={{ flexWrap: "wrap", display: "flex" }}
                    data-tut="reactour__layers"
                  >
                    <input
                      type="radio"
                      id="socio-eco"
                      name="radiolayer"
                      onClick={() => {
                        setselectedCategory("SOCIO-ECONOMIC");
                        setselectedCategory_id("1");
                      }}
                      defaultChecked={
                        selectedCategory === "SOCIO-ECONOMIC" ? true : false
                      }
                    />
                    <label for="socio-eco" className="icon-socienv">
                      <svg
                        width="30"
                        height="34"
                        viewBox="0 0 43 34"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke-width="0"
                      >
                        <path d="M41.8226 32.4023H39.6847C39.4038 32.4023 39.1443 32.5523 39.004 32.7953C38.8636 33.0385 38.8636 33.3382 39.004 33.5813C39.1443 33.8245 39.4038 33.9743 39.6847 33.9743H41.8226C42.1033 33.9743 42.3627 33.8245 42.5031 33.5813C42.6435 33.3382 42.6435 33.0385 42.5031 32.7953C42.3627 32.5523 42.1033 32.4023 41.8226 32.4023Z" />
                        <path d="M37.3122 32.4024H34.2888V6.97393H35.6877C37.3277 6.9712 38.8995 6.31809 40.0586 5.1581C41.2176 3.99811 41.8693 2.42566 41.8706 0.785967C41.8706 0.577539 41.7879 0.377633 41.6404 0.230117C41.493 0.082749 41.2931 2.64509e-05 41.0847 2.64509e-05H38.9417C37.84 0.000538112 36.7586 0.295103 35.8089 0.853363C34.8592 1.41144 34.0759 2.21312 33.5394 3.17527C33.0014 2.21006 32.2146 1.40633 31.261 0.847905C30.3072 0.289654 29.2214 -0.00320473 28.1163 2.64509e-05H26.0204C25.8119 2.64509e-05 25.612 0.082749 25.4646 0.230117C25.3171 0.377655 25.2344 0.577556 25.2344 0.785967C25.2357 2.42221 25.8846 3.99138 27.0391 5.15089C28.1937 6.31023 29.7601 6.96568 31.3964 6.97406H32.7167V32.4026H28.8916H28.8918C28.6108 32.4026 28.3514 32.5525 28.211 32.7955C28.0707 33.0388 28.0707 33.3385 28.211 33.5815C28.3514 33.8247 28.6108 33.9745 28.8918 33.9745H37.312C37.5928 33.9745 37.8522 33.8247 37.9926 33.5815C38.133 33.3384 38.133 33.0387 37.9926 32.7955C37.8522 32.5525 37.5928 32.4026 37.312 32.4026L37.3122 32.4024ZM38.9418 1.57699H40.2307C40.0445 2.64865 39.4864 3.62019 38.6544 4.3207C37.8225 5.02138 36.7701 5.40616 35.6826 5.40738H34.4041C34.5888 4.33659 35.145 3.36519 35.9748 2.66385C36.8046 1.96233 37.8551 1.57581 38.9418 1.57189V1.57699ZM31.3965 5.40721V5.40738C30.3088 5.40618 29.2564 5.02139 28.4246 4.32069C27.5928 3.62018 27.0345 2.64865 26.8484 1.57699H28.1164C29.2041 1.57835 30.2563 1.96298 31.0883 2.66367C31.9202 3.36418 32.4782 4.33572 32.6645 5.40738H31.3965V5.40721Z" />
                        <path d="M23.4478 16.6937C25.0886 16.6923 26.6617 16.0399 27.8221 14.8795C28.9822 13.7194 29.6347 12.1462 29.636 10.5052C29.636 10.2968 29.5531 10.0969 29.4058 9.9495C29.2584 9.80211 29.0585 9.71924 28.8501 9.71924H26.7069C25.6049 9.72043 24.523 10.0157 23.5733 10.5748C22.6236 11.1341 21.8403 11.9366 21.3048 12.8998C20.7685 11.9376 19.9849 11.1361 19.0352 10.5779C18.0857 10.0196 17.0041 9.72505 15.9026 9.72452H13.7595C13.5511 9.72452 13.3512 9.80741 13.2038 9.95478C13.0564 10.1021 12.9735 10.3021 12.9735 10.5105C12.9762 12.1503 13.6294 13.7222 14.7894 14.8813C15.9495 16.0405 17.5218 16.6922 19.1619 16.6936H20.4823V32.4128H9.81413V27.4927H11.2131C12.8531 27.4898 14.4248 26.8369 15.5839 25.6769C16.7429 24.5167 17.3946 22.9444 17.396 21.3043C17.396 21.0959 17.3131 20.896 17.1657 20.7486C17.0184 20.6012 16.8185 20.5183 16.61 20.5183H14.4932C13.3916 20.5188 12.3101 20.8134 11.3604 21.3716C10.4107 21.9299 9.62731 22.7314 9.09103 23.6937C8.55461 22.7314 7.77118 21.9299 6.82147 21.3716C5.87177 20.8134 4.79037 20.5188 3.68872 20.5183H1.52474C1.31632 20.5183 1.11641 20.6012 0.969025 20.7486C0.821487 20.8959 0.738765 21.0958 0.738765 21.3043C0.74013 22.9443 1.39186 24.5165 2.55084 25.6769C3.71001 26.8369 5.28176 27.4898 6.92167 27.4927H8.24199V32.4023L0.785836 32.4022C0.505086 32.4022 0.245661 32.5521 0.10528 32.7951C-0.0350932 33.0384 -0.0350932 33.3381 0.10528 33.5811C0.245652 33.8243 0.505081 33.9741 0.785836 33.9741H24.569C24.8498 33.9741 25.1092 33.8243 25.2496 33.5811C25.39 33.3381 25.39 33.0384 25.2496 32.7951C25.1092 32.5521 24.8498 32.4022 24.569 32.4022H22.0539V16.6829H23.4528L23.4478 16.6937ZM14.493 22.0906H15.7873C15.601 23.1623 15.0429 24.1338 14.2109 24.8343C13.3791 25.535 12.3267 25.9198 11.2392 25.921H9.91865C10.1058 24.8449 10.6676 23.8699 11.5051 23.1688C12.3424 22.4676 13.4009 22.0857 14.493 22.0906V22.0906ZM6.9478 25.9208V25.921C5.86029 25.9198 4.80789 25.535 3.97604 24.8343C3.14401 24.1338 2.58593 23.1623 2.39966 22.0906H3.68864C4.77086 22.0993 5.81576 22.4873 6.6411 23.1873C7.46645 23.8871 8.02012 24.8546 8.20534 25.9209H6.92169L6.9478 25.9208ZM26.7069 11.2914H27.9959C27.8098 12.3631 27.2515 13.3346 26.4197 14.0351C25.5878 14.7358 24.5354 15.1206 23.4478 15.1218H22.1588C22.345 14.0502 22.9031 13.0786 23.7352 12.3781C24.567 11.6774 25.6194 11.2927 26.7069 11.2914H26.7069ZM19.1617 15.1217L19.1618 15.1218C18.0741 15.1206 17.0217 14.7358 16.1899 14.0351C15.3581 13.3346 14.7998 12.3631 14.6137 11.2914H15.9027C16.9902 11.2926 18.0426 11.6774 18.8745 12.3781C19.7065 13.0786 20.2646 14.0502 20.4508 15.1218H19.1619L19.1617 15.1217Z" />
                      </svg>

                      <div>Socio-Economic</div>
                    </label>

                    <input
                      type="radio"
                      id="env"
                      name="radiolayer"
                      onClick={() => {
                        setselectedCategory("ENVIRONMENTAL");
                        setselectedCategory_id("2");
                      }}
                      defaultChecked={
                        selectedCategory === "ENVIRONMENTAL" ? true : false
                      }
                    />
                    <label for="env" className="icon-env">
                      <svg
                        width="22"
                        height="36"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 490.668 490.668"
                        stroke-width="12.2667"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0" />

                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />

                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <g>
                              {" "}
                              <path d="M487.486,3.079c-2.347-2.347-5.653-3.413-8.96-2.987c-4.8,0.64-11.2,1.387-18.987,2.24 c-66.987,7.36-244.8,27.093-343.787,128.427c-111.36,114.027-66.88,208.747-30.507,255.04c1.28,1.707,2.987,3.627,4.8,5.653 c-6.4,9.6-31.893,44.693-85.227,79.573c-4.907,3.2-6.293,9.813-3.093,14.827c3.2,4.907,9.813,6.293,14.827,3.093 c51.307-33.6,78.4-67.2,88.64-81.813c2.88,2.773,5.547,5.227,7.573,7.147c15.467,13.76,53.44,41.92,105.493,41.92 c40.96,0,90.56-17.387,144.747-72.853C463.166,280.839,481.832,96.839,488.872,27.612c0.64-6.4,1.173-11.627,1.707-15.467 C491.006,8.625,489.832,5.425,487.486,3.079z M467.752,25.265c-6.187,60.8-24.96,245.76-119.893,342.933 c-106.88,109.44-189.973,57.387-220.8,29.973c-2.56-2.24-5.76-5.333-9.067-8.64c9.707-12.907,20.267-27.84,32.107-44.587 c59.947-84.48,150.507-212.053,254.613-249.707c5.547-2.027,8.427-8.107,6.4-13.653c-2.027-5.547-8.107-8.427-13.653-6.4 c-110.507,40-199.68,165.76-264.853,257.6c-10.88,15.36-20.587,29.013-29.547,41.067c-0.32-0.427-0.747-0.853-0.96-1.173 c-39.253-49.813-66.027-129.707,29.013-226.88c93.547-96,265.92-115.093,330.773-122.24l6.08-0.64 C467.859,23.665,467.752,24.519,467.752,25.265z" />{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                      <div>Environmental</div>
                    </label>

                    <input
                      type="radio"
                      id="infra"
                      name="radiolayer"
                      onClick={() => {
                        setselectedCategory("INFRASTRUCTURE");
                        setselectedCategory_id("3");
                      }}
                      defaultChecked={
                        selectedCategory === "INFRASTRUCTURE" ? true : false
                      }
                    />
                    <label for="infra" className="icon-infra">
                      <svg
                        width="23"
                        height="34"
                        viewBox="0 0 31 34"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke-width="0"
                      >
                        <path d="M30.4912 8.32528L16.0147 0.134971C15.6966 -0.0449905 15.3037 -0.0449905 14.9856 0.134971L0.509114 8.32528C0.193932 8.5037 0 8.83163 0 9.18636V33.0039C0 33.554 0.458389 34 1.0237 34H29.9763C30.5416 34 31 33.554 31 33.0039V9.18636C31 8.83154 30.8061 8.50358 30.4909 8.32528H30.4912ZM8.15846 23.9653V19.1818H22.8422V23.9653H8.15846ZM22.8422 17.1896H8.15846V15.3483H22.8422V17.1896ZM22.8422 13.3561H8.15846V11.5148H22.8422V13.3561ZM8.15846 25.9577H10.2938V27.4961C10.2938 28.0462 10.7522 28.4922 11.3175 28.4922C11.8828 28.4922 12.3412 28.0462 12.3412 27.4961V25.9577H14.4766V32.008H8.15835L8.15846 25.9577ZM16.524 25.9577H18.6594V27.4961C18.6594 28.0462 19.1178 28.4922 19.6831 28.4922C20.2484 28.4922 20.7068 28.0462 20.7068 27.4961V25.9577H22.8421V32.008H16.5239L16.524 25.9577ZM28.9531 32.008H24.8899V10.5186C24.8899 9.9685 24.4315 9.52248 23.8662 9.52248H7.13476C6.56945 9.52248 6.11106 9.9685 6.11106 10.5186V32.008H2.04781V9.75952L15.5004 2.14862L28.9531 9.75952L28.9531 32.008Z" />
                      </svg>

                      <div>Infrastructure</div>
                    </label>

                    <input
                      type="radio"
                      id="dppd"
                      name="radiolayer"
                      onClick={() => {
                        setselectedCategory(
                          "POSITIVE DEVIANCE & NEGATIVE DEVIANCE"
                        );
                        setselectedCategory_id("4");
                      }}
                      defaultChecked={
                        selectedCategory ===
                        "POSITIVE DEVIANCE & NEGATIVE DEVIANCE"
                          ? true
                          : false
                      }
                    />
                    <label for="dppd" className="icon-dppd">
                      <svg
                        width="25"
                        height="36"
                        viewBox="0 0 35 36"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke-width="0"
                      >
                        <path
                          d="M7.0144 35.2008H7.1484L7.15957 35.184C7.44068 35.1183 7.65019 34.866 7.6501 34.5648C7.6501 34.5647 7.6501 34.5647 7.6501 34.5647V16.0317C7.6501 15.6807 7.36538 15.396 7.0144 15.396H1.3857C1.03472 15.396 0.75 15.6807 0.75 16.0317V34.5651C0.75 34.9161 1.03472 35.2008 1.3857 35.2008H7.0144ZM6.37846 33.9293H2.02123V16.6675H6.37835L6.37846 33.9293Z"
                          stroke="#C1C1C1"
                          stroke-width="0.5"
                        />
                        <path
                          d="M15.5832 35.2008V35.2009H15.8332C16.1843 35.2009 16.4691 34.9162 16.4689 34.5651C16.4689 34.565 16.4689 34.565 16.4689 34.5649V23.0068C16.4689 22.6558 16.1842 22.3711 15.8332 22.3711H10.2045C9.85357 22.3711 9.56885 22.6558 9.56885 23.0068V34.5651C9.56885 34.916 9.85356 35.2008 10.2045 35.2008H15.5832ZM15.1973 23.6426V33.9292H10.8402V23.6426H15.1973Z"
                          stroke-width="0.5"
                        />
                        <path
                          d="M24.4014 35.201V35.2011H24.6514C25.0022 35.2011 25.2872 34.9165 25.2871 34.5653C25.2871 34.5653 25.2871 34.5652 25.2871 34.5652V20.7158C25.2871 20.3648 25.0023 20.0801 24.6514 20.0801H19.0227C18.6717 20.0801 18.387 20.3648 18.387 20.7158V34.5653C18.387 34.9163 18.6717 35.201 19.0227 35.201H24.4014ZM24.0154 21.3515V33.9295H19.6583V21.3515H24.0154Z"
                          stroke-width="0.5"
                        />
                        <path
                          d="M27.8424 35.2011H33.2281L33.2281 35.2012H33.4711C33.822 35.2012 34.1068 34.9165 34.1066 34.5654C34.1066 34.5654 34.1066 34.5653 34.1066 34.5653V4.77291C34.1066 4.42193 33.8219 4.13721 33.4709 4.13721H27.8422C27.4913 4.13721 27.2065 4.42192 27.2065 4.77291V4.77291L27.2067 34.5654C27.2067 34.9164 27.4914 35.2011 27.8424 35.2011ZM32.8351 5.40953V33.9296H28.478V5.40953H32.8351Z"
                          stroke-width="0.5"
                        />
                        <path
                          d="M14.5526 5.92621L14.3206 5.833C14.2797 5.93482 14.2524 6.0136 14.2352 6.12224C14.2202 6.21688 14.2132 6.33336 14.2028 6.50622C14.2025 6.51074 14.2023 6.5153 14.202 6.51989L14.202 6.52014C14.1758 6.96266 14.1129 8.00423 13.8624 10.6369C13.6645 12.7136 13.9132 14.4292 14.6322 15.7134L14.6322 15.7134C15.2701 16.8524 16.2519 17.5937 17.4696 17.8383L17.4698 17.8383C17.7564 17.8957 18.0459 17.9234 18.3351 17.9234H18.5482L18.549 17.9183C20.4946 17.827 22.3762 16.5014 22.9573 14.6366L22.9573 14.6365C23.2813 13.5953 23.3402 11.9746 21.8978 10.095C20.5837 8.38146 18.3058 6.8352 15.1619 5.48614C15.0031 5.41692 14.8243 5.41792 14.6682 5.48206C14.5098 5.54716 14.384 5.67439 14.3204 5.83341L14.5526 5.92621ZM14.5526 5.92621C14.5911 5.82982 14.6675 5.75263 14.7632 5.7133C14.8589 5.67397 14.9676 5.67397 15.0626 5.71556L22.7186 14.5622C22.1515 16.382 20.2553 17.6734 18.3351 17.6734L18.3351 17.6734C18.0619 17.6734 17.7889 17.6472 17.5188 17.5932C16.3778 17.364 15.4552 16.6713 14.8503 15.5912C14.1653 14.3677 13.9161 12.7091 14.1113 10.6606C14.362 8.02526 14.4252 6.9807 14.4515 6.53488C14.4739 6.16228 14.477 6.11437 14.5526 5.92621ZM15.4456 7.00411C17.7841 8.09097 19.5274 9.29953 20.6056 10.5265C21.732 11.8084 22.1105 13.0802 21.7438 14.2578L21.7438 14.2578C21.2478 15.8513 19.4005 16.9301 17.7209 16.592L17.7208 16.592C16.7746 16.4018 16.0554 15.7889 15.604 14.802C15.149 13.8071 14.9689 12.4335 15.1284 10.7576L15.1284 10.7576C15.3238 8.70218 15.4059 7.60473 15.4456 7.00411Z"
                          stroke="#C1C1C1"
                          stroke-width="0.5"
                        />
                        <path
                          d="M21.5209 21.2677C21.3025 21.1423 21.1706 20.8927 21.2075 20.6283L21.2075 20.6283C21.2074 20.629 21.2207 20.5308 21.2353 20.3569C21.2499 20.1831 21.2656 19.9346 21.2706 19.6339C21.2805 19.0314 21.247 18.2254 21.0767 17.3952L21.5209 21.2677ZM21.5209 21.2677L21.4936 21.352H21.8377C22.1496 21.352 22.4213 21.1225 22.4669 20.8069M21.5209 21.2677L22.4669 20.8069M22.4669 20.8069C22.4669 20.8069 22.4669 20.8069 22.4669 20.8069L22.2195 20.771L22.4669 20.8069ZM22.4669 20.8069C22.4787 20.7254 22.7073 19.037 22.3264 17.1608L22.3264 17.1608M22.4669 20.8069L22.3264 17.1608M17.8463 13.5529L17.8462 13.5529C17.5066 13.4652 17.3019 13.1182 17.3897 12.7785L17.8463 13.5529ZM17.8463 13.5529C19.5431 13.9903 20.6367 15.2556 21.0767 17.3951L17.8463 13.5529ZM22.3264 17.1608C21.8041 14.5888 20.3713 12.8915 18.164 12.322L22.3264 17.1608ZM18.1639 12.322C17.8243 12.2343 17.4774 12.439 17.3897 12.7785L18.1639 12.322Z"
                          stroke-width="0.5"
                        />
                        <path
                          d="M10.9742 1.03118C7.84774 2.37326 5.61489 3.8979 4.33732 5.56342C2.94866 7.3742 3.01656 8.90945 3.31819 9.87839C3.85827 11.6132 5.60416 12.8665 7.42813 12.9818L10.9742 1.03118ZM10.9742 1.03118C11.07 0.990273 11.1779 0.989483 11.2736 1.0296M10.9742 1.03118L11.2736 1.0296M11.2736 1.0296C11.3693 1.06893 11.4456 1.14611 11.4843 1.24251C11.5599 1.43158 11.5629 1.47938 11.5853 1.85118M11.2736 1.0296L11.3702 0.79903C11.37 0.798925 11.3697 0.79882 11.3695 0.798716M11.3695 0.798716C11.5277 0.863986 11.6528 0.991089 11.7163 1.14948L11.7164 1.14969C11.7572 1.25181 11.7845 1.33068 11.8017 1.43917C11.8167 1.53379 11.8236 1.65004 11.834 1.82256L11.8348 1.83606L11.5853 1.85118M11.3695 0.798716C11.2108 0.732455 11.0329 0.734241 10.876 0.8013L10.8756 0.801454C7.73166 2.15103 5.45401 3.69687 4.13896 5.41126L4.13894 5.41128C2.69747 7.29093 2.75542 8.91167 3.07949 9.95269L3.07949 9.9527C3.64294 11.7626 5.42919 13.0632 7.31092 13.2237L7.30272 13.2406H7.70162C7.99062 13.2406 8.28027 13.2129 8.56725 13.1546M11.3695 0.798716L11.8348 1.83616L11.5853 1.85118M11.5853 1.85118L11.5859 1.86159C11.6133 2.31328 11.6767 3.36116 11.9256 5.97694M11.9256 5.97694C12.1207 8.02524 11.8723 9.68379 11.1865 10.9075C10.5809 11.9884 9.65815 12.6804 8.51801 12.9095L8.56782 13.1545C8.56763 13.1545 8.56744 13.1546 8.56725 13.1546M11.9256 5.97694L12.1744 5.95323C12.1744 5.95324 12.1744 5.95325 12.1744 5.95327C12.3723 8.02969 12.1244 9.74534 11.4046 11.0298M11.9256 5.97694L11.4046 11.0298M8.56725 13.1546C9.78403 12.9101 10.7659 12.1695 11.4046 11.0298M8.56725 13.1546L11.4046 11.0298M10.5916 2.32122C10.6312 2.92157 10.7131 4.01857 10.9097 6.07388C11.0693 7.74979 10.889 9.12337 10.4338 10.1183C9.98235 11.1052 9.26311 11.7181 8.31733 11.9083L8.31705 11.9083C8.10892 11.9504 7.89799 11.9705 7.68709 11.9705C6.19385 11.9697 4.72708 10.9653 4.29345 9.57404L10.5916 2.32122ZM10.5916 2.32122C8.25287 3.40796 6.50964 4.61651 5.43149 5.84344C4.30515 7.12519 3.92678 8.39683 4.29344 9.574L10.5916 2.32122Z"
                          stroke-width="0.5"
                        />
                        <path
                          d="M4.58541 16.6682H4.20014C3.8884 16.6682 3.61609 16.4394 3.57149 16.1212L3.81907 16.0865M4.58541 16.6682L4.96187 12.7106C5.40168 10.5712 6.49528 9.30653 8.1924 8.86833L8.19245 8.86831C8.53202 8.78057 8.73674 8.43377 8.64894 8.09396L8.64894 8.09395C8.5612 7.75438 8.2144 7.54966 7.87458 7.63746L7.87457 7.63746C5.66745 8.20775 4.23471 9.90404 3.71217 12.4762L3.71216 12.4763C3.33123 14.3529 3.55992 16.0414 3.57165 16.1223L3.81907 16.0865M4.58541 16.6682L4.54099 16.5686M4.58541 16.6682L4.54099 16.5686M3.81907 16.0865C3.82306 16.1149 3.83005 16.1422 3.83969 16.1681L3.95716 12.526C3.58457 14.3615 3.80901 16.0171 3.81907 16.0865ZM4.54099 16.5686C4.74492 16.4391 4.86571 16.1984 4.83035 15.9439L4.8303 15.9439C4.813 15.8035 4.63393 14.3064 4.96186 12.7107L4.54099 16.5686Z"
                          stroke-width="0.5"
                        />
                      </svg>

                      <div>Positive & Negative Deviance </div>
                    </label>
                  </div>
                </div>
                <div className="radio-header">{selectedCategory}</div>
                <div data-tut="reactour__radio-btn">
                  {allLayers[selectedCategory_id] === undefined
                    ? console.log()
                    : allLayers[selectedCategory_id].map((item) => {
                        return (
                          <div
                            style={
                              // item.display_name === "Land Service Temperature (LST)" ||
                              item.layer_name === "SOILORGANICCARBON" ||
                              item.isavailable === false
                                ? { display: "none" }
                                : {}
                            }
                          >
                            <FormGroup check>
                              <Row style={{ padding: "10px" }}>
                                <Col md={7}>
                                  <Input
                                    name="radio1"
                                    type="radio"
                                    checked={
                                      LayerDesc.layer_name === item.layer_name
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      changeLayer(item.layer_name, item);
                                    }}
                                  />{" "}
                                  <Label check>{item.display_name}</Label>
                                </Col>
                                <Col md={5}>
                                  <Row>
                                    <div
                                      className="col-md-4"
                                      style={
                                        LayerDesc.layer_name === item.layer_name
                                          ? {}
                                          : { display: "none" }
                                      }
                                    >
                                      {" "}
                                      {LayerDesc.raster_status === false ? (
                                        <BiShow
                                          style={{ cursor: "not-allowed" }}
                                        />
                                      ) : LayerToggle ? (
                                        <BiShow
                                          data-tooltip-id="show-tooltip"
                                          data-tooltip-content="Show/hide"
                                          onClick={(e) => toggleLayer()}
                                        />
                                      ) : (
                                        <BiHide
                                          data-tooltip-id="show-tooltip"
                                          data-tooltip-content="Show/hide"
                                          onClick={(e) => toggleLayer()}
                                        />
                                      )}
                                      <Tooltip id="show-tooltip" />
                                    </div>
                                    <div className="col-md-4">
                                      <div
                                        style={
                                          LayerDesc.layer_name ===
                                          item.layer_name
                                            ? {}
                                            : { display: "none" }
                                        }
                                      >
                                        <BiDownload
                                          data-tip
                                          data-for="download-btn"
                                          data-tooltip-id="download-tooltip"
                                          data-tooltip-content="Download"
                                          onClick={() => {
                                            setShowdownload(!Showdownload);
                                            onOpenDownloads(
                                              item.display_name,
                                              item
                                            );
                                          }}
                                        />
                                        <Tooltip id="download-tooltip" />
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <BiInfoSquare
                                        data-tooltip-id="about-tooltip"
                                        data-tooltip-content={
                                          item.isavailable
                                            ? item.short_description
                                            : "Work in progress"
                                        }
                                      />
                                      <Tooltip id="about-tooltip" />
                                    </div>
                                  </Row>
                                </Col>
                              </Row>
                            </FormGroup>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        )}
        {Showdownload && (
          <div className="layer-container">
            <div
              className={
                isChangeclass ? "side-drawer" : "side-drawer-collapsed "
              }
            >
              <div
                className="layer-content"
                style={{
                  padding: "10px",
                  height: "calc(100vh - 60px)",
                  overflowY: "auto",
                }}
              >
                {isSteps ? (
                  <div>
                    <span
                      style={{
                        fontStyle: "normal",
                        fontWeight: "600",
                        fontSize: "20px",
                        lineHeight: "30px",
                        color: "#FFFFFF",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={Back}
                        alt=""
                        className="back-btn"
                        width="9px"
                        height="14.62px"
                        onClick={() => setShowdownload(false)}
                      />
                      &nbsp; Downloads
                    </span>
                    <div>
                      <LayerDetails />
                      <Form
                        style={{
                          margin: "none",
                          border: "none",
                          padding: "10px",
                        }}
                      >
                        <Button
                          style={{
                            background: "#143461",
                            backdropFilter: "blur(27px)",
                            borderRadius: "9.56633px",
                            width: "375px",
                            // height: "64px",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                          onClick={toggleStep}
                        >
                          Next
                        </Button>
                      </Form>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span
                      style={{
                        fontStyle: "normal",
                        fontWeight: "600",
                        fontSize: "20px",
                        lineHeight: "30px",
                        color: "#FFFFFF",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={Back}
                        alt=""
                        className="back-btn"
                        width="9px"
                        height="14.62px"
                        onClick={toggleStep}
                      />
                      &nbsp; {DownloadDesc} Downloads
                    </span>
                    <div style={{ padding: "10px" }}>
                      <PersonalDetails />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <main>
        {location.pathname === `${process.env.PUBLIC_URL}/usecases` ||
        location.pathname === `${process.env.PUBLIC_URL}/about` ||
        location.pathname === `${process.env.PUBLIC_URL}/analytics` ||
        location.pathname === `${process.env.PUBLIC_URL}/help` ? null : (
          <span style={{ display: isLegendshow ? "block" : "none" }}>
            <div
              className="legend"
              style={{
                marginLeft: isCollapse
                  ? "20px"
                  : Showdownload
                  ? "350px"
                  : Showlayer
                  ? "350px"
                  : "20px",
              }}
              data-tut="reactour__legend"
            >
              {LayerDesc.layer_name === "LULC" ||
              LayerDesc.layer_name === "crop_intensity" ||
              LayerDesc.layer_name === "crop_type" ||
              LayerDesc.layer_name === "crop_stress" ||
              LayerDesc.layer_name === "crop_land" ||
              LayerDesc.layer_name === "WH" ||
              LayerDesc.layer_name === "FIREEV" ? (
                ""
              ) : (
                <div className="legend-layer-value" key={valueKey}>
                  {}
                  {isNaN(setval)
                    ? "0.0"
                    : setval === undefined
                    ? "0.0"
                    : setval}{" "}
                  <span style={{ fontSize: "14px" }}>
                    {LayerDesc.unit === "unit" || LayerDesc.unit === "string"
                      ? ""
                      : LayerDesc.unit}
                  </span>
                </div>
              )}
              <div className="legend-layer-name">
                <span>
                  {LayerDesc.layer_name === "SOIL_M_DEV" ? (
                    "SOIL MOISTURE"
                  ) : LayerDesc.layer_name === "LST_DPPD" ? (
                    "LST"
                  ) : LayerDesc.layer_name === "LAI_DPPD" ? (
                    "LAI"
                  ) : LayerDesc.layer_name === "NO2_DPPD" ? (
                    "NO2"
                  ) : LayerDesc.layer_name === "NDVI_DPPD" ? (
                    "NDVI"
                  ) : LayerDesc.layer_name === "PM25_DPPD" ? (
                    "PM2.5"
                  ) : LayerDesc.layer_name === "PM25" ? (
                    "PM2.5"
                  ) : LayerDesc.layer_name === "NDWI_DPPD" ? (
                    "NDWI"
                  ) : LayerDesc.layer_name === "crop_intensity" ? (
                    "Crop Intensity"
                  ) : LayerDesc.layer_name === "crop_type" ? (
                    "Crop Type"
                  ) : LayerDesc.layer_name === "crop_stress" ? (
                    "Crop Stress"
                  ) : LayerDesc.layer_name === "crop_land" ? (
                    "Croplands"
                  ) : LayerDesc.layer_name === "FIREEV" ? (
                    ""
                  ) : LayerDesc.layer_name === "DPPD" ? (
                    "CROP FIRES"
                  ) : LayerDesc.layer_name === "WH" ? (
                    <span>
                      <span>
                        <img src={marker} width={15} />{" "}
                      </span>
                      <span style={{ marginLeft: "20px" }}>
                        Warehouses&nbsp;&nbsp;
                      </span>
                    </span>
                  ) : (
                    LayerDesc.layer_name
                  )}
                </span>
                <span
                  style={
                    LayerDesc.layer_name === "LULC" ||
                    LayerDesc.layer_name === "crop_intensity" ||
                    LayerDesc.layer_name === "crop_type" ||
                    LayerDesc.layer_name === "crop_stress" ||
                    LayerDesc.layer_name === "crop_land" ||
                    LayerDesc.layer_name === "WH" ||
                    LayerDesc.layer_name === "FIREEV"
                      ? { display: "none" }
                      : {}
                  }
                >
                  &nbsp;{"|"}&nbsp;
                </span>
                <span
                  style={
                    LayerDesc.layer_name === "LULC" ||
                    LayerDesc.layer_name === "crop_intensity" ||
                    LayerDesc.layer_name === "crop_type" ||
                    LayerDesc.layer_name === "crop_stress" ||
                    (LayerDesc.layer_name === "crop_land") |
                      (LayerDesc.layer_name === "WH") ||
                    LayerDesc.layer_name === "FIREEV"
                      ? { display: "none" }
                      : {}
                  }
                >
                  {currentDate}
                </span>
              </div>
              <div
                className="legend-layer-latlong"
                style={
                  LayerDesc.layer_name === "LULC" ||
                  LayerDesc.layer_name === "crop_intensity" ||
                  LayerDesc.layer_name === "crop_type" ||
                  LayerDesc.layer_name === "crop_stress" ||
                  LayerDesc.layer_name === "crop_land" ||
                  LayerDesc.layer_name === "WH" ||
                  LayerDesc.layer_name === "FIREEV" ||
                  layertype === "Vector" ||
                  currentregion === "CUSTOM"
                    ? { display: "none" }
                    : {}
                }
              >
                {" "}
                {hoverLatLon} <img src={Nav} width="19px" alt="Nav" />
              </div>
              <div
                className="legend-layer-latlong"
                style={
                  LayerDesc.layer_name === "LULC" ||
                  LayerDesc.layer_name === "crop_intensity" ||
                  LayerDesc.layer_name === "crop_type" ||
                  LayerDesc.layer_name === "crop_stress" ||
                  LayerDesc.layer_name === "crop_land" ||
                  LayerDesc.layer_name === "WH" ||
                  LayerDesc.layer_name === "FIREEV" ||
                  currentregion === "CUSTOM"
                    ? { display: "none" }
                    : {}
                }
              >
                {" "}
                {setplace}
              </div>
              <div>
                {LayerDesc.layer_name === "LULC" ? (
                  <LulcLegend />
                ) : LayerDesc.layer_name === "crop_intensity" ||
                  LayerDesc.layer_name === "crop_type" ||
                  LayerDesc.layer_name === "crop_stress" ||
                  LayerDesc.layer_name === "crop_land" ? (
                  <CropLegend />
                ) : LayerDesc.layer_name === "WH" ? (
                  ""
                ) : LayerDesc.layer_name === "FIREEV" ? (
                  <FELegend />
                ) : (
                  <ColorPicker />
                )}
              </div>
            </div>
          </span>
        )}
        <div className="">{props.children}</div>
      </main>
    </div>
  );
};

export default Sidebar;
