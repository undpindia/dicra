import React, { useEffect, useState, Component } from "react";
import { Radio, Drawer, message, Menu, Dropdown } from "antd";
import { geoMercator } from "d3-geo";
import { BiX } from "react-icons/bi";
import {
  FormGroup,
  Input,
  Col,
  Row,
  Card,
  CardBody,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
} from "reactstrap";
import {
  gettrend,
  getzstat,
  getlulcpercentage,
  getpointtrend,
  getlayerpercentage,
  getcfpoint,
  getcftrend,
  getpixel,
} from "../../../../assets/api/apiService";
import Config from "../../Config/config";
import Loader from "../../../../assets/images/loader.gif";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { DownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import Chart from "react-apexcharts";
import ValueTable from "../../ValueTable";
import CategoryName from "../../CategoryName";

const geojsonArea = require("@mapbox/geojson-area");
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
    reverseGeocode: ReduxProps.setReversedGeocode,
    removeMarker: ReduxProps.markerLatLon,
    currentdate: ReduxProps.setCurrentDate,
    showdrawer: ReduxProps.ShowDrawer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showDrawer: (val) => dispatch({ type: "SHOWDRAWER", payload: val }),
    removeMarker: (marker) =>
      dispatch({ type: "REMOVE_MARKER", payload: marker }),
    setLulcPerc: (lulc) =>
      dispatch({ type: "SETLULCPERCENTAGE", payload: lulc }),
    setCropPerc: (crop) =>
      dispatch({ type: "SETCROPPERCENTAGE", payload: crop }),
  };
};

class DrawerComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      current_Details: [],
      customShape: [],
      updatedDate: "",
      loaderpercentage: true,
      renderComponent: false,
      cfpoint: null,
      meanvalue: '',
      options: {
        colors: ["#d65522"],
        chart: {
          id: "trendChart",
          type: "area",
          height: 140,
          width: 316,
          zoom: {
            autoScaleYaxis: true,
          },
          toolbar: {
            show: false,
            export: {
              csv: {
                headerCategory: "Datetime",
              },
              svg: {
                show: false,
              },
              png: {
                show: false,
              },
            },
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
          style: "hollow",
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
              show: false,
            },
          },
        },
        yaxis: {
          show: true,
          tickAmount: 3,
          min: -1.0,
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
        },
        xaxis: {
          type: "datetime",
          labels: {
            format: "MMM yyyy",
            style: {
              colors: "#90989b",
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
        },
        fill: {
          colors: ["#1A73E8"],
        },
        stroke: {
          show: true,
          curve: "straight",
          lineCap: "butt",
          colors: undefined,
          width: 1,
          dashArray: 0,
        },
      },
      series: [
        {
          name: "Trend",
          data: [
            { x: 1615362718000, y: 77.95 },
            { x: 1615363619000, y: 90.34 },
            { x: 1615364518000, y: 24.18 },
            { x: 1615365418000, y: 21.05 },
            { x: 1615366318000, y: 71.0 },
            { x: 1615367218000, y: 80.95 },
          ],
        },
      ],
      loader: false,
      percentage: [],
      loaderpercentage: true,
      selectedLULCcategory: "Water",
      selectedCropIntcategory: "Single Crop",
      selectedCropLandcategory: "Cropland",
      selectedCropTypecategory: "Irrigated-DC-rice-rice",
      selectedCropStresscategory: "No crop stress",
      LULCtrend: [],
      croptrend: [],
      customStatus: false,
      currentCharttime: "6mon",
      customLULC: [],
      LULCclasses: [],
      cropclasses: [],
      currentLatlon: [0, 0],
      pixelloader: false,
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
    };
    this.handleDrawerClick = this.handleDrawerClick.bind(this);
    this.onClickCategory = this.onClickCategory.bind(this);
    this.onClickCropCategory = this.onClickCropCategory.bind(this);
  }
  handleDrawerClick(data) {
    this.setState({
      visible: true,
      current_Details: data,
    });
    if (this.props.CurrentRegion == "CUSTOM") {
      if (data === undefined) {
        console.log();
      } else if (this.props.CurrentLayer === "LULC") {
        var area = geojsonArea.geometry(data.features[0].geometry) / 1000000;
        this.setState(
          {
            visible: true,
            area: area.toFixed(2),
            centroid: data.features[0].properties.centroid,
            customShape: data,
          },
          () => {
            // this.getlulcperc(e.sourceTarget.feature);
            this.getlulcperc(data.features[0]);
          }
        );
      } else if (this.props.CurrentLayer === "FIREEV") {
        var area = geojsonArea.geometry(data.features[0].geometry) / 1000000;
        this.setState(
          {
            visible: true,
            area: area.toFixed(2),
            centroid: data.features[0].properties.centroid,
            customShape: data,
          },
          () => {
            // this.getlulcperc(e.sourceTarget.feature);
            this.getcropfirepoint(data.features[0]);
            this.gettrendchart(data.features[0]);
          }
        );
      } else if (
        this.props.CurrentLayer === "crop_intensity" ||
        this.props.CurrentLayer === "crop_land" ||
        this.props.CurrentLayer === "crop_type" ||
        this.props.CurrentLayer === "crop_stress"
      ) {
        var area = geojsonArea.geometry(data.features[0].geometry) / 1000000;
        this.setState(
          {
            visible: true,
            area: area.toFixed(2),
            centroid: data.features[0].properties.centroid,
            customShape: data,
          },
          () => {
            // this.getlulcperc(e.sourceTarget.feature);
            this.getlayerperc(data.features[0]);
          }
        );
      } else {
        var area = geojsonArea.geometry(data.features[0].geometry) / 1000000;
        this.setState({
          visible: true,
          area: area.toFixed(2),
          centroid: data.features[0].properties.centroid,
          customShape: data,
        });
        let current_date;
        let from_date;
        current_date = new Date();
        from_date = new Date();
        from_date = from_date.setFullYear(from_date.getFullYear() - 1);
        from_date = new Date(from_date);
        let from_dd = String(from_date.getDate()).padStart(2, "0");
        let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
        let from_yyyy = from_date.getFullYear();
        let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
        let to_dd = String(current_date.getDate()).padStart(2, "0");
        let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
        let to_yyyy = current_date.getFullYear();
        let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.gettrendchart(data.features[0]);
          }
        );
        this.getCustomlayerDetails(data);
      }
    } else if (this.props.CurrentRegion == "MANDAL") {
      if (
        (this.props.CurrentLayer === "NDVI_DPPD" ||
          this.props.CurrentLayer === "SOIL_M_DEV" ||
          this.props.CurrentLayer === "NO2_DPPD" ||
          this.props.CurrentLayer === "LAI_DPPD" ||
          this.props.CurrentLayer === "PM25_DPPD" ||
          this.props.CurrentLayer === "LST_DPPD" ||
          this.props.CurrentLayer === "NDWI_DPPD" ||
          this.props.CurrentLayer === "DPPD") &&
        this.props.currentLayerType === "Vector"
      ) {
        if (
          (this.props.CurrentLayer === "NDVI_DPPD" ||
            this.props.CurrentLayer === "LAI_DPPD" ||
            this.props.CurrentLayer === "LST_DPPD" ||
            this.props.CurrentLayer === "NDWI_DPPD") &&
          this.props.currentLayerType === "Vector"
        ) {
          this.setState({
            meanvalue:
              data.sourceTarget.feature.properties["DPPD score"].toFixed(5),
          });
        } else if (
          this.props.CurrentLayer === "SOIL_M_DEV" &&
          this.props.currentLayerType === "Vector"
        ) {
          this.setState({
            meanvalue: data.sourceTarget.feature.properties.zonalstat.mean,
            centroid: data.sourceTarget.feature.centroid,
            zonalstat: data.sourceTarget.feature.properties.zonalstat,
            minvalue: data.sourceTarget.feature.properties.zonalstat.min,
            maxvalue: data.sourceTarget.feature.properties.zonalstat.max,
          });
          this.setState({
            meanvalue: this.state.meanvalue.toFixed(5),
          });
        } else if (
          (this.props.CurrentLayer === "NO2_DPPD" ||
            this.props.CurrentLayer === "PM25_DPPD" ||
            this.props.CurrentLayer === "DPPD") &&
          this.props.currentLayerType === "Vector"
        ) {
          if (
            this.props.CurrentLayer === "NO2_DPPD" ||
            this.props.CurrentLayer === "PM25_DPPD"
          ) {
            this.setState({
              meanvalue:
                data.sourceTarget.feature.properties["Slope Score"].toFixed(2),
            });
          } else {
            this.setState({
              meanvalue:
                data.sourceTarget.feature.properties["Slope Score"].toFixed(5),
            });
          }
        }
        this.setState({
          visible: true,
          area: data.sourceTarget.feature.properties.area,
          distname: data.sourceTarget.feature.properties.mandal_name,
          centroid: data.sourceTarget.feature.properties.centroid,
          customShape: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  centroid: data.layer.feature.properties.centroid,
                },
                geometry: data.layer.feature.geometry,
              },
            ],
          },
        });
      } else if (
        this.props.CurrentLayer === "Total Precipitation - Monthly" ||
        this.props.CurrentLayer === "NO2" &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState({
          visible: true,
          area: data.layer.feature.properties.area,
          distname: data.layer.feature.properties.district_name,
          zonalstat: data.layer.feature.properties.zonalstat,
          minvalue: data.layer.feature.properties.zonalstat.min.toFixed(6),
          maxvalue: data.layer.feature.properties.zonalstat.max.toFixed(6),
          meanvalue: data.layer.feature.properties.zonalstat.mean.toFixed(6),
          centroid: data.layer.feature.properties.centroid,
          customShape: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  centroid: data.layer.feature.properties.centroid,
                },
                geometry: data.layer.feature.geometry,
              },
            ],
          },
        });
      } else if (
        this.props.CurrentLayer === "POPULATION" &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState({
          visible: true,
          area: data.layer.feature.properties.area,
          distname: data.layer.feature.properties.district_name,
          zonalstat: data.layer.feature.properties.zonalstat,
          minvalue: data.layer.feature.properties.zonalstat.min.toFixed(2),
          maxvalue: data.layer.feature.properties.zonalstat.max.toFixed(2),
          meanvalue: parseInt(data.layer.feature.properties.zonalstat.sum),
          centroid: data.layer.feature.properties.centroid,
          customShape: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  centroid: data.layer.feature.properties.centroid,
                },
                geometry: data.layer.feature.geometry,
              },
            ],
          },
        });
      } else if (
        this.props.CurrentLayer === "LULC" &&
        (this.props.currentLayerType === "Vector" ||
          this.props.currentLayerType === "Raster")
      ) {
        this.setState(
          {
            visible: true,
            area: data.layer.feature.properties.area.toFixed(2),
            distname: data.layer.feature.properties.district_name,
            centroid: data.layer.feature.properties.centroid,
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          },
          () => {
            this.getlulcperc(data.sourceTarget.feature);
          }
        );
      } else if (
        this.props.CurrentLayer === "FIREEV" &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState(
          {
            visible: true,
            area: data.layer.feature.properties.area.toFixed(2),
            distname: data.layer.feature.properties.district_name,
            centroid: data.layer.feature.properties.centroid,
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          },
          () => {
            this.getcropfirepoint(data.sourceTarget.feature);
          }
        );
      } else if (
        (this.props.CurrentLayer === "crop_intensity" ||
          this.props.CurrentLayer === "crop_land" ||
          this.props.CurrentLayer === "crop_type" ||
          this.props.CurrentLayer === "crop_stress") &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState(
          {
            visible: true,
            area: data.layer.feature.properties.area.toFixed(2),
            distname: data.layer.feature.properties.district_name,
            centroid: data.layer.feature.properties.centroid,
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          },
          () => {
            this.getlayerperc(data.sourceTarget.feature);
          }
        );
      } else {
        if (this.props.currentLayerType === "Raster") {
        } else if (this.props.currentLayerType === "Vector") {
          this.setState({
            visible: true,
            area: data.layer.feature.properties.area.toFixed(2),
            distname: data.layer.feature.properties.mandal_name,
            zonalstat: data.layer.feature.properties.zonalstat,
            minvalue: data.layer.feature.properties.zonalstat.min.toFixed(2),
            maxvalue: data.layer.feature.properties.zonalstat.max.toFixed(2),
            meanvalue: data.layer.feature.properties.zonalstat.mean.toFixed(2),
            centroid: data.layer.feature.properties.centroid,
            popsum: parseInt(data.layer.feature.properties.zonalstat.sum),
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          });
        }
      }
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 1);
      from_date = new Date(from_date);
      let from_dd = String(from_date.getDate()).padStart(2, "0");
      let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let from_yyyy = from_date.getFullYear();
      let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      let to_dd = String(current_date.getDate()).padStart(2, "0");
      let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let to_yyyy = current_date.getFullYear();
      let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      if (this.props.currentLayerType === "Raster") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.getpointtrendchart();
          }
        );
      } else if (this.props.currentLayerType === "Vector") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.gettrendchart(data.sourceTarget.feature);
          }
        );
      }
    } else if (this.props.CurrentRegion == "DISTRICT") {
      if (
        (this.props.CurrentLayer === "NDVI_DPPD" ||
          this.props.CurrentLayer === "SOIL_M_DEV" ||
          this.props.CurrentLayer === "NO2_DPPD" ||
          this.props.CurrentLayer === "LAI_DPPD" ||
          this.props.CurrentLayer === "PM25_DPPD" ||
          this.props.CurrentLayer === "LST_DPPD" ||
          this.props.CurrentLayer === "NDWI_DPPD" ||
          this.props.CurrentLayer === "DPPD") &&
        this.props.currentLayerType === "Vector"
      ) {
        if (
          (this.props.CurrentLayer === "NDVI_DPPD" ||
            this.props.CurrentLayer === "LAI_DPPD" ||
            this.props.CurrentLayer === "LST_DPPD" ||
            this.props.CurrentLayer === "NDWI_DPPD") &&
          this.props.currentLayerType === "Vector"
        ) {
          this.setState({
            meanvalue:
              data.sourceTarget.feature.properties["DPPD score"].toFixed(5),
          });
        } else if (this.props.CurrentLayer === "SOIL_M_DEV") {
          this.setState({
            meanvalue: data.sourceTarget.feature.properties.zonalstat.mean,
            centroid: data.sourceTarget.feature.centroid,
            zonalstat: data.sourceTarget.feature.properties.zonalstat,
            minvalue: data.sourceTarget.feature.properties.zonalstat.min,
            maxvalue: data.sourceTarget.feature.properties.zonalstat.max,
          });
          this.setState({
            meanvalue: parseFloat(this.state.meanvalue).toFixed(5),
          });
        } else if (
          (this.props.CurrentLayer === "NO2_DPPD" ||
            this.props.CurrentLayer === "PM25_DPPD" ||
            this.props.CurrentLayer === "DPPD") &&
          this.props.currentLayerType === "Vector"
        ) {
          if (
            this.props.CurrentLayer === "NO2_DPPD" ||
            this.props.CurrentLayer === "PM25_DPPD"
          ) {
            this.setState({
              meanvalue:
                data.sourceTarget.feature.properties["Slope Score"].toFixed(2),
            });
          } else {
            this.setState({
              meanvalue:
                data.sourceTarget.feature.properties["Slope Score"].toFixed(5),
            });
          }
        }
        this.setState({
          visible: true,
          area: data.sourceTarget.feature.properties.area,
          distname: data.sourceTarget.feature.properties.district_name,
          centroid: data.sourceTarget.feature.properties.centroid,
          customShape: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  centroid: data.layer.feature.properties.centroid,
                },
                geometry: data.layer.feature.geometry,
              },
            ],
          },
        });
      } else if (
        this.props.CurrentLayer === "Total Precipitation - Monthly" ||
        this.props.CurrentLayer === "NO2" &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState({
          visible: true,
          area: data.layer.feature.properties.area,
          distname: data.layer.feature.properties.district_name,
          zonalstat: data.layer.feature.properties.zonalstat,
          minvalue: data.layer.feature.properties.zonalstat.min.toFixed(6),
          maxvalue: data.layer.feature.properties.zonalstat.max.toFixed(6),
          meanvalue: data.layer.feature.properties.zonalstat.mean.toFixed(6),
          centroid: data.layer.feature.properties.centroid,
          customShape: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  centroid: data.layer.feature.properties.centroid,
                },
                geometry: data.layer.feature.geometry,
              },
            ],
          },
        });
      } else if (
        this.props.CurrentLayer === "POPULATION" &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState({
          visible: true,
          area: data.layer.feature.properties.area,
          distname: data.layer.feature.properties.district_name,
          zonalstat: data.layer.feature.properties.zonalstat,
          minvalue: data.layer.feature.properties.zonalstat.min.toFixed(2),
          maxvalue: data.layer.feature.properties.zonalstat.max.toFixed(2),
          meanvalue: parseInt(data.layer.feature.properties.zonalstat.sum),
          centroid: data.layer.feature.properties.centroid,
          customShape: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  centroid: data.layer.feature.properties.centroid,
                },
                geometry: data.layer.feature.geometry,
              },
            ],
          },
        });
      } else if (
        this.props.CurrentLayer === "LULC" &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState(
          {
            visible: true,
            area: data.layer.feature.properties.area.toFixed(2),
            distname: data.layer.feature.properties.district_name,
            centroid: data.layer.feature.properties.centroid,
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          },
          () => {
            this.getlulcperc(data.sourceTarget.feature);
          }
        );
      } else if (
        this.props.CurrentLayer === "FIREEV" &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState(
          {
            visible: true,
            area: data.layer.feature.properties.area.toFixed(2),
            distname: data.layer.feature.properties.district_name,
            centroid: data.layer.feature.properties.centroid,
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          },
          () => {
            this.getcropfirepoint(data.sourceTarget.feature);
          }
        );
      } else if (
        (this.props.CurrentLayer === "crop_intensity" ||
          this.props.CurrentLayer === "crop_land" ||
          this.props.CurrentLayer === "crop_type" ||
          this.props.CurrentLayer === "crop_stress") &&
        this.props.currentLayerType === "Vector"
      ) {
        this.setState(
          {
            visible: true,
            area: data.layer.feature.properties.area.toFixed(2),
            distname: data.layer.feature.properties.district_name,
            centroid: data.layer.feature.properties.centroid,
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          },
          () => {
            this.getlayerperc(data.sourceTarget.feature);
          }
        );
      } else {
        if (this.props.currentLayerType === "Raster") {
        } else if (this.props.currentLayerType === "Vector") {
          this.setState({
            visible: true,
            area: data.layer.feature.properties.area,
            distname: data.layer.feature.properties.district_name,
            zonalstat: data.layer.feature.properties.zonalstat,
            minvalue: data.layer.feature.properties.zonalstat.min.toFixed(2),
            maxvalue: data.layer.feature.properties.zonalstat.max.toFixed(2),
            meanvalue: data.layer.feature.properties.zonalstat.mean.toFixed(2),
            popsum: parseInt(data.layer.feature.properties.zonalstat.sum),
            centroid: data.layer.feature.properties.centroid,
            customShape: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    centroid: data.layer.feature.properties.centroid,
                  },
                  geometry: data.layer.feature.geometry,
                },
              ],
            },
          });
        }
      }

      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 1);
      from_date = new Date(from_date);
      let from_dd = String(from_date.getDate()).padStart(2, "0");
      let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let from_yyyy = from_date.getFullYear();
      let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      let to_dd = String(current_date.getDate()).padStart(2, "0");
      let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let to_yyyy = current_date.getFullYear();
      let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      // console.log("currentregion", this.props.CurrentRegion)
      if (this.props.currentLayerType === "Raster") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.getpointtrendchart();
          }
        );
      } else if (this.props.currentLayerType === "Vector") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.gettrendchart(data.sourceTarget.feature);
          }
        );
      }
    }
  }
  settimerange(daterange) {
    if (daterange === "1Year") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 1);
      from_date = new Date(from_date);
      let from_dd = String(from_date.getDate()).padStart(2, "0");
      let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let from_yyyy = from_date.getFullYear();
      let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      let to_dd = String(current_date.getDate()).padStart(2, "0");
      let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let to_yyyy = current_date.getFullYear();
      let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      if (this.props.CurrentRegion === "CUSTOM") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.gettrendchart(this.state.current_Details.features[0]);
          }
        );
      } else if (this.props.currentLayerType === "Raster") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.getpointtrendchart();
          }
        );
      } else {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.gettrendchart(this.state.current_Details.layer.feature);
          }
        );
      }
    } else if (daterange === "3Year") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 3);
      from_date = new Date(from_date);
      let from_dd = String(from_date.getDate()).padStart(2, "0");
      let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let from_yyyy = from_date.getFullYear();
      let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      let to_dd = String(current_date.getDate()).padStart(2, "0");
      let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let to_yyyy = current_date.getFullYear();
      let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      if (this.props.CurrentRegion === "CUSTOM") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "3year",
          },
          () => {
            this.gettrendchart(this.state.current_Details.features[0]);
          }
        );
      } else if (this.props.currentLayerType === "Raster") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "3year",
          },
          () => {
            this.getpointtrendchart();
          }
        );
      } else {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "3year",
          },
          () => {
            this.gettrendchart(this.state.current_Details.layer.feature);
          }
        );
      }
    } else if (daterange === "5Year") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 5);
      from_date = new Date(from_date);
      let from_dd = String(from_date.getDate()).padStart(2, "0");
      let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let from_yyyy = from_date.getFullYear();
      let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      let to_dd = String(current_date.getDate()).padStart(2, "0");
      let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let to_yyyy = current_date.getFullYear();
      let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;

      if (this.props.CurrentRegion === "CUSTOM") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "5year",
          },
          () => {
            // console.log("CURRENT DETAILS", this.state.current_Details)
            // this.gettrendchart(this.state.current_Details.layer.feature);
            this.gettrendchart(this.state.current_Details.features[0]);
          }
        );
      } else if (this.props.currentLayerType === "Raster") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "5year",
          },
          () => {
            this.getpointtrendchart();
          }
        );
      } else {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "5year",
          },
          () => {
            this.gettrendchart(this.state.current_Details.layer.feature);
          }
        );
      }
    }else if (daterange === "10Year") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 10);
      from_date = new Date(from_date);
      let from_dd = String(from_date.getDate()).padStart(2, "0");
      let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let from_yyyy = from_date.getFullYear();
      let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      let to_dd = String(current_date.getDate()).padStart(2, "0");
      let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let to_yyyy = current_date.getFullYear();
      let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      if (this.props.CurrentRegion === "CUSTOM") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "10year",
          },
          () => {
            this.gettrendchart(this.state.current_Details.features[0]);
          }
        );
      } else if (this.props.currentLayerType === "Raster") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "10year",
          },
          () => {
            this.getpointtrendchart();
          }
        );
      } else {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "10year",
          },
          () => {
            this.gettrendchart(this.state.current_Details.layer.feature);
          }
        );
      }
    } 
  }
  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    let dd = String(a.getDate()).padStart(2, "0");
    let mm = String(a.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = a.getFullYear();
    let date = yyyy + "-" + mm + "-" + dd;
    // return time;
    this.setState({
      last_updated: date,
    });
  }
  async getCustomlayerDetails(geojson) {
    // console.log("getcustomlayerdetails", geojson);

    var last_updated_date = new Date(this.props.currentdate);
    var from_dd = String(last_updated_date.getDate()).padStart(2, "0");
    var from_mm = String(last_updated_date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var from_yyyy = last_updated_date.getFullYear();
    var from_date = from_yyyy + "-" + from_mm + "-" + from_dd;
    var currentdate = this.props.currentdate;
    var parts = currentdate.split("-");
    var reversedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    var bodyParams = {
      geojson: geojson.features[0].geometry,
      date: reversedDate,
      layer_id: this.props.LayerDescription.id,
    };
    getzstat(bodyParams)
      .then((json) => {
        let res = json;
        var area = geojsonArea.geometry(geojson.features[0].geometry);
        // console.log("geojson features", result);
        area = area / 1000000;
        this.setState({
          minvalue: parseFloat(res.data.stat.min).toFixed(2),
          maxvalue: parseFloat(res.data.stat.max).toFixed(2),
          meanvalue: parseFloat(res.data.stat.mean).toFixed(2),
        });
      })
      .catch((err) => {
        message.error("Failed to connect to server");
      });
  }
  async getcropfirepoint(e) {
    var shapeparams = e.geometry;
    var bodyParams = {
      geojson: shapeparams,
      startdate: "2021-01-01",
      enddate: "2023-12-31",
      layer_id: this.props.LayerDescription.id
    };
    try {
      const response = await getcfpoint(bodyParams);
      if (response.data[0].code === 200) {
        let res = response.data;
        this.setState({
          meanvalue: res[1].count,
        });
      } else {
        // message.error("Failed to connect to the server");
      }
    } catch (error) {
      // message.error("Failed to connect to the server");
      this.setState({
        meanvalue: '0',
      });
    }
  }
  async getlayerperc(e) {
    this.setState({
      loaderpercentage: true,
    });
    var shapeparams = e.geometry;
    var bodyParams = {
      geojson: shapeparams,
      layer_id: this.props.LayerDescription.id,
      layer_name: this.props.LayerDescription.layer_name,
    };
    getlayerpercentage(bodyParams)
      .then((json) => {
        let res = json.data.data;
        if (json.data.code === 200) {
          const dates = Object.keys(res);
          const latestDate = dates.reduce((latest, date) =>
            date > latest ? date : latest
          );
          const percentage = res[latestDate];
          this.setState(
            {
              percentage,
              loaderpercentage: false,
              croptrend: json.data.trend,
              cropclasses: json.data.classes,
            },
            () => {
              this.props.setCropPerc(percentage);
              this.generatechart(this.state.croptrend[1]);
              this.setState({
                Datanull: false,
                options: {
                  tooltip: {
                    x: {
                      format: "dd MMM yyyy",
                    },
                  },
                  grid: {
                    show: true,
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
                        show: false,
                      },
                    },
                  },
                  yaxis: {
                    show: true,
                    tickAmount: 3,
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
                      text: "COUNT",
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
                      format: "MMM yyyy",
                      style: {
                        colors: "#90989b",
                        cssClass: "apexcharts-xaxis-label",
                      },
                    },
                    title: {
                      text: "Date/Time",
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
                },
              });
            }
          );
        } else {
          message.error("Failed to connect to server");
        }
      })
      .catch((err) => {
        // message.error("Failed to connect to server");
      });
  }
  async getlulcperc(e) {
    this.setState({
      loaderpercentage: true,
    });
    var shapeparams = e.geometry;
    var bodyParams = {
      geojson: shapeparams,
      layer_id: this.props.LayerDescription.id,
    };
    getlulcpercentage(bodyParams)
      .then((json) => {
        let res = json.data.data;
        if (json.data.code === 200) {
          const dates = Object.keys(res);
          const latestDate = dates.reduce((latest, date) =>
            date > latest ? date : latest
          );
          const percentage = res[latestDate];
          this.setState(
            {
              percentage,
              loaderpercentage: false,
              LULCtrend: json.data.trend,
              LULCclasses: json.data.classes,
            },
            () => {
              this.props.setLulcPerc(percentage);
              this.generatechart(this.state.LULCtrend[1]);
              this.setState({
                Datanull: false,
              });
            }
          );
        } else {
          message.error("Failed to connect to server");
        }
      })
      .catch((err) => {
        // message.error("Failed to connect to server");
      });
  }
  async gettrendchart(e) {
    if (
      this.props.CurrentLayer === "LULC" ||
      this.props.CurrentLayer === "crop_intensity" ||
      this.props.CurrentLayer === "crop_land" ||
      this.props.CurrentLayer === "crop_type" ||
      this.props.CurrentLayer === "crop_stress"
    ) {
    }
    this.setState({
      loader: true,
    });
    if (
      this.props.CurrentLayer === "FIREEV" ||
      this.props.CurrentLayer === "DPPD"
    ) {
      var shapeparams = e.geometry;

      var bodyParams = {
        geojson: shapeparams,
        startdate: "2021-01-01",
        enddate: "2023-12-31",
        layer_id: this.props.CurrentLayer === "DPPD" ? 140 : this.props.LayerDescription.id 
      };

      getcftrend(bodyParams)
        .then((json) => {
          let res = json;
          if (res.data.code === 404) {
            this.setState({
              series: [],
              loader: false,
              Datanull: true,
              options: {
                tooltip: {
                  x: {
                    format: "dd MMM yyyy",
                  },
                },
                grid: {
                  show: true,
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
                      show: false,
                    },
                  },
                },
                yaxis: {
                  show: true,
                  tickAmount: 3,
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
                    text: "COUNT",
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
                    format: "MMM yyyy",
                    style: {
                      colors: "#90989b",
                      cssClass: "apexcharts-xaxis-label",
                    },
                  },
                  title: {
                    text: "Date/Time",
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
              },
            });
          } else {
            this.generatechart(res.data.trend);
            this.setState({
              Datanull: false,
              options: {
                tooltip: {
                  x: {
                    format: "dd MMM yyyy",
                  },
                },
                grid: {
                  show: true,
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
                      show: false,
                    },
                  },
                },
                yaxis: {
                  show: true,
                  tickAmount: 3,
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
                    text: "COUNT",
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
                    format: "MMM yyyy",
                    style: {
                      colors: "#90989b",
                      cssClass: "apexcharts-xaxis-label",
                    },
                  },
                  title: {
                    text: "Date/Time",
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
              },
            });
          }
        })
        .catch((err) => {
          // message.error("Failed to connect to server");
          console.log()
        });
    } else {
      var shapeparams = e.geometry;
      if (this.props.CurrentLayer === "NDVI_DPPD") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.ndvi_dppd,
        };
      } else if (this.props.CurrentLayer === "SOIL_M_DEV") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.ssm_dppd,
        };
      } else if (this.props.CurrentLayer === "NO2_DPPD") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.no2_dppd,
        };
      } else if (this.props.CurrentLayer === "LAI_DPPD") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.lai_dppd,
        };
      } else if (this.props.CurrentLayer === "LST_DPPD") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.lst_dppd,
        };
      } else if (this.props.CurrentLayer === "NDWI_DPPD") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.ndwi_dppd,
        };
      } else if (this.props.CurrentLayer === "PM25_DPPD") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.pm25_dppd,
        };
      } else if (this.props.CurrentLayer === "POPULATION") {
        var bodyParams = {
          geojson: shapeparams,
          startdate: "2000-01-01",
          enddate: "2022-04-05",
          layer_id: this.props.LayerDescription.id,
        };
      } else {
        var bodyParams = {
          geojson: shapeparams,
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: this.props.LayerDescription.id,
        };
      }
      gettrend(bodyParams)
        .then((json) => {
          let res = json;
          if (res.data.code === 404) {
            this.setState({
              series: [],
              loader: false,
              Datanull: true,
              options: {
                yaxis: {
                  show: true,
                  tickAmount: 3,
                  min: 0,
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
                    text: " ",
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
              },
            });
          } else {
            this.generatechart(res.data.trend);
            this.setState({
              Datanull: false,
            });
          }
        })
        .catch((err) => {
          message.error("Failed to connect to server");
        });
    }
  }

  async getpointtrendchart(e) {
    if (
      this.props.CurrentLayer === "LULC" ||
      this.props.CurrentLayer === "crop_intensity" ||
      this.props.CurrentLayer === "crop_land" ||
      this.props.CurrentLayer === "crop_type"
    ) {
    }
    this.setState({
      loader: true,
      loaderpercentage: true,
    });
    setTimeout(() => {
      if (this.props.CurrentLayer === "NDVI_DPPD") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.ndvi_dppd,
        };
      } else if (this.props.CurrentLayer === "SOIL_M_DEV") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.ssm_dppd,
        };
      } else if (this.props.CurrentLayer === "NO2_DPPD") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.no2_dppd,
        };
      } else if (this.props.CurrentLayer === "LAI_DPPD") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.lai_dppd,
        };
      } else if (this.props.CurrentLayer === "LST_DPPD") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.lst_dppd,
        };
      } else if (this.props.CurrentLayer === "NDWI_DPPD") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.ndwi_dppd,
        };
      } else if (this.props.CurrentLayer === "PM25_DPPD") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: Config.pm25_dppd,
        };
      } else if (this.props.CurrentLayer === "POPULATION") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: "2000-01-01",
          enddate: "2022-04-05",
          layer_id: this.props.LayerDescription.id,
        };
      } else if (this.props.CurrentLayer === "crop_stress") {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: "2022-01-01",
          enddate: this.state.to_date,
          layer_id: this.props.LayerDescription.id,
        };
      } else {
        var bodyParams = {
          latitude: this.props.latlong[0],
          longitude: this.props.latlong[1],
          startdate: this.state.from_date,
          enddate: this.state.to_date,
          layer_id: this.props.LayerDescription.id,
        };
      }
      getpointtrend(bodyParams)
        .then((json) => {
          let res = json;
          if (res.data.code === 404) {
            this.setState({
              series: [],
              loader: false,
              Datanull: true,
              options: {
                yaxis: {
                  show: true,
                  tickAmount: 3,
                  min: 0,
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
                    text: " ",
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
              },
            });
          } else {
            this.generatechart(res.data.trend);
            this.setState({
              Datanull: false,
            });
          }
        })
        .catch((err) => {
          message.error("Failed to connect to server");
        });
    }, 500);
  }
  generatechart(data) {
    var trendData = {
      name:
        this.props.CurrentLayer === "crop_stress"
          ? "CROP STRESS"
          : this.props.CurrentLayer,
      data: [],
    };

    if (data != null) {
      data.map((item) =>
        trendData.data.push({
          x: item[0],
          y:
            this.props.currentLayer === "POPULATION"
              ? item[1]
              : isNaN(parseFloat(item[1]))
              ? 0
              : parseFloat(item[1]).toFixed(2),
        })
      );
    }
    // console.log("trenddata", trendData);
    this.setState({
      series: [trendData],
      loader: false,
      loaderpercentage: false,
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
              year: "MMM yyyy",
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
  getyaxistext() {
    if (this.props.CurrentLayer === "LAI_DPPD") {
      return "LAI";
    } else if (this.props.CurrentLayer === "NDVI_DPPD") {
      return "NDVI";
    } else if (this.props.CurrentLayer === "NDVI_DPPD") {
      return "NDWI";
    } else if (this.props.CurrentLayer === "SOIL_M_DEV") {
      return "SOILM";
    } else if (this.props.CurrentLayer === "LST_DPPD") {
      return "LST";
    } else if (this.props.CurrentLayer === "PM25_DPPD") {
      return "PM25";
    } else if (this.props.CurrentLayer === "NO2_DPPD") {
      return "NO2";
    } else {
      return this.props.LayerDescription.yaxislabel;
    }
  }

  getxaxistext() {
    if (this.props.CurrentLayer === "LAI_DPPD") {
      return "Date/Time";
    } else if (this.props.CurrentLayer === "NDVI_DPPD") {
      return "Date/Time";
    } else if (this.props.CurrentLayer === "NDWI_DPPD") {
      return "Date/Time";
    } else if (this.props.CurrentLayer === "SOIL_M_DEV") {
      return "Date/Time";
    } else if (this.props.CurrentLayer === "LST_DPPD") {
      return "Date/Time";
    } else if (this.props.CurrentLayer === "PM25_DPPD") {
      return "Date/Time";
    } else if (this.props.CurrentLayer === "NO2_DPPD") {
      return "Date/Time";
    } else {
      return this.props.LayerDescription.xaxislabel;
    }
  }
  onClose = () => {
    this.props.showDrawer(false);
    this.props.removeMarker([0, 0]);
  };
  onClickCategory({ key }) {
    this.setState(
      {
        loader: true,
        selectedLULCcategory: this.state.LULCclasses[key],
      },
      () => {
        this.generatechart(this.state.LULCtrend[Number(key)]);
      }
    );
  }
  onClickCropCategory({ key }) {
    this.setState(
      {
        loader: true,
        selectedCropStresscategory: this.state.cropclasses[key],
      },
      () => {
        this.generatechart(this.state.croptrend[Number(key)]);
      }
    );
  }
  render() {
    var PROJECTION_CONFIG = [];
    var projection = [];
    const width = 800;
    const height = width * 0.9;
    projection = geoMercator().fitExtent(
      [
        [0, 0],
        [width * 0.7, height * 0.7],
      ],
      this.state.customShape
    );
    var scaleValue;
    if (this.state.area < 0.001) {
      scaleValue = 20000000;
    } else if (this.state.area >= 0.001 && this.state.area <= 0.1) {
      scaleValue = 15000000;
    } else if (this.state.area >= 1 && this.state.area <= 50) {
      scaleValue = 250000;
    } else if (this.state.area >= 50 && this.state.area <= 100) {
      scaleValue = 200000;
    } else if (this.state.area >= 100 && this.state.area <= 200) {
      scaleValue = 100000;
    } else if (this.state.area >= 200 && this.state.area <= 300) {
      scaleValue = 80000;
    } else if (this.state.area >= 300 && this.state.area <= 400) {
      scaleValue = 70000;
    } else if (this.state.area >= 400 && this.state.area <= 500) {
      scaleValue = 60000;
    } else if (this.state.area >= 500 && this.state.area <= 800) {
      scaleValue = 50000;
    } else if (this.state.area >= 800 && this.state.area <= 1000) {
      scaleValue = 45000;
    } else if (this.state.area >= 1000 && this.state.area <= 2000) {
      scaleValue = 40000;
    } else if (this.state.area >= 2000 && this.state.area <= 5000) {
      scaleValue = 23000;
    } else if (this.state.area >= 5000 && this.state.area <= 6000) {
      scaleValue = 22000;
    } else if (this.state.area >= 6000 && this.state.area <= 8000) {
      scaleValue = 20000;
    } else if (this.state.area >= 8000 && this.state.area <= 10000) {
      scaleValue = 17500;
    } else if (this.state.area >= 10000 && this.state.area <= 12000) {
      scaleValue = 16000;
    } else if (this.state.area >= 12000 && this.state.area <= 20000) {
      scaleValue = 15000;
    } else if (this.state.area >= 40000 && this.state.area <= 50000) {
      scaleValue = 10000;
    } else {
      scaleValue = 5000;
    }
    PROJECTION_CONFIG = {
      scale: scaleValue,
      center: this.state.centroid,
    };
    const LULCmenu = (
      <Menu onClick={this.onClickCategory}>
        <Menu.Item key="1">Water</Menu.Item>
        <Menu.Item key="2">Trees</Menu.Item>
        <Menu.Item key="4">Flooded vegetation</Menu.Item>
        <Menu.Item key="5">Crops</Menu.Item>
        <Menu.Item key="7">Built Area</Menu.Item>
        <Menu.Item key="8">Bare ground</Menu.Item>
        <Menu.Item key="9">Snow/Ice</Menu.Item>
        <Menu.Item key="10">Clouds</Menu.Item>
        <Menu.Item key="11">Rangeland</Menu.Item>
      </Menu>
    );
    const CropStressmenu = (
      <Menu onClick={this.onClickCropCategory}>
        <Menu.Item key="1">No crop stress</Menu.Item>
        <Menu.Item key="2">Mild stress</Menu.Item>
        <Menu.Item key="3">Moderate stress</Menu.Item>
        <Menu.Item key="4">Severe stress</Menu.Item>
        <Menu.Item key="5">Cropland/cloud</Menu.Item>
        <Menu.Item key="6">Water bodies</Menu.Item>
        <Menu.Item key="7">Other LULC</Menu.Item>
      </Menu>
    );
    return (
      <Drawer
        title=""
        placement="right"
        onClose={this.onClose}
        visible={this.props.showdrawer}
        maskClosable={false}
        mask={false}
        closable={false}
        width={427}
        style={{
          overflowX: "hidden",
          bottom: "0",
          background: "#091B33",
          color: "#FFFFFF",
          top: "65px",
        }}
      >
        <div class="col" style={{ textAlign: "right" }}>
          <BiX className="drawer-close" onClick={this.onClose} />
        </div>
        <Card className="drawer-card">
          <CardBody>
            <Row>
              {this.props.CurrentRegion === "DISTRICT" ||
              this.props.CurrentRegion === "MANDAL" ? (
                this.props.currentLayerType === "Raster" ? (
                  <Col className="col-12">
                    <Row>
                      <p className="drawer-distdisc">
                        {this.props.reverseGeocode}
                      </p>
                    </Row>
                  </Col>
                ) : (
                  <>
                    <Col className="col-8">
                      <Row>
                        <p className="drawer-distdisc">{this.state.distname}</p>
                      </Row>
                      <Row
                        style={
                          this.props.CurrentRegion === "DISTRICT"
                            ? {}
                            : { display: "none" }
                        }
                      >
                        <p className="drawer-distheader">DISTRICT</p>
                      </Row>
                      <Row
                        style={
                          this.props.CurrentRegion === "MANDAL"
                            ? {}
                            : { display: "none" }
                        }
                      >
                        <p className="drawer-distheader">SUB DISTRICT</p>
                      </Row>
                      <Row>
                        <p className="drawer-distdisc">{this.state.area}</p>
                      </Row>
                      <Row>
                        <p className="drawer-distheader">AREA </p>
                      </Row>
                    </Col>
                  </>
                )
              ) : (
                <>
                  <Col className="col-8">
                    <Row>
                      <p className="drawer-distdisc">CUSTOM</p>
                    </Row>
                    <Row>
                      <p className="drawer-distheader">CUSTOM</p>
                    </Row>
                    <Row>
                      <p className="drawer-distdisc">{this.state.area}</p>
                    </Row>
                    <Row>
                      <p className="drawer-distheader">AREA </p>
                    </Row>
                  </Col>
                </>
              )}
              <Col
                className="col-4"
                style={
                  this.props.currentLayerType === "Vector" ||
                  this.props.CurrentRegion === "CUSTOM"
                    ? {}
                    : { display: "none" }
                }
              >
                <div>
                  <ComposableMap
                    projectionConfig={PROJECTION_CONFIG}
                    projection="geoMercator"
                    width={600}
                    height={600}
                  >
                    <Geographies geography={this.state.customShape.features}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#143461"
                            stroke="#fff"
                            strokeWidth="1"
                          />
                        ))
                      }
                    </Geographies>
                  </ComposableMap>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row style={{ marginBottom: "10px" }}>
          <Col>
            <span
              style={{
                fontFamily: "proxima-nova, sans-serif",
                fontSize: "22px",
              }}
            >
              {this.props.LayerDescription.display_name}
            </span>
          </Col>
        </Row>
        <Row
          style={
            this.props.currentLayerType === "Raster"
              ? { marginBottom: "0px" }
              : { marginBottom: "5px" }
          }
        >
          <Col
            style={
              this.props.CurrentLayer === "LULC" ||
              this.props.CurrentLayer === "crop_intensity" ||
              this.props.CurrentLayer === "crop_land" ||
              this.props.CurrentLayer === "crop_type" ||
              this.props.CurrentLayer === "crop_stress"
                ? { display: "none" }
                : {}
            }
          >
            <span className="drawer-value">
              <span
                style={
                  this.props.CurrentRegion === "CUSTOM" ||
                  this.props.currentLayerType === "Vector"
                    ? { display: "none" }
                    : {}
                }
              >
                {this.props.currentLayerType === "Raster" ? (
                  <span>
                    <div
                      style={this.props.pixelloader ? {} : { display: "none" }}
                    >
                      <center>
                        <img
                          src={Loader}
                          alt="Logo"
                          style={{
                            height: "100px",
                            backgroundColor: "transparent",
                          }}
                        />
                      </center>
                    </div>
                    <div
                      style={this.props.pixelloader ? { display: "none" } : {}}
                    >
                      {this.props.CurrentLayer === "NO2" ||
                      this.props.CurrentLayer === "NDVI_DPPD" ||
                      this.props.CurrentLayer === "PM25_DPPD" ||
                      this.props.CurrentLayer === "NO2_DPPD" ||
                      this.props.CurrentLayer === "LAI_DPPD" ||
                      this.props.CurrentLayer === "LST_DPPD" ||
                      this.props.CurrentLayer === "NDWI_DPPD" ||
                      this.props.CurrentLayer === "SOIL_M_DEV" ||
                      this.props.CurrentLayer === "Total Precipitation - Monthly"
                        ? parseFloat(this.props.pixelvalue).toFixed(6)
                        : parseFloat(this.props.pixelvalue).toFixed(2)}
                    </div>
                  </span>
                ) : null}
              </span>
              <span
                style={
                  this.props.CurrentRegion === "CUSTOM" ||
                  this.props.currentLayerType === "Raster"
                    ? { display: "none" }
                    : {}
                }
              >
                {this.state.meanvalue}
              </span>
              <span
                style={
                  this.props.CurrentRegion === "CUSTOM"
                    ? {}
                    : { display: "none" }
                }
              >
                {this.state.meanvalue}
              </span>
              <p className="drawer-unit">
                {this.props.LayerDescription.unit === "unit" ||
                this.props.LayerDescription.unit === "string"
                  ? " "
                  : this.props.LayerDescription.unit}
              </p>
            </span>
          </Col>
          <Col
            style={
              this.props.CurrentLayer === "LULC" ||
              this.props.CurrentLayer === "crop_intensity" ||
              this.props.CurrentLayer === "crop_land" ||
              this.props.CurrentLayer === "crop_type" ||
              this.props.CurrentLayer === "crop_stress"
                ? {}
                : { display: "none" }
            }
          >
            <div
              style={
                this.props.CurrentRegion === "CUSTOM" ? {} : { display: "none" }
              }
            >
              <div
                style={this.state.loaderpercentage ? {} : { display: "none" }}
              >
                <center>
                  <img
                    src={Loader}
                    alt="Logo"
                    style={{
                      height: "100px",
                      backgroundColor: "transparent",
                    }}
                  />
                </center>
              </div>
              <div
                style={this.state.loaderpercentage ? { display: "none" } : {}}
              >
                <ValueTable />
              </div>
            </div>
            <div
              style={
                this.props.CurrentRegion === "DISTRICT" ||
                this.props.CurrentRegion === "MANDAL"
                  ? {}
                  : { display: "none" }
              }
            >
              <CategoryName />
            </div>
          </Col>
          <Col
            style={
              this.props.CurrentLayer === "LULC" ||
              this.props.CurrentLayer === "crop_intensity" ||
              this.props.CurrentLayer === "crop_land" ||
              this.props.CurrentLayer === "crop_type" ||
              this.props.CurrentLayer === "crop_stress"
                ? { display: "none" }
                : { textAlign: "right" }
            }
          >
            <Row>
              <span className="drawer-calculated">Calculated</span>
            </Row>
            <Row>
              <span className="drawer-updateddate">
                {this.props.currentdate}
              </span>
            </Row>
          </Col>
        </Row>
        <div
          style={
            this.props.CurrentLayer === "SOIL" ||
            this.props.CurrentLayer === "LST_DPPD" ||
            this.props.CurrentLayer === "NO2_DPPD" ||
            this.props.CurrentLayer === "PM25_DPPD" ||
            this.props.CurrentLayer === "SOC_DPPD" ||
            this.props.CurrentLayer === "LAI_DPPD" ||
            this.props.CurrentLayer === "NDVI_DPPD" ||
            this.props.CurrentLayer === "POPULATION" ||
            this.props.CurrentLayer === "NDWI_DPPD" ||
            this.props.CurrentLayer === "SOIL_M_DEV" ||
            this.props.CurrentLayer === "LULC" ||
            this.props.CurrentLayer === "DPPD" ||
            this.props.CurrentLayer === "FIREEV" ||
            (this.props.currentLayerType === "Raster" &&
              this.props.CurrentRegion === "DISTRICT") ||
            (this.props.currentLayerType === "Raster" &&
              this.props.CurrentRegion === "MANDAL")
              ? { display: "none", marginTop: "5px" }
              : this.props.CurrentRegion === "CUSTOM" ||
                this.props.currentLayerType === "Vector"
              ? {}
              : { display: "none" }
          }
          className="progressbar-container"
        >
          <span
            style={
              this.props.CurrentLayer === "LULC" ||
              this.props.CurrentLayer === "crop_intensity" ||
              this.props.CurrentLayer === "crop_land" ||
              this.props.CurrentLayer === "crop_type" ||
              this.props.CurrentLayer === "FIREEV" ||
              (this.props.CurrentLayer === "crop_stress" &&
                this.props.CurrentRegion === "CUSTOM")
                ? { display: "none" }
                : { marginTop: "25px" }
            }
          >
            <ol className="progress-indicator mb-2">
              <li className="is-complete" data-step="">
                <span>Min</span>
                <span className="steps-min">{this.state.minvalue}</span>
              </li>
              <li className="is-complete" data-step="">
                <span>Avg</span>
                <span className="steps-avg">{this.state.meanvalue}</span>
              </li>
              <li className="is-complete" data-step="">
                <span>Max</span>
                <span className="steps-max">{this.state.maxvalue}</span>
              </li>
            </ol>
          </span>
        </div>
        <UncontrolledAccordion defaultOpen={["1", "2"]} stayOpen>
          <AccordionItem
            targetId="1"
            style={{
              border: "none",
              backgroundColor: "#091B33",
              paddingTop: "20px",
            }}
          >
            <AccordionHeader
              targetId="1"
              style={{ border: "none", backgroundColor: "#091B33" }}
            >
              <span className="drawer-content-details">DETAILS</span>
            </AccordionHeader>
            <AccordionBody
              accordionId="1"
              style={{ border: "none", backgroundColor: "#091B33" }}
            >
              <Row>
                <span className="drawer-content-long-desc">
                  {this.props.LayerDescription.long_description}
                </span>
              </Row>

              <span className="drawer-content-header">Source</span>
              <br />
              <span className="drawer-content-description">
                {this.props.LayerDescription.source}
              </span>
              <br />
              <span className="drawer-content-header">Citation</span>
              <br />
              <span className="drawer-content-description">
                {this.props.LayerDescription.citation}
              </span>
              <br />
              <span className="drawer-content-header">Standards</span>
              <br />
              <span className="drawer-content-description">
                {this.props.LayerDescription.standards}
              </span>
              <br />
            </AccordionBody>
          </AccordionItem>
          <span
            style={
              (this.props.CurrentLayer === "LULC" ||
                this.props.CurrentLayer === "crop_stress") &&
              (this.props.CurrentRegion === "DISTRICT" ||
                this.props.CurrentRegion === "MANDAL") ||
                this.props.CurrentLayer === "NO2"
                
                ? { display: "none" }
                : {}
            }
          >
            <span
              style={
                this.props.LayerDescription.multiple_files ||
                this.props.CurrentLayer === "DPPD" ||
                this.props.CurrentLayer === "SOIL_M_DEV" ||
                this.props.CurrentLayer === "LAI_DPPD" ||
                this.props.CurrentLayer === "LST_DPPD" ||
                this.props.CurrentLayer === "PM25_DPPD" ||
                this.props.CurrentLayer === "NDVI_DPPD" ||
                this.props.CurrentLayer === "NDWI_DPPD"
                // this.props.CurrentLayer === "NO2_DPPD"
                  ? {}
                  : { display: "none" }
              }
            >
              <AccordionItem
                targetId="2"
                style={{ border: "none", backgroundColor: "#091B33" }}
              >
                <AccordionHeader
                  targetId="2"
                  style={{ border: "none", backgroundColor: "#091B33" }}
                >
                  <span className="drawer-content-trend">TREND</span>
                </AccordionHeader>
                <AccordionBody
                  accordionId="2"
                  style={{ border: "none", backgroundColor: "#091B33" }}
                >
                  <Row style={this.state.Datanull ? {} : { display: "none" }}>
                    <p
                      style={{
                        color: "#cf2e2e",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      Trend not available !
                    </p>
                  </Row>
                  <Row style={{ marginBottom: "50px" }}>
                    <div
                      className="btn-group-sm"
                      role="group"
                      aria-label="Basic radio toggle button group"
                      style={
                        this.props.LayerDescription.timerangefilter ||
                        this.props.CurrentLayer === "SOIL_M_DEV" ||
                        this.props.CurrentLayer === "LAI_DPPD" ||
                        this.props.CurrentLayer === "NDVI_DPPD" ||
                        this.props.CurrentLayer === "NO2_DPPD" ||
                        this.props.CurrentLayer === "LST_DPPD" ||
                        this.props.CurrentLayer === "PM25_DPPD" ||
                        this.props.CurrentLayer === "NDWI_DPPD"
                          ? { fontSize: "10px", marginTop: "10px" }
                          : { display: "none" }
                      }
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio3"
                        autoComplete="off"
                        onChange={(e) => {}}
                        checked={
                          this.state.currentCharttime === "1year" ? true : false
                        }
                        onClick={(e) => {
                          this.settimerange("1Year");
                        }}
                        disabled={this.state.loader === true}
                      />
                      <label
                        className="btn btn-primary btn-chart"
                        htmlFor="btnradio3"
                      >
                        1 year
                      </label>
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio4"
                        autoComplete="off"
                        onChange={(e) => {}}
                        checked={
                          this.state.currentCharttime === "3year" ? true : false
                        }
                        onClick={(e) => {
                          this.settimerange("3Year");
                        }}
                        disabled={this.state.loader === true}
                      />
                      <label
                        className="btn btn-primary btn-chart"
                        htmlFor="btnradio4"
                      >
                        3 year
                      </label>
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio5"
                        onChange={(e) => {}}
                        autoComplete="off"
                        checked={
                          this.state.currentCharttime === "5year" ? true : false
                        }
                        onClick={(e) => {
                          this.settimerange("5Year");
                        }}
                        disabled={this.state.loader === true}
                      />
                      <label
                        className="btn btn-primary btn-chart"
                        htmlFor="btnradio5"
                      >
                        5 year
                      </label>
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio6"
                        onChange={(e) => {}}
                        autoComplete="off"
                        checked={
                          this.state.currentCharttime === "10year" ? true : false
                        }
                        onClick={(e) => {
                          this.settimerange("10Year");
                        }}
                        disabled={this.state.loader === true}
                      />
                      <label
                        className="btn btn-primary btn-chart"
                        htmlFor="btnradio6"
                        
                      >
                        10 year
                      </label>
                    </div>

                    <div>
                      <Row>
                        <Col>
                          <span
                            style={
                              this.props.CurrentLayer === "LULC"
                                ? {
                                    display: "inline",
                                    "margin-left": "10px",
                                  }
                                : { display: "none" }
                            }
                          >
                            <Dropdown overlay={LULCmenu}>
                              <span
                                className="ant-dropdown-link"
                                onClick={(e) => e.preventDefault()}
                              >
                                Select Category <DownOutlined /> |{" "}
                                {this.state.selectedLULCcategory}
                              </span>
                            </Dropdown>
                          </span>
                          <span
                            style={
                              this.props.CurrentLayer === "crop_stress"
                                ? {
                                    display: "inline",
                                    "margin-left": "10px",
                                  }
                                : { display: "none" }
                            }
                          >
                            {this.props.CurrentLayer === "crop_stress" &&
                            this.props.CurrentRegion === "CUSTOM" ? (
                              <Dropdown overlay={CropStressmenu}>
                                <span
                                  className="ant-dropdown-link"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  Select Category <DownOutlined /> |{" "}
                                  {this.state.selectedCropStresscategory}
                                </span>
                              </Dropdown>
                            ) : (
                              ""
                            )}
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <div
                      style={
                        this.props.CurrentLayer === "LULC" ||
                        this.props.CurrentLayer === "crop_stress"
                          ? { display: "none" }
                          : {}
                      }
                    >
                      <div style={this.state.loader ? {} : { display: "none" }}>
                        <center>
                          <img
                            src={Loader}
                            alt="Logo"
                            style={{
                              height: "100px",
                              backgroundColor: "transparent",
                            }}
                          />
                        </center>
                      </div>
                      <div style={this.state.loader ? { display: "none" } : {}}>
                        <Chart
                          series={this.state.series}
                          options={this.state.options}
                          type="line"
                          height="180"
                        />
                      </div>
                    </div>
                    <div
                      style={
                        this.props.CurrentLayer === "LULC" ||
                        this.props.CurrentLayer === "crop_stress"
                          ? {}
                          : { display: "none" }
                      }
                    >
                      <div
                        style={
                          this.state.loaderpercentage ? {} : { display: "none" }
                        }
                      >
                        <center>
                          <img
                            src={Loader}
                            alt="Logo"
                            style={{
                              height: "100px",
                              backgroundColor: "transparent",
                            }}
                          />
                        </center>
                      </div>
                      <div
                        style={
                          this.state.loaderpercentage ? { display: "none" } : {}
                        }
                      >
                        <Chart
                          series={this.state.series}
                          options={this.state.options}
                          type="line"
                          height="180"
                        />
                      </div>
                    </div>
                  </Row>
                </AccordionBody>
              </AccordionItem>
            </span>
          </span>
        </UncontrolledAccordion>
      </Drawer>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(DrawerComp);
