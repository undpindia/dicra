import React, { Component } from "react";
import { connect } from "react-redux";
import { centroid, polygon } from "@turf/turf";
import MANDALBOUNDS from "../Shapes/TS_mandal_boundary.json";
import DISTRICTBOUNDS from "../Shapes/TS_district_boundary.json";
import chroma from "chroma-js";
import BottomNav from "../Common/BottomNav";
import Footer from "../Common/Footer";
import LegendMobile from "../Common/LegendMobile";
import {
  Map,
  TileLayer,
  ZoomControl,
  Marker,
  GeoJSON,
  FeatureGroup,
  Tooltip,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeoRaster from "./RGBGeoRaster";
import DrawerModal from "../Common/Drawer";
import CPDrawerModal from "../Common/CPDrawer";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import { BiSearch, BiX, BiHomeAlt } from "react-icons/bi";
import {FormGroup, Input } from "reactstrap";
import Circlemarker from "../img/circlemarker.png";
import MK1 from "../img/locationMK.png";
import { Radio, Select, message } from "antd";
import loader from "../img/loader.gif";
import locIcon from "../img/locationICON.png";
import mandalRegions from "./Regions/mandalRegions";
import districtRegions from "./Regions/districtRegions";
import axiosConfig from "../Common/axios_Config";
import { EditControl } from "react-leaflet-draw";
import SearchPlace from "./searchPlaces";
const removeLayer = (layer) => {
  map.removeLayer(layer);
  window.tiff = 0;
};
// const key = 'AIzaSyD_QaXrN1Qi27IQK1df0nGoqCGX_3vYXd4';
const MAP_STYLES = {
  position: "relative",
  width: "100%",
  height: "100vh",
};
const geojsonArea = require("@mapbox/geojson-area");
const options = [
  { label: "Raster", value: "Raster" },
  { label: "Vector", value: "Vector" },
];
const ruaStyle = {
  color: "#d65522",
  weight: 0.5,
  fillOpacity: 0,
};
const LoaderIcon = new L.Icon({
  iconUrl: loader,
  iconSize: [150, 150],
});
const LocIcon = new L.Icon({
  iconUrl: locIcon,
  iconSize: [50, 50],
  // iconAnchor: [17, 46], //[left/right, top/bottom]
});
const MarkerIcon = new L.Icon({
  iconUrl: Circlemarker,
  iconSize: [10, 10],
});
const MarkerIcon2 = new L.Icon({
  iconUrl: MK1,
  iconSize: [20, 20],
});
let ltype = "Raster";

const mapStateToProps = (ReduxProps) => {
  return {
    place: ReduxProps.setplace,
    parametervalue: ReduxProps.setval,
    vectorLoader: ReduxProps.VectorLoader,
    rasterLoader: ReduxProps.RasterLoader,
    CurrentLayer: ReduxProps.CurrentLayer,
    CurrentRegion: ReduxProps.CurrentRegion,
    CurrentVector: ReduxProps.CurrentVector,
    MapKey: ReduxProps.MapKey,
    LayerDescription: ReduxProps.LayerDescription,
    vectorColor: ReduxProps.SetColor,
    currentLayerType: ReduxProps.CurrentLayerType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVectorColor: (col) => dispatch({ type: "SETCOLOR_SCALE", payload: col }),
    setvalue: (val) => dispatch({ type: "SETVALUE", payload: val }),
    setplace: (plc) => dispatch({ type: "SETPLACE", payload: plc }),
    VectorLoader: () => dispatch({ type: "ENABLEVECTOR" }),
    SetBoundary: (geojson) =>
      dispatch({ type: "SETCURRENTVECTOR", payload: geojson }),
    setRegion: (region) =>
      dispatch({ type: "SETCURRENTREGION", payload: region }),
    setMapKey: () => dispatch({ type: "CHANGEKEYMAP" }),
    setLayerType: (currentlayertype) =>
      dispatch({ type: "SETCURRRENTLAYERTYPE", payload: currentlayertype }),
    showRaster: () => dispatch({ type: "SHOWRASTER" }),
    hideRaster: () => dispatch({ type: "HIDERASTER" }),
  };
};
class map extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.CPchild = React.createRef();
    this.rasterChild = React.createRef();
    this.vectorChild = React.createRef();
    this.state = {
      RGBViewPort: {
        center: [18.1124, 79.0193],
        // zoom: 8,
      },
      boundary: [],
      activeSearch: true,
      active: true,
      currentComodity: "",
      searchPlace: "",
      area: 0.0,
      pointData: false,
      selected_shape: [],
      keyMAP: 1,
      regionkey: 1,
      pointVector: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [55.6761, 12.5683],
            },
            properties: {
              brightness: 330.5,
              scan: 1.16,
              track: 1.07,
              acq_date: "2021-11-02",
              acq_time: 801,
              satellite: "Aqua",
              instrument: "MODIS",
              confidence: 83,
              version: "6.1NRT",
              bright_t31: 296.07,
              frp: 25.58,
              daynight: "D",
              latitude: 12.5683,
              longitude: 55.6761,
            },
          },
        ],
      },
      currentBoundaryPattern: "DISTRICT",
      layerType: "Raster",
      buttonclick: true,
      areaValue: 0.0,
      minVal: 0.0,
      maxVal: 0.0,
      meanVal: 0.0,
      layertransparency: 0.1,
      loaderlatvector: 17.754639747121828,
      loaderlngvector: 79.05833831966801,
      loaderlatraster: 17.754639747121828,
      loaderlngraster: 79.05833831966801,
      locpointerltlng: [60.732421875, 80.67555881973475],
      selectedRegion: "",
      regionList: districtRegions(),
      latnew: 18.1124,
      longnew: 79.0193,
      mapZoom: 7.5,
      layerUID: "",
      showlayertype: true,
      midpoint: [],
      editableFG: [],
      baseMap:
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      attribution: "",
      showCustomDraw: false,
      customStatus: false,
      checked: false,
      baseMapselected: "Dark",
      customShape: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [],
            },
          },
        ],
      },
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.toggleClass = this.toggleClass.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.onchangeshape = this.onchangeshape.bind(this);
    this.onChangeLayertype = this.onChangeLayertype.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.searchRegion = this.searchRegion.bind(this);
    this.style = this.style.bind(this);
    this.resetmapzoom = this.resetmapzoom.bind(this);
    this.resetmapzoommobile = this.resetmapzoommobile.bind(this);
    this.Customlayer = this.Customlayer.bind(this);
    this.openCustomDrawer = this.openCustomDrawer.bind(this);
    this.getlayer = this.getlayer.bind(this);
    this.changeRasterLoader = this.changeRasterLoader.bind(this);
    this.getcustomlocation = this.getcustomlocation.bind(this);
    this.toggleLayer = this.toggleLayer.bind(this);
    this.ChangeBasemap = this.ChangeBasemap.bind(this);
    this.handlePointclick = this.handlePointclick.bind(this);
  }
  onEachrua = (rua, layer) => {
    const ruaname = rua.properties.Dist_Name;
    layer.bindPopup(ruaname);
  };
  changeVectorLoader = (lat, lng) => {
    // 60.732421875,80.67555881973475
    this.setState({
      loaderlatvector: lat,
      loaderlngvector: lng,
    });
  };
  changeRasterLoader = (lat, lng) => {
    // 60.732421875,80.67555881973475
    this.setState({
      loaderlatraster: lat,
      loaderlngraster: lng,
    });
  };
  formatgeojson(json) {
    var new_json = {
      type: "FeatureCollection",
      name: "Telangana_Distrcit",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: [json],
    };
    this.setState({
      selected_shape: new_json,
    });
  }
  // async getweatherData(geojson){
  //   var bodyParams = {
  //     geojson: geojson.sourceTarget.feature.geometry,
  //     startdate: "2021-01-01",
  //     enddate: "2022-01-20",
  //   };
  //   try {
  //     const res = await axiosConfig.post(`/getpoints`, bodyParams);
  //     console.log("RESPONSE COUNT", res.data[1].count);
  //     this.setState({
  //       areaValue: res.data[1].count,
  //       selectedRegion: geojson.sourceTarget.feature.properties.Dist_Name,
  //     });
  //     var area = geojsonArea.geometry(geojson.sourceTarget.feature.geometry);
  //     area = area / 1000000;
  //     this.setState({
  //       area: parseFloat(area).toFixed(2),
  //     });
  //     this.child.current.showDrawer();
  //     this.child.current.setPointsChart();
  //   } catch (err) {
  //     message.error("Failed to connect to server");
  //   }
  // }
  async getCountEvents(geojson) {
    var bodyParams = {
      geojson: geojson.sourceTarget.feature.geometry,
      startdate: "2021-01-01",
      enddate: "2022-01-20",
    };
    try {
      const res = await axiosConfig.post(`/getpoints`, bodyParams);
      this.setState({
        areaValue: res.data[1].count,
        selectedRegion: geojson.sourceTarget.feature.properties.Dist_Name,
      });
      var area = geojsonArea.geometry(geojson.sourceTarget.feature.geometry);
      area = area / 1000000;
      this.setState(
        {
          area: parseFloat(area).toFixed(2),
        },
        () => {
          this.child.current.showDrawer();
          this.child.current.setPointsChart();
        }
      );
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  getwarehouseDetails(geojson) {
    this.setState(
      {
        areaValue: geojson.capacity,
        selectedRegion: geojson.district,
      },
      () => {
        this.child.current.showDrawer();
      }
    );
  }
  openDrawer(e) {
    var selected_district = this.formatgeojson(e.sourceTarget.feature);
    if (this.props.CurrentLayer == "FIREEV") {
      this.getCountEvents(e);
    } else if (this.props.CurrentLayer == "WH") {
    } else if (this.props.CurrentLayer == "CP") {
      // this.CPchild.current.showDrawer();
    } else if (this.props.CurrentLayer == "WEATHER") {
      var area = geojsonArea.geometry(e.sourceTarget.feature.geometry);
      area = area / 1000000;
      this.setState({
        area: parseFloat(area).toFixed(2),
      });
      this.setState(
        {
          selectedRegion: e.sourceTarget.feature.properties.Dist_Name,
        },
        () => {
          this.child.current.showDrawer();
          this.child.current.getWeathertrend("6months");
        }
      );
    } else if (this.props.CurrentLayer == "LULC") {
      var area = geojsonArea.geometry(e.sourceTarget.feature.geometry);
      area = area / 1000000;
      this.setState({
        area: parseFloat(area).toFixed(2),
      });
      this.setState(
        {
          selectedRegion: e.sourceTarget.feature.properties.Dist_Name,
        },
        () => {
          this.child.current.showDrawer();
          this.child.current.getLULC();
        }
      );
    } else if (this.props.CurrentLayer == "POPULATION") {
      this.setState(
        {
          areaValue: parseFloat(
            e.sourceTarget.feature.properties.zonalstat.sum
          ).toFixed(2),
          minVal: parseFloat(
            e.sourceTarget.feature.properties.zonalstat.min
          ).toFixed(2),
          maxVal: parseFloat(
            e.sourceTarget.feature.properties.zonalstat.max
          ).toFixed(2),
          meanVal: parseFloat(
            e.sourceTarget.feature.properties.zonalstat.mean
          ).toFixed(2),
          selectedRegion: e.sourceTarget.feature.properties.Dist_Name,
        },
        () => {
          this.child.current.settimerange("6months");
        }
      );

      var area = geojsonArea.geometry(e.sourceTarget.feature.geometry);
      area = area / 1000000;
      this.setState({
        area: parseFloat(area).toFixed(2),
      });

      this.child.current.showDrawer();
    } else if (this.props.CurrentLayer == "RWI") {
      this.setState({
        areaValue: parseFloat(
          e.sourceTarget.feature.properties.zonalstat.mean
        ).toFixed(2),
        minVal: parseFloat(
          e.sourceTarget.feature.properties.zonalstat.min
        ).toFixed(2),
        maxVal: parseFloat(
          e.sourceTarget.feature.properties.zonalstat.max
        ).toFixed(2),
        selectedRegion: e.sourceTarget.feature.properties.Dist_Name,
      });

      var area = geojsonArea.geometry(e.sourceTarget.feature.geometry);
      area = area / 1000000;
      this.setState({
        area: parseFloat(area).toFixed(2),
      });

      this.child.current.showDrawer();
    } else {
      this.setState(
        {
          areaValue: parseFloat(
            e.sourceTarget.feature.properties.zonalstat.mean
          ).toFixed(2),
          minVal: parseFloat(
            e.sourceTarget.feature.properties.zonalstat.min
          ).toFixed(2),
          maxVal: parseFloat(
            e.sourceTarget.feature.properties.zonalstat.max
          ).toFixed(2),
          selectedRegion: e.sourceTarget.feature.properties.Dist_Name,
        },
        () => {
          this.child.current.settimerange("1Year");
        }
      );

      var area = geojsonArea.geometry(e.sourceTarget.feature.geometry);
      area = area / 1000000;
      this.setState({
        area: parseFloat(area).toFixed(2),
      });

      this.child.current.showDrawer();
    }
  }
  async getCustomPointDetails(geojson) {
    var bodyParams = {
      geojson: geojson.features[0].geometry,
      startdate: "2021-01-01",
      enddate: "2022-01-20",
    };
    try {
      const res = await axiosConfig.post(`/getpoints`, bodyParams);
      var area = geojsonArea.geometry(geojson.features[0].geometry);
      area = area / 1000000;
      this.setState(
        {
          areaValue: res.data[1].count,
          selectedRegion: "Custom",
          area: parseFloat(area).toFixed(2),
        },
        () => {
          this.child.current.setPointsChart();
          this.child.current.showDrawer();
        }
      );
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  async getCustomlayerDetails(geojson) {
    var last_updated_date = new Date(this.props.LayerDescription.last_updated);
    var from_dd = String(last_updated_date.getDate()).padStart(2, "0");
    var from_mm = String(last_updated_date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var from_yyyy = last_updated_date.getFullYear();
    var from_date = from_yyyy + "-" + from_mm + "-" + from_dd;
    var bodyParams = {
      geojson: geojson.features[0].geometry,
      date: from_date,
      parameter: this.props.CurrentLayer,
    };
    try {
      const res = await axiosConfig.post(`/getzstat?`, bodyParams);
      var area = geojsonArea.geometry(geojson.features[0].geometry);
      area = area / 1000000;
      this.setState(
        {
          areaValue: parseFloat(res.data.stat.mean).toFixed(2),
          minVal: parseFloat(res.data.stat.min).toFixed(2),
          maxVal: parseFloat(res.data.stat.max).toFixed(2),
          selectedRegion: "Custom",
          area: parseFloat(area).toFixed(2),
        },
        () => {
          this.child.current.gettrendchart();
          this.child.current.showDrawer();
        }
      );
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }

  openCustomDrawer(geojson) {
    this.setState({
      selected_shape: geojson,
    });
    if (this.props.CurrentLayer == "FIREEV") {
      this.getCustomPointDetails(geojson);
    }
    if (this.props.CurrentLayer == "LULC") {
      var area = geojsonArea.geometry(geojson.features[0].geometry);
      area = area / 1000000;

      if (area > 150) {
        message.info("Maximum query area reached!");
      } else {
        this.child.current.getCUSTOMLULC(geojson);
      }
    } else {
      this.getCustomlayerDetails(geojson);
    }
  }
  style(feature) {
    if (this.props.CurrentLayer == "WEATHER") {
      return {
        weight: 1,
        opacity: 1,
        fillOpacity: 0.41,
        fillColor: "#a5a8a8",
        color: "#d65522",
      };
    }
    if (ltype == "Vector") {
      if (this.state.layerUID == feature.properties.uid) {
        return {
          weight: 1,
          opacity: 1,
          color: "#2bf527",
          fillOpacity: 1,
          weight: 6,
        };
      } else {
        var scale;
        if (feature.properties.zonalstat.mean <= 1) {
          scale = chroma
            .scale(this.props.vectorColor)
            .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
        } else {
          scale = chroma
            .scale(this.props.vectorColor)
            .domain([0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]);
        }
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor: scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    } else {
      if (this.state.layerUID == feature.properties.uid) {
        return {
          weight: 1,
          opacity: 1,
          color: "#2bf527",
          fillOpacity: 0,
          weight: 6,
        };
      } else {
        // this.props.showRaster();
        return {
          color: "#d65522",
          weight: 0.5,
          fillOpacity: 0,
        };
      }
    }
  }
  toggleClass() {
    const currentState = this.state.activeSearch;
    this.setState({ activeSearch: !currentState });
    if (window.innerWidth <= 768) {
      this.resetmapzoommobile();
    } else {
      this.resetmapzoom();
    }
  }
  toggleDropdown() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  }
  onchangeshape(e) {
    if (e.target.value == "DISTRICT") {
      this.props.showRaster();
      this.props.setRegion("DISTRICT");
      this.map.removeLayer(this.state.editableFG);
      this.props.SetBoundary(DISTRICTBOUNDS);
      this.props.setMapKey();
      this.setState(
        {
          // currentBoundaryPattern: "DISTRICT",
          checked: false,
          regionList: districtRegions(),
          customStatus: false,
          regionkey: this.state.regionkey + 1,
          showlayertype: true,
          locpointerltlng: [60.732421875, 80.67555881973475],
          baseMap:
            "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
          attribution: "",
          baseMapselected: "Dark",
        },
        () => {
          this.getlayer();
        }
      );
    } else if (e.target.value == "MANDAL") {
      this.props.showRaster();
      this.map.removeLayer(this.state.editableFG);
      this.props.setRegion("MANDAL");
      this.props.setMapKey();
      this.props.SetBoundary(MANDALBOUNDS);
      this.setState(
        {
          // currentBoundaryPattern: "MANDAL",
          checked: false,
          regionList: mandalRegions(),
          locpointerltlng: [60.732421875, 80.67555881973475],
          customStatus: false,
          showlayertype: true,
          baseMap:
            "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
          attribution: "",
          baseMapselected: "Dark",
        },
        () => {
          this.getlayer();
        }
      );
    } else if (e.target.value == "CUSTOM") {
      this.props.setMapKey();
      this.props.setRegion("CUSTOM");
      this.setState({
        baseMap: "http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}",
        baseMapselected: "Satellite",
        // keyMAP: this.state.keyMAP + 1,
        attribution: "",
        checked: true,
        customStatus: true,
        showlayertype: false,
      });
      this.props.SetBoundary([]);
      // this.setState({
      //   pointVector: {
      //     type: "FeatureCollection",
      //     features: [
      //       {
      //         type: "Feature",
      //         geometry: {
      //           type: "Point",
      //           coordinates: [55.6761, 12.5683],
      //         },
      //         properties: {
      //           brightness: 330.5,
      //           scan: 1.16,
      //           track: 1.07,
      //           acq_date: "2021-11-02",
      //           acq_time: 801,
      //           satellite: "Aqua",
      //           instrument: "MODIS",
      //           confidence: 83,
      //           version: "6.1NRT",
      //           bright_t31: 296.07,
      //           frp: 25.58,
      //           daynight: "D",
      //           latitude: 12.5683,
      //           longitude: 55.6761,
      //         },
      //       },
      //     ],
      //   },
      // });
      if (this.props.LayerDescription.raster_status != false) {
        this.props.hideRaster();
      }
    }
  }
  onChangeLayertype(e) {
    this.setState(
      {
        layerType: e.target.value,
      },
      () => {
        ltype = e.target.value;
        // this.getlayer();
        if (ltype == "Raster") {
          this.props.setLayerType("Raster");
          this.props.showRaster();
          window.layerType="Raster";
        } else if (ltype == "Vector") {
          this.props.setLayerType("Vector");
          this.props.hideRaster();
          window.layerType="Vector";
        }
      }
    );
  }
  onMouseOut() {
    this.props.setvalue(0.0);
    this.props.setplace("");
  }
  async getlayer() {
    this.setState({
      baseMap:
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      attribution: "dark_matter_lite_rainbow",
      baseMapselected: "Dark",
    });
    if (this.props.CurrentRegion == "CUSTOM") {
      this.props.setRegion("DISTRICT");
      this.setState({
        regionkey: this.state.regionkey + 1,
        customStatus: false,
      });
    }

    this.changeVectorLoader(17.754639747121828, 79.05833831966801);
    if (this.props.CurrentLayer == "FIREEV") {
      this.setState({
        pointData: true,
      });
      // this.props.SetBoundary({})
      // dispatch({ type: "SETCURRENTVECTOR", payload: {} })
      var bodyParams = {
        startdate: "2021-01-01",
        enddate: "2022-01-20",
      };
      try {
        const res = await axiosConfig.post(
          `/getpointsindaterange?`,
          bodyParams
        );
        // this.props.SetBoundary(res.data);
        this.setState({
          pointVector: res.data,
        });
        this.props.setMapKey();
        this.changeVectorLoader(60.732421875, 80.67555881973475);
        this.changeRasterLoader(60.732421875, 80.67555881973475);
      } catch (err) {
        message.error("Failed to connect to server");
      }
    } else if (this.props.CurrentLayer == "WH") {
      this.setState({
        pointData: true,
      });
      try {
        const res = await axiosConfig.get(`/warehouses`);
        this.setState(
          {
            pointVector: res.data.data,
          },
          () => {}
        );
        this.props.setMapKey();
        this.changeVectorLoader(60.732421875, 80.67555881973475);
        this.changeRasterLoader(60.732421875, 80.67555881973475);
      } catch (err) {
        message.error("Failed to connect to server");
      }
    } else if (this.props.CurrentLayer == "CP") {
      this.setState({
        pointData: true,
      });
      try {
        const res = await axiosConfig.get(`/getmarketyard`);
        this.setState({
          pointVector: res.data.data,
        });
        this.props.setMapKey();
        this.changeVectorLoader(60.732421875, 80.67555881973475);
        this.changeRasterLoader(60.732421875, 80.67555881973475);
      } catch (err) {
        message.error("Failed to connect to server");
      }
    } else if (this.props.CurrentLayer == "WEATHER") {
      this.props.SetBoundary(MANDALBOUNDS);
      this.props.setMapKey();
      this.changeVectorLoader(60.732421875, 80.67555881973475);
      this.changeRasterLoader(60.732421875, 80.67555881973475);
      this.setState({
        pointVector: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [55.6761, 12.5683],
              },
              properties: {
                brightness: 330.5,
                scan: 1.16,
                track: 1.07,
                acq_date: "2021-11-02",
                acq_time: 801,
                satellite: "Aqua",
                instrument: "MODIS",
                confidence: 83,
                version: "6.1NRT",
                bright_t31: 296.07,
                frp: 25.58,
                daynight: "D",
                latitude: 12.5683,
                longitude: 55.6761,
              },
            },
          ],
        },
      });
    } else if (this.props.CurrentLayer == "LULC") {
      if (this.props.CurrentRegion == "MANDAL") {
        this.props.SetBoundary(MANDALBOUNDS);
      }
      this.setState({
        pointVector: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [55.6761, 12.5683],
              },
              properties: {
                brightness: 330.5,
                scan: 1.16,
                track: 1.07,
                acq_date: "2021-11-02",
                acq_time: 801,
                satellite: "Aqua",
                instrument: "MODIS",
                confidence: 83,
                version: "6.1NRT",
                bright_t31: 296.07,
                frp: 25.58,
                daynight: "D",
                latitude: 12.5683,
                longitude: 55.6761,
              },
            },
          ],
        },
      });
      this.props.setMapKey();
      this.changeVectorLoader(60.732421875, 80.67555881973475);
      this.changeRasterLoader(60.732421875, 80.67555881973475);
    } else {
      this.setState({
        pointVector: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [55.6761, 12.5683],
              },
              properties: {
                brightness: 330.5,
                scan: 1.16,
                track: 1.07,
                acq_date: "2021-11-02",
                acq_time: 801,
                satellite: "Aqua",
                instrument: "MODIS",
                confidence: 83,
                version: "6.1NRT",
                bright_t31: 296.07,
                frp: 25.58,
                daynight: "D",
                latitude: 12.5683,
                longitude: 55.6761,
              },
            },
          ],
        },
      });
      try {
        const res = await axiosConfig.get(
          `/currentvector?parameter=` +
            this.props.CurrentLayer +
            `&admbound=` +
            this.props.CurrentRegion
        );
        this.props.SetBoundary(res.data.data);
        this.props.setMapKey();
        this.changeVectorLoader(60.732421875, 80.67555881973475);
      } catch (err) {
        message.error("Failed to connect to server");
      }
    }
    // this.props.VectorLoader();
    // this.checkLoaderstatus();
  }
  onMouseOver(e) {
    if (this.props.CurrentLayer == "POPULATION") {
      this.props.setvalue(
        parseFloat(e.layer.feature.properties.zonalstat.sum / 1000000).toFixed(
          2
        )
      );
    } else if (this.props.CurrentLayer != "LULC") {
      if (e.layer.feature.properties.zonalstat != undefined) {
        if (isNaN(e.layer.feature.properties.zonalstat.mean) == true) {
          this.props.setvalue("N/A");
        } else {
          // console.log("VECTOR HOVER VALUE",e.layer.feature.properties.zonalstat.mean)
          this.props.setvalue(
            parseFloat(e.layer.feature.properties.zonalstat.mean).toFixed(2)
          );
        }
      }
    }

    if (this.props.CurrentRegion == "MANDAL") {
      var mandal_name = e.layer.feature.properties.Mandal_Nam;
      if (typeof mandal_name !== "undefined") {
        this.props.setplace(mandal_name);
      } else {
        this.props.setplace("");
      }
    } else if (this.props.CurrentRegion == "DISTRICT") {
      var district_name = e.layer.feature.properties.Dist_Name;
      if (typeof district_name !== "undefined") {
        this.props.setplace(district_name);
      } else {
        this.props.setplace("");
      }
    }
  }
  searchRegion(e) {
    var selected_region = this.state.regionList[e];
    var current_reg = this.props.CurrentVector.features[e];
    this.setState(
      {
        latnew: selected_region.centerPoint[1],
        longnew: selected_region.centerPoint[0],
        mapZoom: 9,
        layerUID: selected_region.uid,
      },
      () => {
        if (this.props.CurrentRegion == "MANDAL") {
          var mandal_name = current_reg.properties.Mandal_Name;
          if (typeof mandal_name !== "undefined") {
            this.props.setplace(mandal_name);
            this.props.setvalue(
              parseFloat(current_reg.properties.zonalstat.mean).toFixed(2)
            );
          } else {
            this.props.setplace("");
            this.props.setvalue(0);
          }
        } else if (this.props.CurrentRegion == "DISTRICT") {
          var district_name = current_reg.properties.Dist_Name;
          if (typeof district_name !== "undefined") {
            this.props.setplace(current_reg.properties.Dist_Name);
            this.props.setvalue(
              parseFloat(current_reg.properties.zonalstat.mean).toFixed(2)
            );
          } else {
            this.props.setplace("");
            this.props.setvalue(0);
          }
        }
      }
    );
  }
  updateDimensions = () => {
    if (window.innerWidth <= 480) {
      console.log("mobile");
      this.setState({
        mapZoom: 6.5,
      });
    } else {
      console.log("desktop");
      this.setState({
        mapZoom: 7.5,
      });
    }
  };

  componentDidMount() {
    this.updateDimensions();
    this.props.setvalue(0.74);
    this.props.setplace("Siddipet");
    this.changeVectorLoader(17.754639747121828, 79.05833831966801);
    this.changeRasterLoader(17.754639747121828, 79.05833831966801);
    // const leafletMap = this.leafletMap.leafletElement;
    this.getlayer();
    this.map = this.mapInstance.leafletElement;
  }
  resetmapzoom() {
    this.map.flyTo([18.1124, 79.0193], 7.5);
  }
  resetmapzoommobile() {
    this.map.flyTo([18.1124, 79.0193], 6.5);
  }
  ChangeBasemap(e) {
    if (e.target.value == "Dark") {
      this.setState({
        baseMap:
          "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        attribution: "",
        baseMapselected: "Dark",
      });
    }
    if (e.target.value == "Satellite") {
      this.setState({
        baseMap: "http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}",
        attribution: "",
        baseMapselected: "Satellite",
      });
    }
    if (e.target.value == "Grey") {
      this.setState({
        baseMap:
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
        baseMapselected: "Grey",
      });
    }
  }
  Customlayer(e) {
    e.layer.on("click", () => {
      // editRef.current.leafletElement._toolbars.edit._modes.edit.handler.enable()
      this.child.current.showDrawer();
    });
    if (this.state.editableFG == []) {
      this.setState({
        editableFG: e.layer,
      });
    } else {
      this.map.removeLayer(this.state.editableFG);
      this.setState({
        editableFG: e.layer,
      });
    }
    const shapePoints = e.layer._latlngs;
    var newpoints = [];
    shapePoints[0].map(function (points, index) {
      newpoints.push([points.lng, points.lat]);
    });
    // console.log("COORDINATES", e.layer);
    newpoints.push([shapePoints[0][0].lng, shapePoints[0][0].lat]);
    var polygon_point = polygon([newpoints]);
    var polygon_centroid = centroid(polygon_point);
    this.setState(
      {
        customShape: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                centroid: polygon_centroid.geometry.coordinates,
              },
              geometry: {
                type: "Polygon",
                coordinates: [newpoints],
              },
            },
          ],
        },
      },
      () => {
        this.openCustomDrawer(this.state.customShape);
      }
    );
  }
  getcustomlocation(lat, lon) {
    if (lat != undefined && lon != undefined) {
      // this.setState({
      //   locpointerltlng: [e.coordinates.lat, e.coordinates.lng],
      // });
      if (lat != undefined && lon != undefined) {
        this.setState({
          locpointerltlng: [lat, lon],
          mapZoom: 9,
          latnew: lat,
          longnew: lon,
        });
      }
    }
  }
  toggleLayer(e) {
    if (e.target.value == "show") {
      this.props.showRaster();
    } else {
      this.props.hideRaster();
    }
  }
  handlePointclick(name) {
    // e.preventDefault();
    // this.setState({
    //   currentComodity:name
    // })
    if (this.props.CurrentLayer == "CP") {
      this.CPchild.current.showDrawer(name);
    }
  }
  checkRadius(capacity) {
    var radius = 3000 * Math.log(capacity / 100);

    if (radius > 0) {
      //   this.setState({
      //     keyMAP: this.state.keyMAP + 1,
      //  })
      return 20 * Math.log(parseInt(radius) / 10000000);
    } else {
      return 5000;
    }
  }

  checkIcon() {
    if (this.props.CurrentLayer == "FIREEV") {
      return MarkerIcon;
    } else {
      return MarkerIcon2;
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="header">
          <Header />
        </div>
        <Sidebar
          changeCurrentLayer={this.getlayer}
          resetZoom={this.resetmapzoom}
          resetZoommobile={this.resetmapzoommobile}
        />
        <div className="legend-mobile">
          <LegendMobile />
        </div>
        <BottomNav
          className="bottom-navigation"
          changeCurrentLayer={this.getlayer}
          resetZoom={this.resetmapzoommobile}
        />
        <div
          className="btn-home"
          style={{ zIndex: "999" }}
          onClick={this.resetmapzoom}
        >
          <BiHomeAlt />
        </div>
        <div
          className="btn-home-mobile"
          style={{ zIndex: "999" }}
          onClick={this.resetmapzoommobile}
        >
          <BiHomeAlt />
        </div>
        {/* <div
          className="Layer-remove"
          style={this.state.customStatus == true ? {} : { display: "none" }}
        >
          <Switch size="small"  onChange={(e) => this.toggleLayer(e)}/>
        </div> */}

        <div
          className="btn-toggleBaseMap"
          // style={this.state.customStatus == true ? {} : { display: "none" }}
        >
          <FormGroup>
            <Input
              type="select"
              name="select"
              style={{
                backgroundColor: "#282929",
                color: "#fff",
                border: "none",
                height: "43px",
              }}
              value={this.state.baseMapselected}
              onChange={this.ChangeBasemap}
            >
              <option
                // selected={this.state.baseMapselected == "Dark" ? true : false}
                value="Dark"
              >
                Dark
              </option>
              <option
                // selected={
                //   this.state.baseMapselected == "Satellite" ? true : false
                // }
                value="Satellite"
              >
                Satellite
              </option>
              <option
                // selected={this.state.baseMapselected == "Grey" ? true : false}
                value="Grey"
              >
                Grey
              </option>
            </Input>
          </FormGroup>
        </div>
        <div
          className="btn-toggle"
          // style={this.state.showlayertype == true ? {} : { display: "none" }}
        >
          <Radio.Group
            options={options}
            onChange={this.onChangeLayertype}
            value={this.state.layerType}
            optionType="button"
            buttonStyle="solid"
            disabled={this.state.showlayertype ? false : true}
            disabled={
              this.props.LayerDescription.vector_status == false
                ? true
                : false || this.props.LayerDescription.raster_status == false
                ? true
                : false
            }
          />
        </div>
        <div
          className={
            this.state.activeSearch ? "selection" : "selection-collapsed"
          }
        >
          <FormGroup
            style={
              this.state.layerType == "Vector" ? { cursor: "not-allowed" } : {}
            }
          >
            <Input
              type="select"
              name="select"
              style={{
                backgroundColor: "#282929",
                color: "#fff",
                border: "none",
                height: "44px",
              }}
              disabled={
                this.props.CurrentLayer == "WEATHER"
                  ? true
                  : false || this.state.layerType == "Vector"
                  ? true
                  : false
              }
              // defaultChecked={this.props.CurrentLayer == "WEATHER" ?"mandal":"district"}
              // defaultValue={this.props.CurrentLayer == "WEATHER" ?"mandal":"district"}
              // style={}
              key={this.state.regionkey}
              value={this.props.CurrentRegion}
              onChange={(e) => this.onchangeshape(e)}
            >
              <option value="DISTRICT">District</option>
              <option value="MANDAL">Mandal</option>
              <option
                value="CUSTOM"
                disabled={
                  this.props.LayerDescription.showcustom == false ? true : false
                }
              >
                Custom
              </option>
              {/* <option value="opacity">opacity</option> */}
            </Input>
          </FormGroup>
        </div>

        <div
          className={
            this.state.activeSearch ? "search-card" : "search-card-collapsed"
          }
        >
          <div className="row" style={{ padding: "0px" }}>
            <div className="col search" style={{ paddingLeft: "0px" }}>
              <div
                style={
                  this.state.customStatus == true ? { display: "none" } : {}
                }
              >
                <Select
                  className="search-input"
                  showSearch
                  style={{ width: 230 }}
                  placeholder="Search Region"
                  optionFilterProp="children"
                  onChange={this.searchRegion}
                >
                  {this.state.regionList.length > 0 &&
                    this.state.regionList.map((item, index) => (
                      <option
                        className="search-list"
                        value={index}
                        // key={item.centerPoint}
                        // attr={item.uid}
                      >
                        {item.dname}
                      </option>
                    ))}
                </Select>
              </div>
              <div
                style={
                  this.state.customStatus == true ? {} : { display: "none" }
                }
              >
                <div style={{ marginLeft: "50px", marginTop: "7px" }}>
                  <SearchPlace searchArea={this.getcustomlocation} />
                </div>
              </div>
            </div>

            <div className="col" style={{ padding: "0px" }}>
              {this.state.activeSearch ? (
                <BiSearch className="search-icon" onClick={this.toggleClass} />
              ) : (
                <BiX className="search-close" onClick={this.toggleClass} />
              )}
            </div>
          </div>
        </div>
        {this.props.CurrentLayer == "CP" ? (
          <CPDrawerModal
            // onRef={(ref) => (this.CPchild = ref)}
            ref={this.CPchild}
            district={this.state}
          />
        ) : (
          <DrawerModal ref={this.child} district={this.state} />
        )}
        {/* <DrawerModal ref={this.child} district={this.state} /> */}
        <div className="footer-links">
          <Footer />
        </div>
        <Map
          ref={(e) => {
            this.mapInstance = e;
          }}
          className="map"
          style={MAP_STYLES}
          viewport={this.state.RGBViewPort}
          maxZoom={18}
          minZoom={6}
          zoomSnap={0.25}
          zoomDelta={0.25}
          zoom={this.state.mapZoom}
          center={[this.state.latnew, this.state.longnew]}
          zoomControl={false}
          // maxBounds={bound}
        >
          <Marker
            position={[this.state.loaderlatvector, this.state.loaderlngvector]}
            icon={LoaderIcon}
          ></Marker>
          <Marker position={this.state.locpointerltlng} icon={LocIcon} />
          <Marker
            position={[this.state.loaderlatraster, this.state.loaderlngraster]}
            icon={LoaderIcon}
          ></Marker>
          {/* <div style={this.state.pointData == true ? { display: "none" } : {}}> */}
          {/* {this.state.pointVector.features.map((point, key) => (
            <CircleMarker
              center={[point.properties.latitude, point.properties.longitude]}
              radius={4}
              fillOpacity={1}
              fillColor={"#d10a25"}
              stroke={false}
            >
              <Tooltip>hkh</Tooltip>
            </CircleMarker>
          ))} */}
          <GeoJSON
            style={this.style}
            data={this.props.CurrentVector.features}
            // onEachFeature={this.onEachrua}
            onMouseOver={
              this.props.currentLayerType == "Vector"
                ? this.onMouseOver
                :console.log()
              // this.onMouseOver
            }
            // onMouseOver={
            //   this.props.CurrentLayer == "WEATHER"
            //     ? console.log("WEATHER")
            //     : this.onMouseOver
            // }
            onMouseOut={
              this.props.currentLayerType == "Vector"
                ? this.onMouseOver
                : console.log()
              // this.onMouseOver
            }
            icon={"text"}
            onclick={this.openDrawer}
            key={this.props.MapKey}
            zIndex={999}
          />

          {this.state.pointVector.features.map((point, key) => (
            <Marker
              position={[point.properties.latitude, point.properties.longitude]}
              radius={4}
              fillOpacity={1}
              fillColor={"#d10a25"}
              stroke={false}
              icon={MarkerIcon2}
              // icon={this.checkIcon}

              direction="top"
              onClick={(e) => {
                {
                  this.handlePointclick(point.properties.name);
                }
              }}
            >
              {this.props.CurrentLayer == "FIREEV" ? (
                <Tooltip
                  style={
                    this.props.CurrentLayer == "FIREEV"
                      ? {}
                      : { display: "none" }
                  }
                >
                  <a>
                    FRP : {point.properties.frp}
                    <br />
                    Date : {point.properties.acq_date}
                  </a>
                </Tooltip>
              ) : (
                <Tooltip
                  style={
                    this.props.CurrentLayer == "WH"
                      ? {}
                      : { display: "none" } &&
                        this.props.CurrentLayer == "FIREEV"
                      ? { display: "none" }
                      : {}
                  }
                >
                  <a
                    style={
                      this.props.CurrentLayer == "CP"
                        ? { display: "none" }
                        : { textAlign: "left" }
                    }
                  >
                    Capacity : {point.properties.capacity} MT
                    <br />
                    Warehouse Name : {point.properties.warehouse}
                    <br />
                    District : {point.properties.district}
                  </a>
                  <a
                    style={
                      this.props.CurrentLayer == "CP" ? {} : { display: "none" }
                    }
                  >
                    Market Yard : {point.properties.name}
                  </a>
                </Tooltip>
              )}
            </Marker>
          ))}

          {/* <div name="georaster" className="georaster-layer"> */}
          <GeoRaster
            onRef={(ref) => (this.rasterChild = ref)}
            changeLoader={this.changeRasterLoader}
          />
          {/* </div> */}

          <ZoomControl position="topright" className="btn-zoomcontrol" />
          <TileLayer
            url={this.state.baseMap}
            attribution={this.state.attribution}
          />
          <LayersControl position="topright">
            {/* <BaseLayer checked name='Basemap'> */}
            {/* <TileLayer url={this.state.baseMap}/> */}
            {/* <GoogleLayer 
            googlekey={key}
             maptype={sat} />
          </BaseLayer> */}
            {/* <BaseLayer checked name="Google Maps Satellite">
            <GoogleLayer 
            googlekey={key}
             maptype={sat} />
          </BaseLayer> */}
          </LayersControl>
          <div style={{ zIndex: -999 }}>
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={this.Customlayer}
                style={{ marginBottom: "179px" }}
                // eventHandlers={{s
                //   onClick: () => {
                //     console.log("ONCLICK CUSTOM");
                //   },
                // }}
                draw={{
                  rectangle: this.state.customStatus,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                  polygon: this.state.customStatus,
                }}
                edit={{
                  edit: false,
                  remove: this.state.customStatus,
                }}
              />
            </FeatureGroup>
          </div>
          {/* </Map> */}
        </Map>
      </React.Fragment>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(map);
