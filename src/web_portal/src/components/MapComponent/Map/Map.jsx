import React from "react";
import {
  Map,
  TileLayer,
  ZoomControl,
  FeatureGroup,
  Marker,
  GeoJSON,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Common/Header.css";
import Home from "../../../assets/images/home.png";
import Undp from "../../../assets/images/undp-logo-blue.svg";
import "./Map.css";
import chroma from "chroma-js";
import DrawerComp from "./Drawer/Drawer";
import {
  FormGroup,
  Input,
  Col,
  Row,
} from "reactstrap";
import { Radio, message } from "antd";
import { EditControl } from "react-leaflet-draw";
import MSCogRaster from "./MSCogRaster";
import {
  getlatestdate,
  getlayers,
  getpixel
} from "../../../assets/api/apiService";
import axios from "axios";
import L from "leaflet";
import { connect } from "react-redux";
import Config from "../Config/config";
import { centroid, polygon } from "@turf/turf";
import locIcon from "../../../assets/images/locationICON.png";
import mandalRegions from "./Regions/mandalRegions";
import districtRegions from "./Regions/districtRegions";
import Sidebar from "../Common/Sidebar";
import { Select } from "antd";
import SearchPlace from "./searchPlaces";
import Loader from "../../../assets/images/loader.gif";
import BottomNav from "../Common/BottomNav/BottomNav";
import { AiFillCloseCircle } from "react-icons/ai";
import MK from "../../../assets/images/locationMK.png";
import Nabard from "../../../assets/images/partners/nabard.png"
import India from "./Shapes/India_State.json"

let ltype = "Raster";
const label_options = [
  { label: "Raster", value: "Raster" },
  { label: "Vector", value: "Vector" },
];
const LoaderIcon = new L.Icon({
  iconUrl: Loader,
  iconSize: [150, 150],
});
const MAP_STYLES = {
  position: "relative",
  width: "100%",
  height: "100vh",
};
const LocIcon = new L.Icon({
  iconUrl: locIcon,
  iconSize: [50, 50],
});
const MarkerIcon = new L.Icon({
  iconUrl: MK,
  iconSize: [20, 20],
});
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
    DevcfvectorColor: ReduxProps.SetDevCFColor,
    DevvectorColor: ReduxProps.SetDevColor,
    currentLayerType: ReduxProps.CurrentLayerType,
    rasterUrl: ReduxProps.RasterLayerUrl,
    LoaderRaster: ReduxProps.loaderraster,
    customstatus: ReduxProps.customstatus,
    currentbasemapurl: ReduxProps.currentbasemapurl,
    currentbasemaptype: ReduxProps.currentbasemaptype,
    showlayertype: ReduxProps.showlayertype,
    LatLon: ReduxProps.markerLatLon,
    pixelvalue: ReduxProps.pixelvalue,
    checkIsShapeSelected: ReduxProps.checkIsShapeSelected,
    removeMarker: ReduxProps.markerLatLon,
    showDrawer: ReduxProps.ShowDrawer,
    currentLType: ReduxProps.CurrentLayerType
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVectorColor: (col) => dispatch({ type: "SETCOLOR_SCALE", payload: col }),
    setDevcfvectorColor: (col) =>
      dispatch({ type: "SETDEVCFCOLOR_SCALE", payload: col }),
    setLayerDesc: (details) =>
      dispatch({ type: "CHANGELAYERDESC", payload: details }),
    setDevvectorColor: (col) =>
      dispatch({ type: "SETDEVCOLOR_SCALE", payload: col }),
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
    setrasterlayerurl: (rasterurl) =>
      dispatch({
        type: "SETRASTERLAYERURL",
        payload: rasterurl,
      }),
    setDate: (currentdate) =>
      dispatch({ type: "SETCURRENTDATE", payload: currentdate }),
    setlatlon: (lat, lon) =>
      dispatch({
        type: "SETLATLON",
        payload: [parseFloat(lon).toFixed(2), ",", parseFloat(lat).toFixed(2)],
      }),
    setrasterlatlon: (pos) =>
      dispatch({
        type: "SETRASLATLON",
        payload: pos,
      }),
    setcustomstatus: (customstatus) =>
      dispatch({ type: "SETCUSTOMSTATUS", payload: customstatus }),
    currentBasemap: (currentbasemapurl) =>
      dispatch({ type: "SETCURRRENTBASEMAP", payload: currentbasemapurl }),
    currentBasemapType: (currentbasemaptype) =>
      dispatch({ type: "SETCURRRENTBASEMAPTYPE", payload: currentbasemaptype }),
    showLayerType: (showlayertype) =>
      dispatch({ type: "SHOWLAYERTYPE", payload: showlayertype }),
    isShapeSelected: (checkIsShapeSelected) =>
      dispatch({ type: "CHECKISSHAPESELECTED", payload: checkIsShapeSelected }),
    setLulcTable: (lulc) => dispatch({ type: "SETLULCTABLE", payload: lulc }),
    removeMarker: (marker) =>
      dispatch({ type: "REMOVE_MARKER", payload: marker }),
    setmarkerlatlng: (latlng) =>
      dispatch({ type: "ADD_MARKER", payload: latlng }),
    showDrawer: (val) => dispatch({ type: "SHOWDRAWER", payload: val }),
    setPixelValue: (results) =>
    dispatch({ type: 'SETPIXELVALUE', payload: results })
  };
};

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.childComponentRef = React.createRef();
    this.state = {
      mapkey: 1,
      latnew: Config.latnew,
      longnew: Config.longnew,
      loaderlatvector: Config.loaderlatvector,
      loaderlngvector: Config.loaderlngvector,
      loaderlatraster: Config.loaderlatraster,
      loaderlngraster: Config.loaderlngraster,
      mapZoom: 7.5,
      currentZoom: 7.5,
      attribution: "",
      visible: false,
      currentbounds: "DISTRICT",
      MapKey: 1,
      layerid: 1,
      updatedDate: "",
      rasterurl: "",
      vectorurl: "",
      area: "",
      distname: "",
      meanvalue: "",
      maxvalue: "",
      locpointerltlng: Config.locpointerltlng,
      minvalue: "",
      popsum: "",
      zonalstat: {},
      layerType: "Raster",
      showMarker: true,
      checked: false,
      centroid: [],
      loader: false,
      minMean: null,
      maxMean: null,
      current_Details: [],
      CurrentVector: districtRegions,
      regionList: districtRegions(),
      editableFG: [],
      mobile: false,
      percentage: [],
      loaderpercentage: true,
      selectedLULCcategory: "Water",
      LULCtrend: [],
      currentCharttime: "6mon",
      customLULC: [],
      LULCclasses: [],
      currentLatlon: [0, 0],
      pixelloader: true,
      india_boundary: India,
      customShape: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              centroid: [78.46696611965449, 17.39599799813276],
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [78.51557767600008, 17.377312621000044],
                  [78.51621877000008, 17.383323575000077],
                ],
              ],
            },
          },
        ],
      },
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
      from_date: "2021-06-10",
      to_date: "2021-12-12",
      selectedWeatherparams: "max_temp",
      last_updated: "",
      weatherValue: 0.0,
      shapeSelected: false,
    };
    this.searchRegion = this.searchRegion.bind(this);
    this.getcustomlocation = this.getcustomlocation.bind(this);
    this.resetmapzoom = this.resetmapzoom.bind(this);
    this.onchangeshape = this.onchangeshape.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.getcurrentRaster = this.getcurrentRaster.bind(this);
    this.getvector = this.getvector.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onChangeLayertype = this.onChangeLayertype.bind(this);
    this.Customlayer = this.Customlayer.bind(this);
    this.style = this.style.bind(this);
    this.boundaryStyle = this.boundaryStyle.bind(this);
    this.resetmapzoommobile = this.resetmapzoommobile.bind(this);
    this.closeSearchRegion = this.closeSearchRegion.bind(this);
    this.getPixelValue = this.getPixelValue.bind(this);
  }

  resetmapzoom = () => {
    const map = this.mapInstance.leafletElement;
    map.flyTo([Config.latnew, Config.longnew], 7.5);
  };
  resetmapzoommobile() {
    const map = this.mapInstance.leafletElement;
    map.flyTo([Config.latnew, Config.longnew], 6.5);
  }
  handleZoomEnd = () => {
    // Update the state with the current zoom level when the user manually zooms
    this.setState({ mapZoom: this.mapInstance.leafletElement.getZoom() });
  };
  toggleClass() {
    if (window.innerWidth <= 768) {
      this.resetmapzoommobile();
    } else {
      this.resetmapzoom();
    }
  }
  changeVectorLoader = (lat, lng) => {
    this.setState({
      loaderlatvector: lat,
      loaderlngvector: lng,
    });
  };
  changeRasterLoader = (lat, lng) => {
    this.setState({
      loaderlatraster: lat,
      loaderlngraster: lng,
    });
  };

  showDrawer = (data) => {
    // console.log("eeee", data)
    this.childComponentRef.current.handleDrawerClick(data);
    this.props.showDrawer(true);
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
    this.props.removeMarker([0, 0]);
  };
  ChangeBasemap = (val) => {
    /*
       There are multiple basemaps provided here.User can change map styles.
       Note that only one options can be used at a time.Just uncomment wanted option and you are
       good to go!.
        */
      if (val.target.value === "Satellite") {
        /*
        Option 1 - Google Maps 
        */
        this.props.currentBasemap(
          "http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}"
        );
        this.props.currentBasemapType("Satellite");
        this.setState({
          attribution: "",
        });
         /*
        Option 2 - OSM Layer with base style  (NOT SATELLITE THEME)
        */
        // this.props.currentBasemap(
        //  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" );
        //  this.props.currentBasemapType("Dark");
        //  this.setState({
        //      attribution: "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors",
        // });
  
        /*
        Option 3 - Esri Maps 
        */
        // this.props.currentBasemap(
        //     "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" );
        //      this.props.currentBasemapType("Satellite");
        //  this.setState({
        //   attribution:
        //     "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        //  });
        /*
        Option 4 - USGS Imagery 
        */
        // this.props.currentBasemap(
        //     "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}" );
        // this.props.currentBasemapType("Satellite");
        // this.setState({
        //   attribution:
        //     'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
        // });
      } else if (val.target.value === "Grey") {
        /*
        Option 1 - ARCGIS Imagery Grey 
        */
        this.props.currentBasemap(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        );
        this.props.currentBasemapType("Grey");
        this.setState({
          attribution:
            '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>',
        });
        /*
        Option 2 - OSM Layer with base style  (NOT GREY THEME)
        */
        // this.props.currentBasemap(
        //     "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        // this.props.currentBasemapType("Dark");
        // this.setState({
        //   attribution: "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors",
        // });
        /*
        Option 3 - Stadia maps Grey 
        */
        // this.props.currentBasemap(
        //     "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png");
        //   this.props.currentBasemapType("Grey");
        //   this.setState({
        //     '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        // });
      } else if (val.target.value === "Dark") {
         /*
        Option 1 - Carto CDN Dark 
        */
        this.props.currentBasemap(
          "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        );
        this.props.currentBasemapType("Dark");
        this.setState({
          attribution: "",
        });
         /*
        Option 2 - OSM Layer with base style (NOT DARK THEME)
        */
        // this.props.currentBasemap(
        //   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        //  this.props.currentBasemapType("Dark");
        //  this.setState({
        //  attribution: "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors",
        // });
        /*
        Option 3 - StadiaMaps Dark 
        */
        // this.props.currentBasemap(
        //     "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png")
        //  this.props.currentBasemapType("Dark");
        //  this.setState({
        //   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        // });
      }
    };
  onMouseOut() {
    this.props.setplace("");
  }
  onMouseOver(e) {
    this.props.setlatlon(e.latlng.lat, e.latlng.lng);
    if(this.props.CurrentRegion === "MANDAL" ){
      var mandal_name = e.layer.feature.properties.mandal_name;
      this.props.setplace(mandal_name);

    }else if (this.props.CurrentRegion === "DISTRICT" ){
      var district_name = e.layer.feature.properties.district_name;
      this.props.setplace(district_name);
    }
    // console.log("hover", e.layer.feature.properties["DPPD score"])
    if (e.layer.feature.properties.zonalstat !== undefined && this.props.currentLayerType === "Vector") {
      if (isNaN(e.layer.feature.properties.zonalstat.mean) === true) {
        this.props.setvalue("N/A");
      } else {
        if (this.props.CurrentLayer === "NO2") {
          localStorage.setItem(
            "valnow",
            parseFloat(e.layer.feature.properties.zonalstat.mean).toFixed(6)
          );
          var valuenow = parseFloat(
            e.layer.feature.properties.zonalstat.mean
          ).toFixed(6);
          this.props.setvalue(valuenow);
        }else  if (this.props.CurrentLayer === "Total Precipitation - Monthly") {
          localStorage.setItem(
            "valnow",
            parseFloat(e.layer.feature.properties.zonalstat.mean).toFixed(6)
          );
          var valuenow = parseFloat(
            e.layer.feature.properties.zonalstat.mean
          ).toFixed(6);
          this.props.setvalue(valuenow);
        }else
        if (this.props.CurrentLayer === 'POPULATION') {
          localStorage.setItem(
            'valnow',
            Math.floor(e.layer.feature.properties.zonalstat.sum )
          );
          var valuenow = Math.floor(
            e.layer.feature.properties.zonalstat.sum 
          );
          this.props.setvalue(valuenow);
        } else {
          localStorage.setItem(
            "valnow",
            parseFloat(e.layer.feature.properties.zonalstat.mean).toFixed(2)
          );
          var valuenow = parseFloat(
            e.layer.feature.properties.zonalstat.mean
          ).toFixed(2);
          this.props.setvalue(valuenow);
        }
      }
    } else if(this.props.currentLayerType === "Vector"){
      if (this.props.CurrentLayer === "NDVI_DPPD") {
        localStorage.setItem(
          "valnow",
          parseFloat(e.layer.feature.properties["DPPD score"]).toFixed(2)
        );
        var valuenow = parseFloat(
          e.layer.feature.properties["DPPD score"]
        ).toFixed(5);
        this.props.setvalue(valuenow);
      } else if (this.props.CurrentLayer === "LAI_DPPD") {
        localStorage.setItem(
          "valnow",
          parseFloat(e.layer.feature.properties["DPPD score"]).toFixed(2)
        );
        var valuenow = parseFloat(
          e.layer.feature.properties["DPPD score"]
        ).toFixed(5);
        this.props.setvalue(valuenow);
      } else if (this.props.CurrentLayer === "LST_DPPD") {
        localStorage.setItem(
          "valnow",
          parseFloat(e.layer.feature.properties["DPPD score"]).toFixed(2)
        );
        var valuenow = parseFloat(
          e.layer.feature.properties["DPPD score"]
        ).toFixed(5);
        this.props.setvalue(valuenow);
      } else if (this.props.CurrentLayer === "NDWI_DPPD") {
        localStorage.setItem(
          "valnow",
          parseFloat(e.layer.feature.properties["DPPD score"]).toFixed(2)
        );
        var valuenow = parseFloat(
          e.layer.feature.properties["DPPD score"]
        ).toFixed(5);
        this.props.setvalue(valuenow);
      } else if (this.props.CurrentLayer === "NO2_DPPD") {
        localStorage.setItem(
          "valnow",
          parseFloat(e.layer.feature.properties["Slope Score"]).toFixed(2)
        );
        var valuenow = parseFloat(
          e.layer.feature.properties["Slope Score"]
        ).toFixed(5);
        this.props.setvalue(valuenow);
      } else if (this.props.CurrentLayer === "PM25_DPPD") {
        localStorage.setItem(
          "valnow",
          parseFloat(e.layer.feature.properties["Slope Score"]).toFixed(2)
        );
        var valuenow = parseFloat(
          e.layer.feature.properties["Slope Score"]
        ).toFixed(5);
        this.props.setvalue(valuenow);
      }
      else if (this.props.CurrentLayer === "DPPD") {
        localStorage.setItem(
          "valnow",
          parseFloat(e.layer.feature.properties["Slope Score"]).toFixed(2)
        );
        var valuenow = parseFloat(
          e.layer.feature.properties["Slope Score"]
        ).toFixed(5);
        this.props.setvalue(valuenow);
      }
    }
  }

  onchangeshape = (map) => {
    map.preventDefault();

    if (map.target.value === "DISTRICT") {
      this.map.removeLayer(this.state.editableFG);
      this.props.setRegion("DISTRICT");
      this.props.showRaster();
      this.props.setrasterlayerurl(this.props.rasterUrl);
      this.props.setcustomstatus(false);
      this.props.currentBasemap(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      );
      this.props.currentBasemapType("Dark");
      this.props.showLayerType(true);
      this.setState(
        {
          regionList: districtRegions(),
          regionkey: this.state.regionkey + 1,
          currentbounds: "DISTRICT",
          locpointerltlng: [60.732421875, 80.67555881973475],
          attribution: "",
        },

        function () {
          this.getvector();
        }
      );
      if (this.state.layerType === "Vector") {
        this.props.setrasterlayerurl(this.props.rasterUrl);
        this.props.setMapKey();
      }
    } else if (map.target.value === "MANDAL") {
      this.props.setRegion("MANDAL");
      this.props.showRaster();
      this.map.removeLayer(this.state.editableFG);
      this.props.setrasterlayerurl(this.props.rasterUrl);
      this.props.setcustomstatus(false);
      // this.props.SetBoundary(MANDALBOUNDS);
      this.props.currentBasemap(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      );
      this.props.currentBasemapType("Dark");
      this.props.showLayerType(true);
      this.setState(
        {
          checked: false,
          regionList: mandalRegions(),
          currentbounds: "MANDAL",
          locpointerltlng: [60.732421875, 80.67555881973475],
          attribution: "",
        },
        function () {
          this.getvector();
        }
      );
      if (this.state.layerType === "Vector") {
        this.setState({
          rasterurl: this.props.rasterUrl,
        });
        this.props.setMapKey();
      }
    } else if (map.target.value === "CUSTOM") {
      this.props.setRegion("CUSTOM");
      this.props.hideRaster();
      this.props.setcustomstatus(true);
      this.props.currentBasemap(
        "http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}"
      );
      this.props.currentBasemapType("Satellite");
      this.props.showLayerType(false);
      this.setState({
        attribution: "",
        checked: true,
      });
      this.setState({
        rasterurl: this.props.rasterUrl,
      });
      this.props.setrasterlayerurl(this.props.rasterUrl);
      this.props.SetBoundary([]);
      this.props.hideRaster();
      this.props.setMapKey();
    }
    if (this.state.layerType === "Vector") {
      this.setState({
        rasterurl: this.props.rasterUrl,
      });
      this.props.setMapKey();
    }
  };
  getcustomlocation(lat, lon) {
    if (lat !== undefined && lon !== undefined) {
      this.props.setmarkerlatlng([lat, lon]);
      if(this.props.CurrentLayer === 'LULC')
      {
        this.setState(
          {
            currentLatlon: [lat, lon],
            mapZoom: 9,
            latnew: lat,
            longnew: lon,
          },
          () => {
            this.showDrawer(this.state.customShape,this.getlulcperc);
            this.getPixelValue(); 
          }
        );
      }    else{
        this.setState(
          {
            currentLatlon: [lat, lon],
            mapZoom: 9,
            latnew: lat,
            longnew: lon,
          },
          () => {
            this.showDrawer(this.state.customShape, this.getpointtrend);
            this.getPixelValue(); 
          }
        );
      }  
      this.props.setrasterlayerurl(this.state.rasterurl);
    }
  }
  async getPixelValue() {
    this.setState({ pixelloader: true });
    var bodyParams = {
      latitude: this.state.currentLatlon[0],
      longitude: this.state.currentLatlon[1],
      layer_id: this.props.LayerDescription.id,
    };
    try {
      const response = await getpixel(bodyParams);
      if (response.data.code === 200) {
        this.setState({ pixelloader: false });
        let res = response.data;
        this.props.setPixelValue(res.pixelvalue)
      } else {
        message.error("Failed to connect to the server");
      }
    } catch (error) {
      message.error("Failed to connect to the server");
    }
  }
  onChangeLayertype(e) {
    this.setState(
      {
        layerType: e.target.value,
      },
      () => {
        ltype = e.target.value;
        if (ltype === "Raster") {
          this.props.setLayerType("Raster");
          this.props.setrasterlayerurl(this.props.rasterUrl);
          this.props.showRaster();
          this.props.setMapKey();
          window.layerType = "Raster";
          this.setState({
            showMarker: true,
          });
        } else if (ltype === "Vector") {
          this.setState({
            rasterurl: this.props.rasterUrl,
          });
          this.props.setLayerType("Vector");
          this.props.setrasterlayerurl(this.props.rasterUrl);
          this.props.setMapKey();
          this.setState({
            mapkey: this.state.mapkey + 1,
            showMarker: false,
          });
          window.layerType = "Vector";
        }
      }
    );
  }

  getcurrentRaster = (id) => {
    this.props.setrasterlatlon([
      Config.loaderlatvector,
      Config.loaderlngvector,
    ]);
    let result = process.env.REACT_APP_APIEND_RASTER.replace(
      "LAYER_DETAILS_ID",
      id
    );
    this.props.setrasterlayerurl(result);
    this.setState({
      rasterurl: result,
    });
  };
  searchRegion(e) {
    var selected_region = this.state.regionList.find((obj) => obj.dname === e);
    if (this.props.CurrentRegion === "MANDAL") {
      var current_reg = this.props.CurrentVector.features.find(
        (obj) => obj.properties.mandal_name === e
      );
    } else {
      var current_reg = this.props.CurrentVector.features.find(
        (obj) => obj.properties.district_name === e
      );
    }
    this.props.isShapeSelected(true);
    this.setState({
      ...this.state,
      shapeSelected: true,
    });

    if (this.state.shapeSelected === true && selected_region === undefined) {
      // console.log('selected_region', selected_region);
      return this.closeSearchRegion();
    }

    // console.log("onchange!!!", selected_region.uid)
    this.setState(
      {
        latnew: selected_region.centerPoint[1],
        longnew: selected_region.centerPoint[0],
        mapZoom: 9,
        layerUID: selected_region.uid,
      },
      () => {
        if (this.props.CurrentRegion === "MANDAL") {
          var mandal_namee = selected_region.dname;
          if (typeof mandal_namee !== "undefined") {
            this.props.setplace(mandal_namee);
            if (current_reg.properties.zonalstat !== undefined) {
              this.props.setvalue(
                parseFloat(current_reg.properties.zonalstat.mean).toFixed(2)
              );
            } else {
              this.props.setvalue("N/A");
            }
          } else {
            this.props.setplace("");
            this.props.setvalue(0);
          }
        } else if (this.props.CurrentRegion === "DISTRICT") {
          if (current_reg.properties.district_name === undefined) {
            var district_name = current_reg.properties.district_name;
          } else {
            console.log();
          }
          if (typeof district_name !== "undefined") {
            this.props.setplace(current_reg.properties.district_name);
            if (current_reg.properties.zonalstat !== undefined) {
              this.props.setvalue(
                parseFloat(current_reg.properties.zonalstat.mean).toFixed(2)
              );
            } else {
              this.props.setvalue("N/A");
            }
          } else {
            this.props.setplace("");
            this.props.setvalue(0);
          }
        }
      }
    );
  }

  closeSearchRegion() {
    this.setState({
      ...this.state,
      latnew: Config.latnew,
      longnew: Config.longnew,
      mapZoom: 7.5,
      layerUID: "",
      shapeSelected: false,
    });
    this.props.setplace('');
    this.props.isShapeSelected(false);
  }
  updateMapZoom = (newZoomValue) => {
    this.setState({
      latnew: Config.latnew,
      longnew: Config.longnew,
      mapZoom: newZoomValue
    })
  };

  async getvector() {
    if (window.innerWidth <= 480) {
      this.setState({
        mapZoom: 6.5,
        mobile: true,
        latnew: Config.latnew,
        longnew: Config.longnew,
      });
    } else {
      this.setState({
        mapZoom: 7.5,
        mobile: false,
        latnew: Config.latnew,
        longnew: Config.longnew,
      });
    }
    try {
      this.changeVectorLoader(Config.loaderlatvector, Config.loaderlngvector);
      getlatestdate(this.props.LayerDescription.id).then(async (json) => {
        var last_updated_date = new Date(json.data);
        var from_dd = String(last_updated_date.getDate()).padStart(2, "0");
        var from_mm = String(last_updated_date.getMonth() + 1).padStart(2, "0"); //January is 0!
        var from_yyyy = last_updated_date.getFullYear();
        var ltdate = from_dd + "-" + from_mm + "-" + from_yyyy;
        const vectorres = await axios.get(
          process.env.REACT_APP_APIEND_VECTOR.replace(
            "LAYER_DESC_ID",
            this.props.LayerDescription.id
          )
            .replace("CURRENT_BOUNDS", this.props.CurrentRegion)
            .replace("LTDATE", ltdate)
        );
        this.props.SetBoundary(vectorres.data);
        this.props.setDate(ltdate);
        this.changeVectorLoader(60.732421875, 80.67555881973475);
        this.props.setMapKey();
        let min = Infinity;
        let max = -Infinity;
        vectorres.data.features.forEach((feature) => {
          if (feature.properties.zonalstat === undefined) {
            console.log();
            if (feature.properties["DPPD score"] === undefined) {
            } else {
              const mean = feature.properties["DPPD score"];
              if (!isNaN(mean)) {
                min = Math.min(min, mean);
                max = Math.max(max, mean);
              }
            }
            if (feature.properties["Slope Score"] === undefined) {
            } else {
              const mean = feature.properties["Slope Score"];
              if (!isNaN(mean)) {
                min = Math.min(min, mean);
                max = Math.max(max, mean);
              }
              console.log();
            }
          } else {
            const mean = feature.properties.zonalstat.mean;
            if (!isNaN(mean)) {
              min = Math.min(min, mean);
              max = Math.max(max, mean);
            }
          }
        });
        this.setState({
          minMean: min.toFixed(6),
          maxMean: max.toFixed(6),
        });
        this.setState({
          updatedDate: ltdate,
        });
      });
    } catch (err) {
      console.log();
    }
    if (this.props.CurrentLayer === "WH") {
      this.setState({
        pointData: true,
      });
      try {
        const res = await axios.get(
          process.env.REACT_APP_APIEND + `warehouses`
        );
        this.setState(
          {
            pointVector: res.data.data,
          },
          () => {}
        );
      } catch (err) {
        message.error("Failed to connect to server");
      }
    }
    if (this.props.CurrentLayer === "FIREEV") {
      this.setState({
        pointData: true,
      });
      try {
        const response = await axios.get(
          process.env.REACT_APP_APIEND + `cropfire?layer_id=` + this.props.LayerDescription.id
        );
        this.setState(
          {
            pointVector: response.data.data,
          },
          () => {}
        );
      } catch (err) {
        message.error("Failed to connect to server");
      }
    }
  }
  handleMapClick = (e) => {
    this.setState({
      currentLatlon: [e.latlng.lat, e.latlng.lng],
      pixelloader: false
    });
  };
  Customlayer(e) {
    e.layer.on("click", () => {
      this.showDrawer();
    });
    if (this.state.editableFG === []) {
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
    shapePoints[0].map((points, index) =>
      newpoints.push([points.lng, points.lat])
    );
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
        this.showDrawer(this.state.customShape);
      }
    );
  }
  updateDimensions = () => {
    if (window.innerWidth <= 480) {
      this.setState({
        mapZoom: 6.5,
        mobile: true,
      });
    } else {
      this.setState({
        mapZoom: 7.5,
        mobile: false,
      });
    }
  };
  handleZoomEnd = () => {
    if (this.mapInstance) {
    this.setState({ mapZoom: this.mapInstance.leafletElement.getZoom(),
      latnew:  this.mapInstance.leafletElement.getCenter().lat,
      longnew:  this.mapInstance.leafletElement.getCenter().lng
    });
  }
  };
  componentDidMount() {
    this.mapInstance.leafletElement.on('zoomend', this.handleZoomEnd);
    this.updateDimensions();
    this.map = this.mapInstance.leafletElement;
    getlayers(Config.regionID).then((json) => {
      let result;
      result = json.data.reduce(function (r, a) {
        r[a.category_id] = r[a.category_id] || [];
        r[a.category_id].push(a);
        return r;
      }, Object.create(null));
      // console.log("RESULT~~~", result)
      this.getcurrentRaster(result[1][0].id);
      this.props.setLayerDesc(result[1][0]);

      this.getvector();
      // layerList([result]);
      // setCategorylist(Object.keys([result][0]));
    });
  }

  handleFeatureClick = (event) => {
    // console.log("VectorGrid feature clicked!", event.layer.properties);
  };

  boundaryStyle(feature){
    return {
      opacity: 1,
      color: "#454545",
      fillOpacity: 0,
      weight: 0.5,
    };
  }

  style(feature) {
    var scale;
    if (this.props.CurrentLayer === "WEATHER") {
      return {
        weight: 1,
        opacity: 1,
        fillOpacity: 0.41,
        fillColor: "#a5a8a8",
        color: "#d65522",
      };
    }
    if (this.props.CurrentLayer === "LULC") {
      return {
        opacity: 1,
        color: "#d65522",
        fillOpacity: 0,
        weight: 0.5,
      };
    }
    if (
      this.props.CurrentLayer === "crop_intensity" ||
      this.props.CurrentLayer === "crop_land" ||
      this.props.CurrentLayer === "crop_type" ||
      this.props.CurrentLayer === "crop_stress"
    ) {
      return {
        opacity: 1,
        color: "#d65522",
        fillOpacity: 0,
        weight: 0.5,
      };
    }
    if (this.props.CurrentLayer === "FIREEV") {
      return {
        opacity: 1,
        color: "#d65522",
        fillOpacity: 0,
        weight: 0.5,
      };
    }
    if (this.props.CurrentLayer === "CP") {
      return {
        opacity: 1,
        color: "#d65522",
        fillOpacity: 0,
        weight: 0.5,
      };
    }
    if (this.props.CurrentLayer === "WH") {
      return {
        opacity: 1,
        color: "#d65522",
        fillOpacity: 0,
        weight: 0.5,
      };
    } else if (
      this.props.currentLayerType === "Vector" &&
      this.state.layerUID === feature.properties.uid
    ) {
      return {
        opacity: 1,
        color: "#2bf527",
        fillOpacity: 1,
        weight: 6,
      };
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "SOIL_M_DEV"
    ) {
      scale = chroma
        .scale(this.props.DevvectorColor)
        .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
      if (feature.properties.zonalstat !== undefined) {
        if (this.props.CurrentLayer === "SOIL_M_DEV") {
          return {
            // fillColor: this.getColor(feature.properties.zonalstat.mean),
            fillColor: scale(feature.properties.zonalstat.mean),
            weight: 1,
            opacity: 1,
            color: "#d65522",
            fillOpacity: 1,
          };
        } else {
          console.log();
        }
      }
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "LAI_DPPD"
    ) {
      if (this.props.CurrentLayer === "LAI_DPPD") {
        scale = chroma
          .scale(this.props.DevvectorColor)
          .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor:
            this.props.CurrentLayer === "DPPD"
              ? scale(feature.properties["Slope Score"])
              : this.props.CurrentLayer === "LAI_DPPD"
              ? scale(feature.properties["DPPD score"])
              : scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "NDWI_DPPD"
    ) {
      scale = chroma
        .scale(this.props.DevvectorColor)
        .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
      if (this.props.CurrentLayer === "NDWI_DPPD") {
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor:
            this.props.CurrentLayer === "DPPD"
              ? scale(feature.properties["Slope Score"])
              : this.props.CurrentLayer === "NDWI_DPPD"
              ? scale(feature.properties["DPPD score"])
              : scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "NDVI_DPPD"
    ) {
      scale = chroma
        .scale(this.props.DevvectorColor)
        .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
      if (this.props.CurrentLayer === "NDVI_DPPD") {
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor:
            this.props.CurrentLayer === "DPPD"
              ? scale(feature.properties["Slope Score"])
              : this.props.CurrentLayer === "NDVI_DPPD"
              ? scale(feature.properties["DPPD score"])
              : scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "LST_DPPD"
    ) {
      if (this.props.CurrentLayer === "LST_DPPD") {
        scale = chroma
          .scale(this.props.DevcfvectorColor)
          .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor:
            this.props.CurrentLayer === "DPPD"
              ? scale(feature.properties["Slope Score"])
              : this.props.CurrentLayer === "LST_DPPD"
              ? scale(feature.properties["DPPD score"])
              : scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "NO2_DPPD"
    ) {
      scale = chroma
        .scale(this.props.DevcfvectorColor)
        .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
      if (this.props.CurrentLayer === "NO2_DPPD") {
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor:
            this.props.CurrentLayer === "NO2_DPPD"
              ? scale(feature.properties["Slope Score"])
              : scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "PM25_DPPD"
    ) {
      scale = chroma
        .scale(this.props.DevcfvectorColor)
        .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
      if (this.props.CurrentLayer === "PM25_DPPD") {
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor:
            this.props.CurrentLayer === "DPPD"
              ? scale(feature.properties["Slope Score"])
              : this.props.CurrentLayer === "PM25_DPPD"
              ? scale(feature.properties["Slope Score"])
              : scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    }
    if (
      this.props.currentLayerType === "Vector" &&
      this.props.CurrentLayer === "DPPD"
    ) {
      scale = chroma
        .scale(this.props.DevcfvectorColor)
        .domain([-1, this.state.minMean, 0, this.state.maxMean, 1]);
      if (this.props.CurrentLayer === "DPPD") {
        return {
          // fillColor: this.getColor(feature.properties.zonalstat.mean),
          fillColor:
            this.props.CurrentLayer === "DPPD"
              ? scale(feature.properties["Slope Score"])
              : scale(feature.properties.zonalstat.mean),
          weight: 1,
          opacity: 1,
          color: "#d65522",
          fillOpacity: 1,
        };
      }
    }
    if (ltype === "Vector") {
      if (this.state.layerUID === feature.properties.uid) {
        return {
          opacity: 1,
          color: "#2bf527",
          fillOpacity: 1,
          weight: 1,
        };
      } 
      else {
        if (feature.properties.zonalstat === undefined || this.props.CurrentLayer === "SOIL_M_DEV") {
          // console.log();
          return {
            opacity: 1,
            color: "#d65522",
            fillOpacity: 0,
            weight: 0.5,
          };
        } else if(this.props.CurrentLayer === "SOIL_M_DEV" || this.props.CurrentLayer === "DPPD"
        || this.props.CurrentLayer === "NO2_DPPD" || this.props.CurrentLayer === "PM25_DPPD" || this.props.CurrentLayer === "LAI_DPPD"
        || this.props.CurrentLayer === "LST_DPPD" || this.props.CurrentLayer === "NDVI_DPPD"|| this.props.CurrentLayer === "NDWI_DPPD"
        ){
           console.log();
        }
        else if( this.props.currentLayerType === "Raster"){
          return {
            opacity: 1,
            color: "#d65522",
            fillOpacity: 0,
            weight: 0.5,
          };
        }
        else {
          scale = chroma
            .scale(this.props.vectorColor)
            .domain([this.state.minMean, this.state.maxMean]);
          return {
            // fillColor: this.getColor(feature.properties.zonalstat.mean),
            fillColor:
              this.props.CurrentLayer === "DPPD"
                ? scale(feature.properties["Slope Score"])
                : this.props.CurrentLayer === "LST_DPPD"
                ? scale(feature.properties["DPPD score"])
                : scale(feature.properties.zonalstat.mean),
            weight: 1,
            opacity: 1,
            color: "#d65522",
            fillOpacity: 1,
          };
        }
      }
    } else {
      if (this.state.layerUID === feature.properties.uid) {
        return {
          opacity: 1,
          color: "#2bf527",
          fillOpacity: 0,
          weight: 6,
        };
      } else {
        return {
          // opacity: 1,
          color: "#d65522",
          weight: 0.5,
          fillOpacity: 0,
        };
      }
    }
  }
  generatechart(data) {
    var trendData = {
      name: this.props.CurrentLayer,
      data: [],
    };

    if (data != null) {
      data.map((item) =>
        trendData.data.push({
          x: item[0],
          y:
            this.props.currentLayer === "POPULATION"
              ? item[1]
              : parseFloat(item[1]).toFixed(2),
        })
      );
    }

    this.setState({
      series: [trendData],
      loader: false,
      options: {
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
        },
        grid: {
          show: false,
          borderColor: "#90A4AE",
          strokeDashArray: 0,
          position: "back",
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        yaxis: {
          show: true,
          tickAmount: 3,
          format: "dd MMM yyyy",
          labels: {
            show: true,
            style: {
              colors: "#90989b",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-yaxis-label",
            },
          },
          title: {
            text: this.getyaxistext(),
            rotate: -90,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#90989b",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-yaxis-title",
            },
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            datetimeFormatter: {
              year: "yyyy",
              month: "dd MMM",
              day: "dd MMM",
              hour: "HH:mm",
            },
            style: {
              colors: "#90989b",
              cssClass: "apexcharts-xaxis-label",
            },
          },
          title: {
            text: this.getxaxistext(),
            rotate: -90,
            offsetX: 0,
            offsetY: 5,
            style: {
              color: "#90989b",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-yaxis-title",
            },
          },
        },
      },
    });
  }
  render() {
    return (
      <>
        <Sidebar changecurrentlayer={this.getvector} onClose={this.onClose}>
          <div className="App">
            <div className="header">
              <div className="topnav-left">
                <Row style={{ marginTop: "5px" }}>
                  <Col className="dicra">
                    {" "}
                    <a className="landing-link" href="/">
                      DiCRA
                    </a>
                    <span className="state-name">{Config.state}</span>
                  </Col>
                </Row>
                <div className="heading">
                  Data in Climate Resilient Agriculture
                </div>
              </div>
              <div className="topnav-right">
                <Row>
                  <Col>
                    {this.props.currentLayerType === "Raster" && (
                      <div
                        style={{
                          marginTop: "6.7%",
                        }}
                      >
                        <SearchPlace
                          className="google-search"
                          searchArea={this.getcustomlocation}
                          updateMapZoom={this.updateMapZoom}
                        />
                      </div>
                    )}

                    {this.props.currentLayerType === "Vector" && (
                      <Select
                        className="search-region"
                        placeholder="Search"
                        onChange={(e) => {
                          this.searchRegion(e);
                        }}
                        dropdownRender={(menu) => (
                          <>
                            <span
                              style={{ padding: "5px", fontWeight: "bold" }}
                            >
                              {this.props.CurrentRegion === "MANDAL"
                                ? "SUB DISTRICT"
                                : this.props.CurrentRegion}
                            </span>
                            {menu}
                          </>
                        )}
                        options={this.state.regionList.map((item, index) => ({
                          label: item.dname,
                          value: item.dname,
                          key: index,
                        }))}
                        showSearch={true}
                        allowClear={true}
                        clearIcon={
                          <div onClick={this.closeSearchRegion}>
                            <AiFillCloseCircle
                              style={{
                                fontSize: "18px",
                                color: "#fff",
                                background: "transparent",
                              }}
                            />
                          </div>
                        }
                      />
                    )}
                  </Col>
                  {Config.stateImage.length > 0 ? (
                  <Col className="state-logo">
                      <img
                        src={Config.stateImage}
                        //width={50}
                        height={40}
                        alt="Telengana"
                      />
                  </Col>
                  ) : null}
                  <Col className="nabard-logo">
                    <img src={Nabard} height={45} alt="Nabard" />
                  </Col>
                  <Col className="undp-logo">
                    <img src={Undp} width={25} height={50} alt="Undp" />
                  </Col>
                </Row>
              </div>
            </div>
            {this.state.mobile === true ? (
              <div className="home-btn" onClick={this.resetmapzoommobile}>
                <img
                  className="home-icon"
                  src={Home}
                  alt=""
                  width="34px"
                  style={{ position: "relative", left: "3px", top: "3px" }}
                />
              </div>
            ) : (
              <div className="home-btn" onClick={this.resetmapzoom}>
                <img
                  className="home-icon"
                  src={Home}
                  alt=""
                  width="34px"
                  style={{ position: "relative", left: "3px", top: "3px" }}
                />
              </div>
            )}
            <div>
              <DrawerComp
                ref={this.childComponentRef}
                latlong={this.state.currentLatlon}
                pixelloader={this.state.pixelloader}
              />
            </div>
            <div className="btn-toggleBaseMap">
              <div className="row">
                <div className="col-sm-4 btn-toggleBaseMap-theme">Theme</div>
                <div className="col-sm-8">
                  <FormGroup>
                    <Input
                      type="select"
                      name="select"
                      className="toggleBaseMap-select"
                      value={this.props.currentbasemaptype}
                      onChange={this.ChangeBasemap}
                    >
                      <option value="Dark">Dark</option>
                      <option value="Satellite">Satellite</option>
                      <option value="Grey">Grey</option>
                    </Input>
                  </FormGroup>
                </div>
                <div className="btn-toggle">
                  <div className="row">
                    <div className="col-sm-4 btn-toggle-type">Type</div>
                    <div className="btn-toggle-radio-grp">
                      <Radio.Group
                        options={label_options}
                        onChange={this.onChangeLayertype}
                        value={this.props.currentLType}
                        optionType="button"
                        buttonStyle="solid"
                        disabled={
                          this.props.showlayertype
                            ? this.props.LayerDescription.vector_status ===
                              false
                              ? true
                              : false ||
                                this.props.LayerDescription.raster_status ===
                                  false
                              ? true
                              : false
                            : true
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="selection">
                  <div className="row">
                    <div className="col-sm-4 selection-boundary">Boundary</div>
                    <div className="col-sm-8">
                      {" "}
                      <FormGroup>
                        <Input
                          type="select"
                          name="select"
                          className="selection-select"
                          key={this.state.regionkey}
                          value={this.props.CurrentRegion}
                          onChange={(e) => this.onchangeshape(e)}
                        >
                          <option value="DISTRICT" key="DISTRICT">
                            District
                          </option>
                          <option value="MANDAL" key="MANDAL">
                            Sub District
                          </option>
                          <option
                            key="CUSTOM"
                            value="CUSTOM"
                            disabled={
                              this.props.LayerDescription.showcustom === false
                                ? true
                                : this.props.CurrentLayer === "SOIL_M_DEV" ||
                                  this.props.CurrentLayer === "LAI_DPPD"
                                ? true
                                : false
                            }
                          >
                            Custom
                          </option>
                        </Input>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Map
              maxZoom={18}
              minZoom={2}
              zoomSnap={0.25}
              zoomDelta={0.25}
              style={MAP_STYLES}
              zoom={this.state.mapZoom}
              center={[this.state.latnew, this.state.longnew]}
              key={this.props.MapKey}
              ref={(e) => {
                this.mapInstance = e;
              }}
              zoomControl={false}
              onClick={this.handleMapClick}
              onZoomend={this.handleZoomEnd}
            >
              <ZoomControl position="bottomright" className="btn-zoomcontrol" />
              <TileLayer
                attribution={this.state.attribution}
                url={this.props.currentbasemapurl}
              />
              <Marker
                position={[
                  this.state.loaderlatvector,
                  this.state.loaderlngvector,
                ]}
                icon={LoaderIcon}
              ></Marker>
              <Marker
                position={this.props.LoaderRaster}
                icon={LoaderIcon}
              ></Marker>
              {this.props.CurrentLayer === "WH"
                ? this.state.pointVector.features.map((point, index) => (
                    <Marker
                      position={[
                        point.properties.latitude,
                        point.properties.longitude,
                      ]}
                      radius={4}
                      fillOpacity={1}
                      fillColor={"#d10a25"}
                      stroke={false}
                      icon={MarkerIcon}
                      key={index}
                      direction="top"
                    >
                      <Tooltip>
                        Capacity: {point.properties.capacity} MT
                        <br />
                        Warehouse Name: {point.properties.warehouse}
                        <br />
                        District: {point.properties.district}
                      </Tooltip>
                    </Marker>
                  ))
                : null // or any other fallback behavior you want
              }
              {this.props.CurrentLayer === "FIREEV"
                ? this.state.pointVector.features.map((point, index) => (
                    <Marker
                      position={[
                        point.properties.latitude,
                        point.properties.longitude,
                      ]}
                      radius={4}
                      fillOpacity={1}
                      fillColor={"#d10a25"}
                      stroke={false}
                      icon={MarkerIcon}
                      key={index}
                      direction="top"
                    >
                      <Tooltip
                        style={
                          this.props.CurrentLayer === "WH"
                            ? {}
                            : { display: "none" } &&
                              this.props.CurrentLayer === "FIREEV"
                            ? { display: "none" }
                            : {}
                        }
                      >
                        <a
                          href={() => false}
                          style={
                            this.props.CurrentLayer === "CP"
                              ? { display: "none" }
                              : { textAlign: "left" }
                          }
                        >
                          FRP : {point.properties.frp}
                          <br />
                          Date : {point.properties.acq_date}
                        </a>
                        <a
                          href={() => false}
                          style={
                            this.props.CurrentLayer === "CP"
                              ? {}
                              : { display: "none" }
                          }
                        >
                          Market Yard : {point.properties.name}
                        </a>
                      </Tooltip>
                    </Marker>
                  ))
                : null
              }
              <MSCogRaster
                url={this.props.rasterUrl}
                changeLoader={this.changeRasterLoader}
              />
              {/* <Marker position={this.state.locpointerltlng} icon={LocIcon} /> */}
              {this.state.showMarker && (
                <Marker position={this.props.LatLon} icon={LocIcon}></Marker>
              )}
               <GeoJSON
                style={this.boundaryStyle}
                data={this.state.india_boundary.features}
              />
              <GeoJSON
                style={this.style}
                data={this.props.CurrentVector.features}
                onClick={this.showDrawer}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOver}
                key={this.props.MapKey}
                zIndex={999}
              />
              <div style={{ zIndex: -999 }}>
                <FeatureGroup>
                  <EditControl
                    position="topright"
                    onCreated={this.Customlayer}
                    // style={{ marginBottom: "179px" }}
                    draw={{
                      rectangle: this.props.customstatus,
                      circle: false,
                      circlemarker: false,
                      marker: false,
                      polyline: false,
                      polygon: this.props.customstatus,
                    }}
                    edit={{
                      edit: false,
                      remove: this.props.customstatus,
                    }}
                  />
                </FeatureGroup>
              </div>
            </Map>
          </div>
          <BottomNav changecurrentlayer={this.getvector} />
        </Sidebar>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeafletMap);
