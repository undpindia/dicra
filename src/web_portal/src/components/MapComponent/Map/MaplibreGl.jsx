/* eslint-disable no-redeclare */
import React from 'react';
import maplibregl from 'maplibre-gl';
import { Map, NavigationControl } from 'react-map-gl/maplibre';
import { Source, Layer } from 'react-map-gl/maplibre';
import { cogProtocol, locationValues } from '@geomatico/maplibre-cog-protocol';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../Common/Header.css';
import Home from '../../../assets/images/home.png';
import Undp from '../../../assets/images/undp-logo-blue.svg';
import './Map.css';
import DrawerComp from './Drawer/Drawer';
import { FormGroup, Input, Col, Row } from 'reactstrap';
import { Radio, message } from 'antd';
import {
  getlatestdate,
  getlayers,
  getpixel,
} from '../../../assets/api/apiService';
import axios from 'axios';
import { connect } from 'react-redux';
import Config from '../Config/config';
import { centroid } from '@turf/turf';
import locIcon from '../../../assets/images/locationICON.png';
import mandalRegions from './Regions/mandalRegions';
import districtRegions from './Regions/districtRegions';
import Sidebar from '../Common/Sidebar';
import { Select } from 'antd';
import SearchPlace from './searchPlaces';
import BottomNav from '../Common/BottomNav/BottomNav';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Marker } from 'react-map-gl/maplibre';
import Nabard from '../../../assets/images/partners/nabard.png';
import India from './Shapes/India_State.json';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {
  DOMAIN_LOOKUP,
  LULC_COLORS,
  CROP_INTENSITY,
  CROP_STRESS,
  CROP_LAND,
  CROP_TYPE_129,
  CROP_TYPE_134,
  CROP_TYPE_135,
  DOMAIN_LOOKUP_DPPD,
} from './layerDomains';
import Geocode from 'react-geocode';

maplibregl.addProtocol('cog', cogProtocol);
const pmtilesProtocol = new Protocol();
maplibregl.addProtocol('pmtiles', pmtilesProtocol.tile);

let ltype = 'Raster';
const label_options = [
  { label: 'Raster', value: 'Raster' },
  { label: 'Vector', value: 'Vector' },
];

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.REACT_APP_API_KEY);

// set response language. Defaults to english.
Geocode.setLanguage('en');

