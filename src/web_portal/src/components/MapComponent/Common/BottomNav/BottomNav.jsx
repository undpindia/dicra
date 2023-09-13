import React, { Fragment, useEffect, useRef, useState } from 'react';
import { BottomNavigation } from 'reactjs-bottom-navigation';
import { useSelector, useDispatch } from 'react-redux';
import './BottomNav.css';
import Multistep from 'react-multistep';
import {
  BiLayer,
  BiHelpCircle,
  BiBarChartAlt,
} from 'react-icons/bi';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Collapse, Modal } from 'antd';
import { getlayers } from '../../../../assets/api/apiService';
import Config from '../../Config/config';
import { getraster } from '../../../../assets/api/apiService';
import { setcurrentlayer } from '../../../../actions/index';
import {
  BiDownload,
  BiInfoSquare,
  BiHide,
  BiShow,
} from 'react-icons/bi';

import { useNavigate } from 'react-router-dom';
import LayerDetails from '../Download/LayerDetails';
import PersonalDetails from '../Download/PersonalDetails';

const steps = [
  { name: 'StepOne', component: <LayerDetails /> },
  { name: 'StepTwo', component: <PersonalDetails /> },
];

const BottomNav = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDownload, setIsModalDownload] = useState(false);
  const [categorylist, setCategorylist] = useState([]);
  const [activeStep, setactiveStep] = useState(0);
  const [activeLayer, setactiveLayer] = useState('layer');
  const [rasterurl, setrasterurl] = useState('');
  const LayerToggle = useSelector((state) => state.RasterOpacity);
  const [Showdownload, setShowdownload] = useState(false);

  const LayerDesc = useSelector((state) => state.LayerDescription);
  const selectedLayer = useSelector((state) => state.CurrentLayer);
  const currentraster = useSelector((state) => state.RasterLayerUrl);


  const bottomNavItems = [
    {
      title: 'Layers',
      icon: <BiLayer style={{ fontSize: '18px', color: '#90989B' }} />,

      activeIcon: <BiLayer style={{ fontSize: '18px', color: '#90989B' }} />,

      onClick: () => {
        if (props.pathName === 'help' || props.pathName === 'analytics') {
          navigate(`${process.env.PUBLIC_URL}/map`);
        }
        setIsModalDownload(false);
        setIsModalVisible(!isModalVisible);
        setactiveLayer('layer');
        resetStep();
      },
    },

    {
      title: 'Downloads',
      icon: <BiDownload style={{ fontSize: '18px', color: '#90989B' }} />,

      activeIcon: <BiDownload style={{ fontSize: '18px', color: '#90989B' }} />,
      onClick: () => {
        if (props.pathName === 'help' || props.pathName === 'analytics') {
          navigate(`${process.env.PUBLIC_URL}/map`);
        }
        setIsModalDownload(!isModalDownload);
        setIsModalVisible(false);
        // setIsModalOther(false);
        setactiveLayer('download');
        resetStep();
      },
    },

    {
      title: 'Help',
      icon: <BiHelpCircle style={{ fontSize: '18px', color: '#90989B' }} />,
      activeIcon: (
        <BiHelpCircle style={{ fontSize: '18px', color: '#90989B' }} />
      ),

      onClick: () => {
        setIsModalVisible(false);
        setIsModalDownload(false);
        navigate(`${process.env.PUBLIC_URL}/help`);
        setactiveLayer('help');
        resetStep();
      },
    },

    {
      title: 'Analytics',

      icon: <BiBarChartAlt style={{ fontSize: '18px', color: '#90989B' }} />,
      activeIcon: (
        <BiBarChartAlt style={{ fontSize: '18px', color: '#90989B' }} />
      ),
      onClick: () => {
        setIsModalVisible(false);
        setIsModalDownload(false);
        navigate(`${process.env.PUBLIC_URL}/analytics`);
        setactiveLayer('analytics');
        resetStep();
      },
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancel1 = () => {
    setIsModalDownload(false);
  };

  function changeLayer(layername, layerdetails, category_id, category) {
    // props.onClose();

    dispatch({
      type: 'SETSELECTERCATEGORY',
      payload: category,
    });
    dispatch({
      type: 'SETSELECTERCATEGORYID',
      payload: category_id,
    });
    dispatch({ type: 'SETDOWNLOADLAYER', payload: layerdetails.display_name });
    dispatch({ type: 'DOWNCHANGELAYERDESC', payload: layerdetails });

    dispatch(setcurrentlayer(layername));
    dispatch({ type: 'CHANGELAYERDESC', payload: layerdetails });

    var layerID = layerdetails.id;
    dispatch({
      type: 'SETRASLATLON',
      payload: [Config.loaderlatvector, Config.loaderlngvector],
    });
    // console.log("before!~~~", layerID)

    getraster(layerID).then((json) => {
      if (
        layerdetails.raster_status === false ||
        layerdetails.layername === 'SOIL_M_DEV' ||
        layerdetails.layername === 'LAI_DPPD'
      ) {
        dispatch({ type: 'SETCURRRENTLAYERTYPE', payload: 'Vector' });
        dispatch({
          type: 'SETRASLATLON',
          payload: [60.732421875, 80.67555881973475],
        });
        props.changecurrentlayer(layerdetails.id);
        dispatch({ type: 'SETCURRENTREGION', payload: 'DISTRICT' });
        dispatch({ type: 'SETCUSTOMSTATUS', payload: false });
        dispatch({
          type: 'SETCURRRENTBASEMAP',
          payload:
            'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
        });
        dispatch({ type: 'SETCURRRENTBASEMAPTYPE', payload: 'Dark' });
      } else if (layerdetails.raster_status === true) {
        // let result = json.data.rasterlayerUrl;
        let result = process.env.REACT_APP_APIEND_RASTER.replace(
          'LAYER_DETAILS_ID',
          layerdetails.id
        );
        props.changecurrentlayer(layerdetails.id);
        dispatch({ type: 'SETRASTERLAYERURL', payload: result });
        dispatch({ type: 'SETCURRENTREGION', payload: 'DISTRICT' });
        dispatch({ type: 'SETCUSTOMSTATUS', payload: false });
        dispatch({
          type: 'SETCURRRENTBASEMAP',
          payload:
            'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
        });
        dispatch({ type: 'SETCURRRENTBASEMAPTYPE', payload: 'Dark' });
        dispatch({ type: 'SHOWRASTER' });
        dispatch({ type: 'SETCURRRENTLAYERTYPE', payload: 'Raster' });
        dispatch({ type: 'SHOWLAYERTYPE', payload: true });
        // dispatch({ type: 'CHANGEKEYMAP' });
      }
      // console.log("LAYER DETAILS", json)
      // let result = json.data.rasterlayerUrl;
      let result = process.env.REACT_APP_APIEND_RASTER.replace(
        'LAYER_DETAILS_ID',
        layerdetails.id
      );
      props.changecurrentlayer(layerdetails.id);
      dispatch({ type: 'SETCURRENTREGION', payload: 'DISTRICT' });
      dispatch({ type: 'SETRASTERLAYERURL', payload: result });
      dispatch({ type: 'SETCUSTOMSTATUS', payload: false });
      dispatch({
        type: 'SETCURRRENTBASEMAP',
        payload:
          'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
      });
      dispatch({ type: 'SETCURRRENTBASEMAPTYPE', payload: 'Dark' });
      dispatch({ type: 'SHOWRASTER' });
      dispatch({ type: 'SHOWLAYERTYPE', payload: true });
      // dispatch({ type: 'SHOWRASTER' });
      // dispatch({ type: "SETRASLATLON", payload: [60.732421875, 80.67555881973475] });
      // dispatch({ type: 'CHANGEKEYMAP' });
    });
    localStorage.setItem('id', layerdetails.id);
    setIsModalVisible(false);
  }

  const resetStep = () => {
    if (activeLayer === 'layer') {
      setactiveStep(0);
    } else if (activeLayer === 'download') {
      setactiveStep(1);
    } else if (activeLayer === 'other') {
      setactiveStep(0);
    }
  };

  const onOpenDownloads = (layer, desc, category_id, category) => {
    dispatch({
      type: 'SETSELECTERCATEGORY',
      payload: category,
    });
    dispatch({
      type: 'SETSELECTERCATEGORYID',
      payload: category_id,
    });
    dispatch({ type: 'SETDOWNLOADLAYER', payload: layer });
    dispatch({ type: 'DOWNCHANGELAYERDESC', payload: desc });
    setIsModalDownload(true);
    setIsModalVisible(false);
    setactiveStep(0);
  };

  const getLayers = useRef((id) => {
    getlayers(id).then((json) => {
      // console.log("JSON HERER LAYERS", json)
      let result;
      result = json.data.reduce(function (r, a) {
        r[a.category_id] = r[a.category_id] || [];
        r[a.category_id].push(a);
        return r;
      }, Object.create(null));
      setCategorylist([result][0]);
      dispatch({ type: 'CHANGELAYERDESC', payload: result[1][0] });
    });
  });
  function toggleLayer() {
    if (LayerToggle === true) {
      dispatch({ type: 'HIDERASTER' });
      setrasterurl(currentraster);
      // dispatch({ type: 'SETRASTERLAYERURL', payload: rasterurl });
      dispatch({ type: 'CHANGEKEYMAP' });
    } else {
      dispatch({ type: 'SHOWRASTER' });
      // dispatch({ type: 'SETRASTERLAYERURL', payload: rasterurl });
      dispatch({ type: 'CHANGEKEYMAP' });
    }
  }
  useEffect(() => {
    getLayers.current(Config.regionID);
  }, []);

  return (
    <Fragment>
      <div>
        <BottomNavigation items={bottomNavItems} />
      </div>
      <div>
        <>
          <Modal
            title="Layers"
            open={isModalVisible}
            onCancel={handleCancel}
            mask={false}
            footer={null}
            className="layer-modal"
            bodyStyle={{
              overflowX: 'scroll',
              backgroundColor: '#073d6f',
              color: 'white',
              height: '330px',
            }}
          >
            <div className="layer-modal__layer-content">
              <Collapse
                accordion
                bordered={false}
                defaultActiveKey={['0']}
                //   onChange={callback}
                classname="collapse"
              >
                <Collapse.Panel
                  header="SOCIO-ECONOMIC"
                  key="1"
                  className="layer-header"
                >
                  {categorylist[1] &&
                    categorylist[1].map((item, index) => {
                      return (
                        // <div>
                        //   <input type="radio" id="se" name="radiolayer" />
                        //   <label for="se" className="se">
                        //     {item.display_name}
                        //   </label>
                        // </div>
                        <FormGroup check key={index}>
                          <Row className="mb-3">
                            <Col md={12} className="bottom-nav-list-col">
                              <div>
                                <Input
                                  name="radio1"
                                  type="radio"
                                  checked={
                                    selectedLayer === item.layer_name
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    changeLayer(
                                      item.layer_name,
                                      item,
                                      1,
                                      'SOCIO-ECONOMIC'
                                    );
                                  }}
                                />{' '}
                                <Label check>{item.display_name}</Label>
                              </div>

                              <div className="bottom-nav-icons-row ">
                                <div
                                  className="col-md-4"
                                  style={
                                    selectedLayer === item.layer_name
                                      ? {}
                                      : { display: 'none' }
                                  }
                                >
                                  {' '}
                                  {LayerDesc.raster_status === false ? (
                                    <BiShow style={{ cursor: 'not-allowed' }} />
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
                                      selectedLayer === item.layer_name
                                        ? {}
                                        : { display: 'none' }
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
                                          item,
                                          1,
                                          'SOCIO-ECONOMIC'
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
                                        : 'Work in progress'
                                    }
                                  />
                                  <Tooltip id="about-tooltip" />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      );
                    })}
                </Collapse.Panel>
                <Collapse.Panel
                  header="ENVIRONMENT"
                  key="2"
                  className="layer-header"
                >
                  {categorylist[2] &&
                    categorylist[2].map((item, index) => {
                      return (
                        <FormGroup check key={index}>
                          <Row className="mb-3">
                            <Col md={12} className="bottom-nav-list-col">
                              <div>
                                <Input
                                  name="radio1"
                                  type="radio"
                                  checked={
                                    selectedLayer === item.layer_name
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    changeLayer(
                                      item.layer_name,
                                      item,
                                      2,
                                      'ENVIRONMENTAL'
                                    );
                                  }}
                                />{' '}
                                <Label check>{item.display_name}</Label>
                              </div>

                              <div className="bottom-nav-icons-row ">
                                <div
                                  className="col-md-4"
                                  style={
                                    selectedLayer === item.layer_name
                                      ? {}
                                      : { display: 'none' }
                                  }
                                >
                                  {' '}
                                  {LayerDesc.raster_status === false ? (
                                    <BiShow style={{ cursor: 'not-allowed' }} />
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
                                      selectedLayer === item.layer_name
                                        ? {}
                                        : { display: 'none' }
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
                                          item,
                                          2,
                                          'ENVIRONMENTAL'
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
                                        : 'Work in progress'
                                    }
                                  />
                                  <Tooltip id="about-tooltip" />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      );
                    })}
                </Collapse.Panel>
                <Collapse.Panel
                  header="INFRASTRUCTURE"
                  key="3"
                  className="layer-header"
                >
                  {categorylist[3] &&
                    categorylist[3].map((item, index) => {
                      return (
                        <FormGroup check key={index}>
                          <Row className="mb-3">
                            <Col md={5} className="bottom-nav-list-col">
                              <div>
                                <Input
                                  name="radio1"
                                  type="radio"
                                  checked={
                                    selectedLayer === item.layer_name
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    changeLayer(
                                      item.layer_name,
                                      item,
                                      3,
                                      'INFRASTRUCTURE'
                                    );
                                  }}
                                />{' '}
                                <Label check>{item.display_name}</Label>
                              </div>

                              <div className="bottom-nav-icons-row ">
                                <div
                                  className="col-md-4"
                                  style={
                                    selectedLayer === item.layer_name
                                      ? {}
                                      : { display: 'none' }
                                  }
                                >
                                  {' '}
                                  {LayerDesc.raster_status === false ? (
                                    <BiShow style={{ cursor: 'not-allowed' }} />
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
                                      selectedLayer === item.layer_name
                                        ? {}
                                        : { display: 'none' }
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
                                          item,
                                          3,
                                          'INFRASTRUCTURE'
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
                                        : 'Work in progress'
                                    }
                                  />
                                  <Tooltip id="about-tooltip" />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      );
                    })}
                </Collapse.Panel>
                <Collapse.Panel
                  header="POSITIVE DEVIANCE & NEGATIVE DEVIANCE"
                  key="4"
                  className="layer-header"
                >
                  {categorylist[4] &&
                    categorylist[4].map((item, index) => {
                      return (
                        <FormGroup check key={index}>
                          <Row className="mb-3">
                            <Col md={5} className="bottom-nav-list-col">
                              <div>
                                <Input
                                  name="radio1"
                                  type="radio"
                                  checked={
                                    selectedLayer === item.layer_name
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    changeLayer(
                                      item.layer_name,
                                      item,
                                      4,
                                      'POSITIVE DEVIANCE & NEGATIVE DEVIANCE'
                                    );
                                  }}
                                />{' '}
                                <Label check>{item.display_name}</Label>
                              </div>

                              <div className="bottom-nav-icons-row ">
                                <div
                                  className="col-md-4"
                                  style={
                                    selectedLayer === item.layer_name
                                      ? {}
                                      : { display: 'none' }
                                  }
                                >
                                  {' '}
                                  {LayerDesc.raster_status === false ? (
                                    <BiShow style={{ cursor: 'not-allowed' }} />
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
                                      selectedLayer === item.layer_name
                                        ? {}
                                        : { display: 'none' }
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
                                          item,
                                          4,
                                          'POSITIVE DEVIANCE & NEGATIVE DEVIANCE'
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
                                        : 'Work in progress'
                                    }
                                  />
                                  <Tooltip id="about-tooltip" />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      );
                    })}
                </Collapse.Panel>
              </Collapse>
            </div>
          </Modal>

          <Modal
            title="Downloads"
            open={isModalDownload}
            // onOk={handleOk1}
            onCancel={handleCancel1}
            mask={false}
            footer={null}
            className="layer-modal"
            bodyStyle={{
              overflowX: 'scroll',
              backgroundColor: '#073d6f',
              color: 'white',
              height: '330px',
              padding: '20px',
            }}
          >
            <Multistep
              activeStep={activeStep}
              showNavigation={true}
              steps={steps}
            />
          </Modal>
        </>
      </div>
    </Fragment>
  );
};

export default BottomNav;