// Enable or disable logs. Its optional.
Geocode.enableDebug();

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
    rasterColor: ReduxProps.SetColor,
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
    currentLType: ReduxProps.CurrentLayerType,
    showLoader: ReduxProps.showLoader,
    setshapeId: ReduxProps.setshapeId,
    getPmtileUrl: ReduxProps.pmtileUrl,
    showraster: ReduxProps.RasterOpacity,
    layerdesc: ReduxProps.LayerDescription,
    pointfeature: ReduxProps.pointfeature,
    pointvectorurl: ReduxProps.pointvectorurl
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVectorColor: (col) => dispatch({ type: 'SETCOLOR_SCALE', payload: col }),
    setRasterColor: (col) => dispatch({ type: 'SETCOLOR_SCALE', payload: col }),
    setDevcfvectorColor: (col) =>
      dispatch({ type: 'SETDEVCFCOLOR_SCALE', payload: col }),
    setLayerDesc: (details) =>
      dispatch({ type: 'CHANGELAYERDESC', payload: details }),
    setDevvectorColor: (col) =>
      dispatch({ type: 'SETDEVCOLOR_SCALE', payload: col }),
    setvalue: (val) => dispatch({ type: 'SETVALUE', payload: val }),
    setplace: (plc) => dispatch({ type: 'SETPLACE', payload: plc }),
    VectorLoader: () => dispatch({ type: 'ENABLEVECTOR' }),
    SetBoundary: (geojson) =>
      dispatch({ type: 'SETCURRENTVECTOR', payload: geojson }),
    setRegion: (region) =>
      dispatch({ type: 'SETCURRENTREGION', payload: region }),
    setMapKey: () => dispatch({ type: 'CHANGEKEYMAP' }),
    setLayerType: (currentlayertype) =>
      dispatch({ type: 'SETCURRRENTLAYERTYPE', payload: currentlayertype }),
    showRaster: () => dispatch({ type: 'SHOWRASTER' }),
    hideRaster: () => dispatch({ type: 'HIDERASTER' }),
    setrasterlayerurl: (rasterurl) =>
      dispatch({
        type: 'SETRASTERLAYERURL',
        payload: rasterurl,
      }),
    setDate: (currentdate) =>
      dispatch({ type: 'SETCURRENTDATE', payload: currentdate }),
    setlatlon: (lat, lon) =>
      dispatch({
        type: 'SETLATLON',
        payload: [parseFloat(lon).toFixed(2), ',', parseFloat(lat).toFixed(2)],
      }),
    setrasterlatlon: (pos) =>
      dispatch({
        type: 'SETRASLATLON',
        payload: pos,
      }),
    setcustomstatus: (customstatus) =>
      dispatch({ type: 'SETCUSTOMSTATUS', payload: customstatus }),
    currentBasemap: (currentbasemapurl) =>
      dispatch({ type: 'SETCURRRENTBASEMAP', payload: currentbasemapurl }),
    currentBasemapType: (currentbasemaptype) =>
      dispatch({ type: 'SETCURRRENTBASEMAPTYPE', payload: currentbasemaptype }),
    showLayerType: (showlayertype) =>
      dispatch({ type: 'SHOWLAYERTYPE', payload: showlayertype }),
    isShapeSelected: (checkIsShapeSelected) =>
      dispatch({ type: 'CHECKISSHAPESELECTED', payload: checkIsShapeSelected }),
    setLulcTable: (lulc) => dispatch({ type: 'SETLULCTABLE', payload: lulc }),
    removeMarker: (marker) =>
      dispatch({ type: 'REMOVE_MARKER', payload: marker }),
    setmarkerlatlng: (latlng) =>
      dispatch({ type: 'ADD_MARKER', payload: latlng }),
    showDrawer: (val) => dispatch({ type: 'SHOWDRAWER', payload: val }),
    setPixelValue: (results) =>
      dispatch({ type: 'SETPIXELVALUE', payload: results }),
    showLoader: (val) => dispatch({ type: 'SHOWLOADER', payload: val }),
    setShapeId: (val) => dispatch({ type: 'SETSHAPEID', payload: val }),
    setPmtileUrl: (val) =>
      dispatch({ type: 'SETPMTILELAYERURL', payload: val }),
    // setHoverFeature: (val) =>
    //   dispatch({ type: 'SETHOVERFEATURE', payload: val }),
    pointFeature: (val) =>
       dispatch({ type: 'CHANGEPOINTFEATURES', payload: val }),
    setPointVectorUrl: (val) =>
      dispatch({ type: 'SETPOINTLAYERURL', payload: val })
  };
};
class MaplibreComponent extends React.Component {
  constructor(props) {
    super(props);
    this.childComponentRef = React.createRef();
    this.mapRef = React.createRef();
    this.state = {
      isHovering: false,
      raster: null,
      mapkey: 1,
      latnew: Config.latnew,
      longnew: Config.longnew,
      loaderlatvector: Config.loaderlatvector,
      loaderlngvector: Config.loaderlngvector,
      loaderlatraster: Config.loaderlatraster,
      loaderlngraster: Config.loaderlngraster,
      mapZoom: 6,
      currentZoom: 7.5,
      attribution: '',
      visible: false,
      currentbounds: 'DISTRICT',
      MapKey: 1,
      layerid: 1,
      updatedDate: '',
      rasterurl: '',
      vectorurl: '',
      area: '',
      distname: '',
      meanvalue: '',
      maxvalue: '',
      locpointerltlng: Config.locpointerltlng,
      minvalue: '',
      popsum: '',
      zonalstat: {},
      layerType: 'Raster',
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
      selectedLULCcategory: 'Water',
      LULCtrend: [],
      currentCharttime: '6mon',
      customLULC: [],
      LULCclasses: [],
      currentLatlon: [0, 0],
      pixelloader: true,
      customShape: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              centroid: [78.46696611965449, 17.39599799813276],
            },
            geometry: {
              type: 'Polygon',
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
      from_date: '2021-06-10',
      to_date: '2021-12-12',
      selectedWeatherparams: 'max_temp',
      last_updated: '',
      weatherValue: 0.0,
      shapeSelected: false,
      isColorFunctionReady: false,
      isVectorSourceLoaded: false,
      isMapLoaded: false,
      mkPosition: [0, 0],
      selectedShapeName: '',
      pointVector: '',
      // hoveredFeature: null
    };
    this.searchRegion = this.searchRegion.bind(this);
    // this.getcustomlocation = this.getcustomlocation.bind(this);
    this.resetmapzoom = this.resetmapzoom.bind(this);
    this.onchangeshape = this.onchangeshape.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    // this.onMouseOver = this.onMouseOver.bind(this);
    this.getcurrentRaster = this.getcurrentRaster.bind(this);
    this.getvector = this.getvector.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onChangeLayertype = this.onChangeLayertype.bind(this);
    // this.Customlayer = this.Customlayer.bind(this);
    // this.style = this.style.bind(this);
    // this.boundaryStyle = this.boundaryStyle.bind(this);
    this.resetmapzoommobile = this.resetmapzoommobile.bind(this);
    this.closeSearchRegion = this.closeSearchRegion.bind(this);
    this.getPixelValue = this.getPixelValue.bind(this);
    this.onClose = this.onClose.bind(this);
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });
  }

  reverseGeocodeHandler = async (lat, lng) => {
    try {
      const response = await Geocode.fromLatLng(lat, lng);
      const address = response.results[0].formatted_address
        .split(' ')
        .splice(1)
        .join(' ');
      console.log('addressInRGH', address);

      return address;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  resetmapzoommobile() {
    if (!this.mapRef.current) return;

    const map = this.mapRef.current.getMap();

    map.flyTo({
      center: [Config.longnew, Config.latnew],
      zoom: 4.5,
      speed: 1.2, // optional: controls animation speed
      curve: 1.42, // optional: smoothness of the animation curve
      essential: true, // this animation is essential to user experience
    });
  }

  resetmapzoom() {
    if (!this.mapRef.current) return;

    const map = this.mapRef.current.getMap();

    map.flyTo({
      center: [Config.longnew, Config.latnew],
      zoom: 6,
      speed: 1.2, // optional: controls animation speed
      curve: 1.42, // optional: smoothness of the animation curve
      essential: true, // this animation is essential to user experience
    });
  }

  toggleClass() {
    if (window.innerWidth <= 768) {
      this.resetmapzoommobile();
    } else {
      this.resetmapzoom();
    }
  }

  enableDrawTool = () => {
    const map = this.mapRef?.current?.getMap?.();
    if (!map || map.hasControl(this.draw)) return;

    map.addControl(this.draw, 'bottom-right');
    map.on('draw.create', this.handleDrawCreate);
    map.on('draw.update', this.handleDrawUpdate);
    map.on('draw.delete', this.handleDrawDelete);
  };

  disableDrawTool = () => {
    const map = this.mapRef?.current?.getMap?.();
    if (map?.hasControl(this.draw)) {
      map.off('draw.create', this.handleDrawCreate);
      map.off('draw.update', this.handleDrawUpdate);
      map.off('draw.delete', this.handleDrawDelete);
      map.removeControl(this.draw);
    }
  };

  onchangeshape = (map) => {
    map.preventDefault();
    if (map.target.value === 'DISTRICT') {
      // this.map.removeLayer(this.state.editableFG);
      this.disableDrawTool();
      maplibregl.addProtocol('pmtiles', pmtilesProtocol.tile)
      this.props.setRegion('DISTRICT');
      this.props.showRaster();
      this.props.setrasterlayerurl(this.props.rasterUrl);
      this.props.setcustomstatus(false);
      this.props.currentBasemap([
        'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
      ]);
      this.props.currentBasemapType('Dark');
      this.props.showLayerType(true);
      this.setState(
        {
          regionList: districtRegions(),
          regionkey: this.state.regionkey + 1,
          currentbounds: 'DISTRICT',
          locpointerltlng: [60.732421875, 80.67555881973475],
          attribution: '',
        },

        function () {
          this.getvector();
        }
      );
      if (this.state.layerType === 'Vector') {
        this.props.setrasterlayerurl(this.props.rasterUrl);
        this.props.setMapKey();
      }
    } else if (map.target.value === 'MANDAL') {
      maplibregl.addProtocol('pmtiles', pmtilesProtocol.tile)
      this.disableDrawTool();
      this.props.setRegion('MANDAL');
      this.props.showRaster();
      this.props.setrasterlayerurl(this.props.rasterUrl);
      this.props.setcustomstatus(false);
      this.props.currentBasemap([
        'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
      ]);
      this.props.currentBasemapType('Dark');
      this.props.showLayerType(true);
      this.setState(
        {
           regionList: districtRegions(),
          regionkey: this.state.regionkey + 1,
          currentbounds: 'MANDAL',
          locpointerltlng: [60.732421875, 80.67555881973475],
          attribution: '',
        },
        function () {
          this.getvector();
        }
      );
      if (this.state.layerType === 'Vector') {
        this.setState({
          rasterurl: this.props.rasterUrl,
        });
        this.props.setMapKey();
      }
    } else if (map.target.value === 'CUSTOM') {
      this.setState({
        mkPosition: [0, 0],
      });
      maplibregl.removeProtocol('pmtiles')
      this.props.setRegion('CUSTOM');
      this.props.currentBasemapType('Satellite');
      this.props.hideRaster();
      this.props.setcustomstatus(true);
      this.props.currentBasemap([
        'https://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}',
      ]);
      this.props.showLayerType(false);
      this.setState({
        attribution: '',
        checked: true,
      });
      this.setState({
        rasterurl: this.props.rasterUrl,
      });
      this.props.setrasterlayerurl(this.props.rasterUrl);
      this.props.SetBoundary([]);
      this.props.hideRaster();
      this.props.setMapKey();
      this.enableDrawTool();
    }
    if (this.state.layerType === 'Vector') {
      this.setState({
        rasterurl: this.props.rasterUrl,
      });
      this.props.setMapKey();
    }
  };
  ChangeBasemap = (val) => {
    /*
       There are multiple basemaps provided here.User can change map styles.
       Note that only one options can be used at a time.Just uncomment wanted option and you are
       good to go!.
        */
    if (val.target.value === 'Satellite') {
      /*
        Option 1 - Google Maps 
        */
      this.props.currentBasemap([
        'https://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}',
      ]);
      this.props.currentBasemapType('Satellite');
      this.setState({
        attribution: '',
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
    } else if (val.target.value === 'Grey') {
      /*
        Option 1 - ARCGIS Imagery Grey 
        */
      this.props.currentBasemap([
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      ]);
      this.props.currentBasemapType('Grey');
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
    } else if (val.target.value === 'Dark') {
      /*
        Option 1 - Carto CDN Dark 
        */
      this.props.currentBasemap([
        'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
      ]);
      this.props.currentBasemapType('Dark');
      this.setState({
        attribution: '',
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
  showDrawer = (data) => {
    // if (!data) {
    //     console.log("drawer data is undefined or null");
    //     return;
    // }
    this.props.showDrawer(true);
    try {
      let json_string = JSON.stringify(data);
      let json_parse = JSON.parse(json_string);

      this.childComponentRef.current.handleDrawerClick(json_parse);

      // console.log("maplibre json parse",json_parse)
      if (!json_parse?.geometry) {
        // console.log('drawer data geometry is missing');
        return;
      }
    } catch (error) {
      // console.error("Error processing drawer data:", error);
      return;
    }
  };
  onClose = (e) => {
    this.setState({
      visible: false,
      mkPosition: [0, 0],
    });
    this.props.removeMarker([0, 0]);
  };
  onMouseOut() {
    this.props.setplace('');
  }


  hoverInfo = { value: null, lat: null, lon: null, place: null };
  lastCommitted = { value: null, place: null };
  rafId = null;

  handleMouseMove = async (e) => {
    // console.log("value",e)
    if (!this.mapRef.current) return;
    if (this.props.CurrentRegion === 'CUSTOM') return;

    const map = this.mapRef.current.getMap();
    const { lat, lng } = e.lngLat;
    const zoom = map.getZoom();
    if (this.props.currentLayerType === 'Raster') {
      try {
        const raw = await locationValues(
          this.props.rasterUrl,
          { latitude: lat, longitude: lng },
          zoom
        );
        if (raw !== null && raw !== undefined && !isNaN(raw)) {
            map.getCanvas().style.cursor = 'pointer';
        } else {
            map.getCanvas().style.cursor = '';
        }
        this.props.CurrentLayer === 'NDWI_DPPD' ||
        this.props.CurrentLayer === 'LAI_DPPD' ||
        this.props.CurrentLayer === 'NDVI_DPPD' ||
        this.props.CurrentLayer === 'NO2' ||
        this.props.CurrentLayer === 'LST_DPPD' ||
        this.props.CurrentLayer === 'PM25_DPPD' ||
        this.props.CurrentLayer === 'NO2_DPPD' ||
        this.props.CurrentLayer === 'SOIL_M_DEV'
          ? (this.hoverInfo.value = +parseFloat(raw).toFixed(6))
          : (this.hoverInfo.value = +parseFloat(raw).toFixed(2));
      } catch (err) {
        // console.error('Raster read failed', err);
        return;
      }
    } else if (this.props.currentLayerType === 'Vector') {
      const feat = map.queryRenderedFeatures(e.point, {
        layers: ['vector-fill'],
      })[0];
      if (feat) {
        const p = feat.properties;
        let value;
        if (this.props.CurrentLayer === 'POPULATION') {
          value = p.sum;
        } else if (
          this.props.CurrentLayer === 'NDWI_DPPD' ||
          this.props.CurrentLayer === 'LAI_DPPD' ||
          this.props.CurrentLayer === 'NDVI_DPPD' ||
          this.props.CurrentLayer === 'LST_DPPD'
        ) {
          value = p['DPPD score'];
        } else if (
          this.props.CurrentLayer === 'NO2_DPPD' ||
          this.props.CurrentLayer === 'PM25_DPPD' ||
          this.props.CurrentLayer === 'DPPD'
        ) {
          value = p['Slope Score'];
        } else {
          value = p.mean;
        }

        this.hoverInfo.value = this.props.CurrentLayer === 'NDWI_DPPD' ||
          this.props.CurrentLayer === 'LAI_DPPD' ||
          this.props.CurrentLayer === 'NDVI_DPPD' ||
          this.props.CurrentLayer === 'LST_DPPD' ||
          this.props.CurrentLayer === 'NO2_DPPD' ||
          this.props.CurrentLayer === 'PM25_DPPD' ||
          this.props.CurrentLayer === 'DPPD'||  this.props.CurrentLayer === 'SOIL_M_DEV' ? +parseFloat(value).toFixed(6) :
           +parseFloat(value).toFixed(2)
        this.hoverInfo.place =
          this.props.CurrentRegion === 'MANDAL'
            ? p.mandal_name
            : p.district_name;
      } else {
        this.hoverInfo.value = null;
        this.hoverInfo.place = null;
      }
    }
    this.hoverInfo.lat = lat;
    this.hoverInfo.lon = lng;
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(this.flushHoverInfo);
    }
  };
  flushHoverInfo = () => {
    this.rafId = null;
    const h = this.hoverInfo;
    const c = this.lastCommitted;
    if (h.value !== c.value || h.place !== c.place) {
      this.props.setvalue(h.value);
      this.props.setlatlon(h.lat, h.lon);
      this.props.setplace(h.place);
      this.lastCommitted = { value: h.value, place: h.place };
    }
  };

  shouldComponentUpdate(next) {
    return (
      next.currentLayerType !== this.props.currentLayerType ||
      next.currentbasemapurl !== this.props.currentbasemapurl ||
      next.rasterColor !== this.props.rasterColor ||
      next.setlatlon !== this.props.setlatlon ||
      next.setshapeId !== this.props.setshapeId ||
      next.rasterUrl !== this.props.rasterUrl ||
      next.getDate !== this.props.getDate ||
      next.getPmtileUrl !== this.props.getPmtileUrl ||
      next.showraster !== this.props.showraster ||
      next.CurrentVector !== this.props.CurrentVector ||
      next.layerdesc !== this.props.layerdesc ||
      next.DevvectorColor !== this.props.DevvectorColor ||
      next.DevcfvectorColor !== this.props.DevcfvectorColor ||
      next.CurrentLayer !== this.props.CurrentLayer ||
      next.DevvectorColor !== this.props.DevvectorColor ||
      next.LatLon !== this.props.LatLon ||
      next.showDrawer !== this.props.showDrawer ||
      next.removeMarker !== this.props.removeMarker||
      next.pointFeature !== this.props.pointFeature ||
      next.pointvectorurl !==this.props.pointvectorurl
    );
  }
  handleMouseLeave = () => {
    const map = this.mapRef?.current?.getMap?.();
    if (map) {
      // this.props.setHoverFeature(null);
      map.getCanvas().style.cursor = '';
    }
  };

  getcustomlocation = (lat, lon) => {
    // console.log('lat,lon', lat, lon);
    if (lat !== undefined && lon !== undefined) {
      this.props.setmarkerlatlng([lat, lon]);
      if (this.props.CurrentLayer === 'LULC') {
        this.setState(
          {
            currentLatlon: [lat, lon],
            mapZoom: 9,
            latnew: lat,
            longnew: lon,
            mkPosition: [lon, lat],
          },
          () => {
            this.showDrawer(this.state.customShape, this.getlulcperc);
            this.getPixelValue();
          }
        );
      } else {
        this.setState(
          {
            currentLatlon: [lat, lon],
            mapZoom: 9,
            latnew: lat,
            longnew: lon,
            mkPosition: [lon, lat],
          },
          () => {
            this.showDrawer(this.state.customShape, this.getpointtrend);
            this.getPixelValue();
          }
        );
      }
      this.props.setrasterlayerurl(this.state.rasterurl);
    }
  };
  async getPixelValue() {
    // this.setState({ pixelloader: true });
    this.props.showLoader(true);
    var bodyParams = {
      latitude: this.state.currentLatlon[0],
      longitude: this.state.currentLatlon[1],
      layer_id: this.props.LayerDescription.id,
    };
    try {
      const response = await getpixel(bodyParams);
      if (response.data.code === 200) {
        // this.setState({ pixelloader: false });
        this.props.showLoader(false);
        let res = response.data;
        this.props.setPixelValue(res.pixelvalue);
      } else {
        message.error('Failed to connect to the server');
      }
    } catch (error) {
      message.error('Failed to connect to the server');
    }
  }
  onChangeLayertype(e) {
    this.setState(
      {
        layerType: e.target.value,
      },
      () => {
        ltype = e.target.value;
        if (ltype === 'Raster') {
          this.props.setLayerType('Raster');
          this.props.setrasterlayerurl(this.props.rasterUrl);
          this.props.showRaster();
          this.props.setMapKey();
          window.layerType = 'Raster';
          this.setState({
            showMarker: true,
          });
        } else if (ltype === 'Vector') {
          this.setState({
            rasterurl: this.props.rasterUrl,
          });
          this.props.setLayerType('Vector');
          this.props.setrasterlayerurl(this.props.rasterUrl);
          this.props.setMapKey();
          this.setState({
            mapkey: this.state.mapkey + 1,
            showMarker: false,
          });
          window.layerType = 'Vector';
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
      'LAYER_DETAILS_ID',
      id
    );
    this.props.setrasterlayerurl(result);
    this.setState({
      rasterurl: result,
    });
  };

  searchRegion(e) {
    if (!e) {
      this.clearPolygonSelection();
      return;
    }
    var selected_region = this.state.regionList.find((obj) => obj.dname === e);
    // if (this.props.CurrentRegion === 'MANDAL') {
    //   var current_reg = this.props.CurrentVector.features.find(
    //     (obj) => obj.properties.mandal_name === e
    //   );

    // } else {
    //   var current_reg = this.props.CurrentVector.features.find(
    //     (obj) => obj.properties.district_name === e
    //   );
    // }
    this.props.setShapeId(selected_region.uid);
    this.props.isShapeSelected(true);
    this.setState({
      ...this.state,
      shapeSelected: true,
      selectedShapeName: selected_region.uid,
    });
    if (this.state.shapeSelected === true && selected_region === undefined) {
      return this.closeSearchRegion();
    }
    if (!this.mapRef.current) return;

    const map = this.mapRef.current.getMap();

    map.flyTo({
      center: [selected_region.centerPoint[0], selected_region.centerPoint[1]],
      zoom: 8,
      speed: 1.2, // optional: controls animation speed
      curve: 1.42, // optional: smoothness of the animation curve
      essential: true, // this animation is essential to user experience
    });
    this.setState(
      () => {
      }
    );
  }
  clearPolygonSelection = () => {
    this.props.setplace('');
    this.props.isShapeSelected(false);
    this.props.setShapeId('');
    this.setState({
      shapeSelected: false,
      selectedShapeName: null,
    });
    if (!this.mapRef.current) return;
    const map = this.mapRef.current.getMap();
    map.setFilter('vector-fill-highlight', ['==', 'uid', '']);
    map.setFilter('vector-line-highlight', ['==', 'uid', '']);
    map.flyTo({
      center: [Config.longnew, Config.latnew],
      zoom: 6,
      speed: 1.2,
      curve: 1.42,
      essential: true,
    });
  };

  closeSearchRegion() {
    this.setState({
      ...this.state,
      latnew: Config.latnew,
      longnew: Config.longnew,
      mapZoom: 7.5,
      layerUID: '',
      shapeSelected: false,
    });
    this.props.setplace('');
    this.props.isShapeSelected(false);
  }
  updateMapZoom = (newZoomValue) => {
    this.setState({
      latnew: Config.latnew,
      longnew: Config.longnew,
      mapZoom: newZoomValue,
    });
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
      //  this.changeVectorLoader(Config.loaderlatvector, Config.loaderlngvector);
      getlatestdate(this.props.LayerDescription.id).then(async (json) => {
        var last_updated_date = new Date(json.data);
        var from_dd = String(last_updated_date.getDate()).padStart(2, '0');
        var from_mm = String(last_updated_date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var from_yyyy = last_updated_date.getFullYear();
        var ltdate = from_dd + '-' + from_mm + '-' + from_yyyy;
        const vectorresult =
          process.env.REACT_APP_APIEND_VECTOR.replace(
            'LAYER_DESC_ID',
            this.props.LayerDescription.id
          )
            .replace('CURRENT_BOUNDS', this.props.CurrentRegion)
            .replace('LTDATE', ltdate);

        this.props.setDate(ltdate);
        this.props.setPmtileUrl(vectorresult);
        this.props.setMapKey();
        this.setState({
          updatedDate: ltdate,
        });
      });
    } catch (err) {
      console.log();
    }
    if (this.props.CurrentLayer === 'WH') {
      this.props.setPointVectorUrl('');
      try {
        const res = await axios.get(
          process.env.REACT_APP_APIEND +
            `warehouses?layer_id=` +
            this.props.LayerDescription.id
        );
        this.props.setPointVectorUrl(res.data.data);
      } catch (err) {
        message.error('Failed to connect to server');
      }
    }
    if (this.props.CurrentLayer === 'FIREEV') {
      this.props.setPointVectorUrl('');
      try {
        const response = await axios.get(
          process.env.REACT_APP_APIEND +
            `cropfire?layer_id=` +
            this.props.LayerDescription.id
        );
        // console.log('fireevent', response.data.data);
        this.props.setPointVectorUrl(response.data.data);
      } catch (err) {
        message.error('Failed to connect to server');
      }
    }
  }
  handleDrawCreate = (e) => {
    const feature = e.features[0];
    const newpoints = feature.geometry.coordinates[0];
    const polygon_centroid = centroid(feature);

    this.setState(
      {
        customShape: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                centroid: polygon_centroid.geometry.coordinates, // Centroid coords
              },
              geometry: {
                type: 'Polygon',
                coordinates: [newpoints], // Same as drawn polygon
              },
            },
          ],
        },
      },
      () => {
        this.showDrawer(this.state.customShape);
      }
    );
  };

  handleDrawUpdate = (e) => {
    console.log('Polygon updated:', e.features);
  };

  handleDrawDelete = (e) => {
    console.log('Polygon deleted');
  };

  handleClick = async (e) => {
    const map = this.mapRef?.current?.getMap?.() || this.mapRef?.current;
    if (!map) return;
    const point = e.point;
    const { lat, lng } = e.lngLat;
    if (this.props.CurrentLayer === 'FIREEV' || this.props.CurrentLayer === 'WH') {
    const vectorPointFeatures = map.queryRenderedFeatures(point, {
      layers: ['vector-point-layer'],
    });

    if (vectorPointFeatures.length > 0) {
      const feature = vectorPointFeatures[0];
      const prevFeature = this.props.pointfeature;

      const isSameFeature =
        prevFeature &&
        JSON.stringify(prevFeature.geometry.coordinates) === JSON.stringify(feature.geometry.coordinates) &&
        JSON.stringify(prevFeature.properties) === JSON.stringify(feature.properties);

      if (!isSameFeature) {
        this.props.pointFeature(feature);
        this.showDrawer();
      }
    }
    }
    if (
      this.props.currentLayerType === 'Raster' &&
      this.props.CurrentRegion !== 'CUSTOM'
    ) {
      this.setState({
        currentLatlon: [e.lngLat.lat, e.lngLat.lng],
        // pixelloader: false,
        mkPosition: [e.lngLat.lng, e.lngLat.lat],
      });
      this.props.showLoader(true);
      try {
        const values = await locationValues(
          this.props.rasterUrl,
          { latitude: e.lngLat.lat, longitude: e.lngLat.lng },
          e.target.getZoom()
        );
        const address = await this.reverseGeocodeHandler(
          e.lngLat.lat,
          e.lngLat.lng
        );
        // console.log('address', address);

        if (!values || (Array.isArray(values) && values.length === 0)) return;

        localStorage.setItem(
          'location',
          JSON.stringify([lat, lng])
        );

        const testHere = {
          values,
          address: address,
        };

        // console.log("pixel values", [e.lngLat.lat, e.lngLat.lng]);
        this.props.setmarkerlatlng([lat, lng]);
        this.props.setPixelValue(values);
        // this.props.setlatlon([lat, lng]);
        this.childComponentRef.current.handleDrawerClick(testHere);

       
        this.props.showLoader(false);
        if (!Number.isNaN(values[0])) {
          this.showDrawer();
          this.setState({
          currentLatlon: [e.lngLat.lat, e.lngLat.lng],
          // pixelloader: false,
        });
        }
      } catch (error) {
        // console.error("Error on raster click:", error);
      }
    }

    // Handle Vector Layer Click
    else if (this.props.currentLayerType === 'Vector') {
      try {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['vector-fill'],
        });

        if (!features || features.length === 0) {
          return;
        }

        const selectedFeature = features[0];

        if (
          selectedFeature.geometry.type === 'Polygon' ||
          selectedFeature.geometry.type === 'MultiPolygon'
        ) {
        }

        if (selectedFeature.properties) {
        }
        this.childComponentRef.current.handleDrawerClick(selectedFeature);
        this.showDrawer();
      } catch (error) {
        console.error('Error querying vector features:', error);
      }
    }
  };

  componentDidMount() {
    // this.mapInstance.leafletElement.on('zoomend', this.handleZoomEnd);
    this.updateDimensions();
    // this.map = this.mapInstance.leafletElement;
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

  generateColorRamp = (colors, min, max) => {
    const steps = colors.length;
    const stepSize = (max - min) / (steps - 1);
    if (
      this.props.CurrentLayer === 'DPPD' ||
      this.props.CurrentLayer === 'NO2_DPPD' ||
      this.props.CurrentLayer === 'PM25_DPPD'
    ) {
      const expression = ['interpolate', ['linear'], ['get', 'Slope Score']];
      for (let i = 0; i < steps; i++) {
        const value = min + i * stepSize;
        expression.push(value);
        expression.push(colors[i]);
      }
      return expression;
    } else if (
      this.props.CurrentLayer === 'NDVI_DPPD' ||
      this.props.CurrentLayer === 'NDWI_DPPD' ||
      this.props.CurrentLayer === 'LST_DPPD' ||
      this.props.CurrentLayer === 'LAI_DPPD'
    ) {
      const expression = ['interpolate', ['linear'], ['get', 'DPPD score']];
      for (let i = 0; i < steps; i++) {
        const value = min + i * stepSize;
        expression.push(value);
        expression.push(colors[i]);
      }
      return expression;
    } else {
      const expression = ['interpolate', ['linear'], ['get', 'mean']];
      for (let i = 0; i < steps; i++) {
        const value = min + i * stepSize;
        expression.push(value);
        expression.push(colors[i]);
      }
      return expression;
    }
  };
  updateDimensions = () => {
    if (window.innerWidth <= 480) {
      this.setState({
        mapZoom: 4.5,
        mobile: true,
      });
    } else {
      this.setState({
        mapZoom: 6,
        mobile: false,
      });
    }
  };
  componentDidUpdate(prevProps) {
    const pmtilesProtocol = new Protocol();
    maplibregl.addProtocol('pmtiles', pmtilesProtocol.tile)
    if (
      (this.props.CurrentRegion === "Mandal" || this.props.CurrentRegion === "DISTRICT") &&
      this.props.CurrentRegion === prevProps.CurrentRegion
    ) {
      this.disableDrawTool();
    }
  }
  render() {
    if (this.props.showDrawer === false) {
      this.setState({
        mkPosition: [0, 0],
      });
      this.props.LatLon([0, 0]);
      this.props.removeMarker([0, 0]);
    }
    const [minVal, maxVal] = DOMAIN_LOOKUP[this.props.CurrentLayer] ?? [-1, 1];
    const domianLookup =
      DOMAIN_LOOKUP;
    const croptype =
      this.props.layerdesc === 207
        ? CROP_TYPE_129
        : this.props.layerdesc === 134
        ? CROP_TYPE_134
        : this.props.layerdesc === 135
        ? CROP_TYPE_135
        : CROP_TYPE_129;
    const effectiveColor =
      this.props.CurrentLayer === 'LULC'
        ? LULC_COLORS
        : this.props.CurrentLayer === 'crop_intensity'
        ? CROP_INTENSITY
        : this.props.CurrentLayer === 'crop_type'
        ? croptype
        : this.props.CurrentLayer === 'crop_land'
        ? CROP_LAND
        : this.props.CurrentLayer === 'crop_stress'
        ? CROP_STRESS
        : (this.props.CurrentLayer === 'SOIL_M_DEV' || this.props.CurrentLayer === 'NDWI_DPPD'|| this.props.CurrentLayer === 'NDVI_DPPD'|| this.props.CurrentLayer === 'LAI_DPPD')?
          this.props.DevvectorColor  : this.props.CurrentLayer === 'LST_DPPD' ? this.props.DevcfvectorColor  : this.props.rasterColor;
    const raster_url = `cog://${this.props.rasterUrl}#color:${JSON.stringify(
      effectiveColor
    )},${minVal},${maxVal},c`;
    return (
      <>
        <Sidebar changecurrentlayer={this.getvector} onClose={this.onClose}>
          <div className="App">
            <div className="header">
              <div className="topnav-left">
                <Row style={{ marginTop: '5px' }}>
                  <Col className="dicra">
                    {' '}
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
                    {this.props.currentLayerType === 'Raster' && (
                      <div
                        style={{
                          marginTop: '6.7%',
                        }}
                      >
                        <SearchPlace
                          className="google-search"
                          searchArea={this.getcustomlocation}
                          updateMapZoom={this.updateMapZoom}
                        />
                      </div>
                    )}

                    {this.props.currentLayerType === 'Vector' && (
                      <Select
                        className="search-region"
                        placeholder="Search"
                        onChange={(e) => {
                          this.searchRegion(e);
                        }}
                        dropdownRender={(menu) => (
                          <>
                            <span
                              style={{ padding: '5px', fontWeight: 'bold' }}
                            >
                              {this.props.CurrentRegion === 'MANDAL'
                                ? 'SUB DISTRICT'
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
                                fontSize: '18px',
                                color: '#fff',
                                background: 'transparent',
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
                  style={{ position: 'relative', left: '3px', top: '3px' }}
                />
              </div>
            ) : (
              <div className="home-btn" onClick={this.resetmapzoom}>
                <img
                  className="home-icon"
                  src={Home}
                  alt=""
                  width="34px"
                  style={{ position: 'relative', left: '3px', top: '3px' }}
                />
              </div>
            )}
            <div>
              <DrawerComp
                ref={this.childComponentRef}
                latlong={this.state.currentLatlon}
                // pixelloader={this.state.pixelloader}
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
                      {' '}
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
                                : this.props.CurrentLayer === 'SOIL_M_DEV' ||
                                  this.props.CurrentLayer === 'LAI_DPPD'
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
              ref={this.mapRef}
              style={{ width: '100%', height: '100vh' }}
              mapLib={maplibregl}
              minZoom={5.5}
              initialViewState={{
                longitude: this.state.longnew,
                latitude: this.state.latnew,
                zoom: this.state.mapZoom,
              }}
              onMouseMove={this.handleMouseMove}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.handleClick}
              onLoad={(event) => {
                const map = event.target;
                
                map.on('mouseenter', 'clusters', () => {
                  map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', 'clusters', () => {
                  map.getCanvas().style.cursor = '';
                });
                 map.on('mouseenter', 'vector-point-layer', () => {
                  map.getCanvas().style.cursor = 'pointer';
                });
                map.on('click', 'vector-point-layer', () => {
                  map.getCanvas().style.cursor = '';
                });
                map.on('mouseenter', 'vector-fill', () => {
                    map.getCanvas().style.cursor = 'pointer';
                  });
                map.on('mouseleave', 'vector-fill', () => {
                    map.getCanvas().style.cursor = '';
                }); 
                map.on('mouseleave', 'vector-point-layer', () => {
                  map.getCanvas().style.cursor = '';
                });
                map.on('mouseenter', 'cog-layer', () => {
                  map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', 'cog-layer', () => {
                  map.getCanvas().style.cursor = '';
                });

              }}
              mapStyle={{
                version: 8,
                sources: {
                  cartoDark: {
                    type: 'raster',
                    // tiles: [this.props.currentbasemapurl],
                    tiles: this.props.currentbasemapurl,
                    tileSize: 256,
                    attribution: this.state.attribution,
                  },
                },
                layers: [
                  {
                    id: 'cartoDarkLayer',
                    type: 'raster',
                    source: 'cartoDark',
                    minzoom: 0,
                    maxzoom: 22,
                  },
                ],
              }}
              interactiveLayerIds={[
                'cog-layer',
                'clusters',
                'vector-point-layer',
              ]}
            >
              {this.props.LatLon[0] !== 0 &&
                this.props.LatLon[1] !== 0 &&
                this.props.currentLayerType === 'Raster' && (
                  <Marker
                    longitude={this.props.LatLon[1]}
                    latitude={this.props.LatLon[0]}
                    anchor="bottom"
                  >
                    <img
                      alt="marker"
                      src={locIcon}
                      style={{ width: '30px', height: '30px' }}
                    />
                  </Marker>
                )}

              <NavigationControl
                position="bottom-right"
                showCompass={false}
                showZoom={true}
              />

              
              {this.props.CurrentLayer === 'FIREEV' ||
              this.props.CurrentLayer === 'WH' ? (
                <>
                <Source
                id="vector_point"
                type="vector"
                url={
                  this.props.showraster === false
                    ? ''
                    : `pmtiles://${this.props.pointvectorurl}`
                }
              />
              <Layer
                  id="vector-point-layer"
                  type="circle"
                  source="vector_point"
                  source-layer="zcta"
                  paint={{
                    'circle-radius': 4,
                    'circle-color': '#ff0000',
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': 1,
                  }}
                />
                 <Layer
                id="vector-outline"
                type="line"
                source="vector_source"
                source-layer="zcta"
                paint={{
                  'line-color': '#d65522',
                  'line-width': 0.6,
                }}
              />
                </>
                
              ) : null}
             
              {this.props.currentLayerType === 'Vector' && (
                <>
                 <Source
                id="vector_source"
                type="vector"
                url={
                  this.props.showraster === false
                    ? ''
                    : `pmtiles://${this.props.getPmtileUrl}`
                }
                />

                  {this.props.setshapeId && (
                    <Layer
                      id={`vector-${this.props.setshapeId}`}
                      type="line"
                      source="vector_source"
                      source-layer="zcta"
                      filter={['==', ['get', 'uid'], this.props.setshapeId]}
                      paint={{
                        'line-color': '#2bf527',
                        'line-width': 5,
                        'line-opacity': 1,
                      }}
                    />
                  )}
                  <Layer
                    id="vector-fill"
                    type="fill"
                    source="vector_source"
                    source-layer="zcta"
                    paint={{
                      'fill-color': this.generateColorRamp(
                        this.props.CurrentLayer === 'DPPD' ||
                        this.props.CurrentLayer === 'LST_DPPD'
                          ? this.props.DevcfvectorColor
                          : this.props.CurrentLayer === 'SOIL_M_DEV' ||
                            this.props.CurrentLayer === 'NDVI_DPPD' ||
                            this.props.CurrentLayer === 'NDWI_DPPD' ||
                            this.props.CurrentLayer === 'NO2_DPPD' ||
                            this.props.CurrentLayer === 'PM25_DPPD' ||
                            this.props.CurrentLayer === 'LAI_DPPD'
                          ? this.props.DevvectorColor
                          : this.props.vectorColor,
                        ...(domianLookup[this.props.CurrentLayer] ?? [-1, 1])
                      ),
                      'fill-outline-color': '#d65522',
                      'fill-opacity':
                        this.props.CurrentLayer === 'FIREEV' ||
                        this.props.CurrentLayer === 'WH'
                          ? 0
                          : 1,
                    }}
                  />
                </>
              )}

              {this.props.currentLayerType === 'Raster' && (
                <Source
                  id="cogSource"
                  type="raster"
                  url={this.props.showraster === false ? '' : raster_url}
                  tileSize={256}
                >
                  <Layer id="cog-layer" type="raster" />
                </Source>
              )}
             {this.props.currentLayerType === 'Raster' && (
              <>
               <Source
                id="vector_source"
                type="vector"
                url={
                  this.props.showraster === false
                    ? ''
                    : `pmtiles://${this.props.getPmtileUrl}`
                }
              />

              <Layer
                id="vector-outline"
                type="line"
                source="vector_source"
                source-layer="zcta"
                paint={{
                  'line-color': '#d65522',
                  'line-width': 0.6,
                }}
              />
              </>
               )}

               { this.props.CurrentLayer === 'FIREEV' ||
               this.props.CurrentLayer === 'WH'&& (
              <>
               <Source
                id="vector_source"
                type="vector"
                url={
                  this.props.showraster === false
                    ? ''
                    : `pmtiles://${this.props.getPmtileUrl}`
                }
              />

              <Layer
                id="vector-outline"
                type="line"
                source="vector_source"
                source-layer="zcta"
                paint={{
                  'line-color': '#d65522',
                  'line-width': 0.6,
                }}
              />
              </>
              )}
              <Source
                id="india-boundary"
                type="vector"
                url={ this.props.CurrentRegion == 'MANDAL'|| this.props.CurrentRegion == 'DISTRICT' ? 
                `pmtiles://https://dicratiler.blob.core.windows.net/dicra-dev/parameters/Boundary/india_boundary.pmtiles` : ''
                }
              />

               <Layer
                id="vector-boundary"
                type="line"
                source="india-boundary"
                source-layer="zcta"
                paint={{
                  'line-color': '#d65522',
                  'line-width': 0.6,
                }}
              />
              
            </Map>
          </div>
          <BottomNav changecurrentlayer={this.getvector} />
        </Sidebar>
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MaplibreComponent);
