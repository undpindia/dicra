import React, { Component, useState } from "react";
import "antd/dist/antd.css";
import { Drawer, Space } from "antd";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { BiLayer, BiLineChart, BiDownload, BiX } from "react-icons/bi";
import geojson from "../Shapes/Telangana.json";
import Captcha from "demos-react-captcha";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
  FormGroup,
  Card,
  CardBody
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
import Chart from "react-apexcharts";
import { Steps, message } from "antd";
import axios from "axios";
import axiosConfig from "../Common/axios_Config";
import Loader from "../img/loader.gif";
import { connect } from "react-redux";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const { Step } = Steps;
const mapStateToProps = (ReduxProps) => {
  return {
    CurrentLayer: ReduxProps.CurrentLayer,
    LayerDescription: ReduxProps.LayerDescription,
    CurrentRegion: ReduxProps.CurrentRegion,
    DrawerChange: ReduxProps.ShowDrawer,
    CurrentVector: ReduxProps.CurrentVector,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showDrawer: (val) => dispatch({ type: "SHOWDRAWER" }),
    hideDrawer: (val) => dispatch({ type: "HIDEDRAWER" }),
  };
};

class DrawerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centerpoint: [77.74593740335436, 17.25474880524307],
      properties: [],
      visible: false,
      // area: props.district.area,
      modal: false,
      selected_shape: geojson,
      loader: false,
      populationData: "0.00",
      customStatus: false,
      currentCharttime: "6mon",
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
            show: true,
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
        },
        yaxis: {
          show: false,
          min: -1.0,
        },
        xaxis: {
          type: "datetime",
          tickAmount: 6,
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
          width: 2,
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
      from_date: "2021-06-10",
      to_date: "2021-12-12",
      selectedWeatherparams: "rain",
      last_updated:"",

    };
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.gettrendchart = this.gettrendchart.bind(this);
    this.toggleDownload = this.toggleDownload.bind(this);
    this.onClickParameter = this.onClickParameter.bind(this);
  }
  async getWeathertrend() {
    var bodyParams = {
      district: this.props.CurrentVector.features[0].properties.Dist_Name,
      mandal: this.props.CurrentVector.features[0].properties.Mandal_Nam,
      parameter: this.state.selectedWeatherparams,
      start_date: "2021-01-01",
      end_date: "2022-02-02",
    };
    try {
      const resWeatherData = await axiosConfig.post(`/getweather?`, bodyParams);
      var last_date=(resWeatherData.data.trend).length
      last_date=last_date-1
      last_date=resWeatherData.data.trend[last_date]
      console.log("WEATHER RESPONSE", last_date);
      this.timeConverter(last_date[0])
      this.generatechart(resWeatherData.data.trend);
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  onClickParameter({ key }) {
    this.setState({
      loader: true,
      selectedWeatherparams: key,
    },()=>{
      this.getWeathertrend();
    });
  }

  showDrawer() {
    this.props.showDrawer();
    this.setNewshape();
  }
  onClose() {
    // this.setState({
    //   visible: false,
    // });
    this.props.hideDrawer();
    // dispatch({ type: "HIDEDRAWER"});
  }
  toggleDownload() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  onChange(value) {
    console.log(value);
  }

  async gettrendchart() {
    this.setState({
      loader: true,
    });

    var shapeparams = this.props.district.selected_shape;
    shapeparams = shapeparams.features[0].geometry;
    console.log("SHAPE PROPS", shapeparams);
    var bodyParams = {
      geojson: shapeparams,
      startdate: this.state.from_date,
      enddate: this.state.to_date,
      parameter: this.props.CurrentLayer,
    };
    try {
      const res = await axiosConfig.post(`/gettrend?`, bodyParams);
      this.generatechart(res.data.trend);
    } catch (err) {
      message.error("Failed to connect to server");
    }
    this.getPopulation(shapeparams);
  }
  async getPopulation(shapeparams) {
    // =====================API FOR POPULATION DATA=================
    var bodyParamsPopulation = {
      geojson: shapeparams,
      date: "2020-01-01",
      parameter: "POPULATION",
    };
    try {
      const resPopulation = await axiosConfig.post(
        `/getzstat?`,
        bodyParamsPopulation
      );
      console.log("POPULATION RESPONSE", resPopulation);
      this.setState({
        populationData: resPopulation.data.stat.mean,
      });
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  generatechart(data) {
    let chart_values = [];
    var trendData = {
      name: this.props.CurrentLayer,
      data: [],
    };
    console.log("DATA IN LOOP", data);
    if (data != null) {
      data.map(function (item, index, data) {
        trendData.data.push({
          x: item[0],
          y: item[1],
        });
      });
    }
    if (trendData.data == null) {
      chart_values = [trendData];
    }
    console.log("DATA ", [trendData]);
    this.setState(
      {
        series: [trendData],
        loader: false,
      },
      () => {
        console.log("LOADER CHANGE", this.state.loader);
      }
    );
    // return [trendData];
  }
  checkValue(value) {
    if (isNaN(value)) {
      return "0.00";
    } else {
      return value;
    }
  }
  setNewshape() {
    this.setState(
      {
        selected_shape: this.props.district.selected_shape,
      },
      () => {
        {
          console.log("SELECTED SHAPE", this.state.selected_shape);
        }
      }
    );
  }
  async setPointsChart() {
    var shapeparams = this.props.district.selected_shape;
    shapeparams = shapeparams.features[0].geometry;
    console.log("SHAPE PROPS", shapeparams);
    var bodyParams = {
      geojson: shapeparams,
      startdate: "2021-01-01",
      enddate: "2022-01-20",
    };
    try {
      const res = await axiosConfig.post(`/getpointstrend?`, bodyParams);
      console.log("POINT CHART REPOSNSE", res);
      this.generatechart(res.data.trend);
      this.getPopulation(shapeparams);
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  settimerange(daterange) {
    if (daterange == "6months") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setMonth(from_date.getMonth() - 6);
      from_date = new Date(from_date);
      var from_dd = String(from_date.getDate()).padStart(2, "0");
      var from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var from_yyyy = from_date.getFullYear();
      var start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      var to_dd = String(current_date.getDate()).padStart(2, "0");
      var to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var to_yyyy = current_date.getFullYear();
      var to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      this.setState(
        {
          from_date: start_date,
          to_date: to_date,
          currentCharttime: "6mon",
        },
        () => {
          this.gettrendchart();
        }
      );
    } else if (daterange == "1Year") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 1);
      from_date = new Date(from_date);
      var from_dd = String(from_date.getDate()).padStart(2, "0");
      var from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var from_yyyy = from_date.getFullYear();
      var start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      var to_dd = String(current_date.getDate()).padStart(2, "0");
      var to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var to_yyyy = current_date.getFullYear();
      var to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      this.setState(
        {
          from_date: start_date,
          to_date: to_date,
          currentCharttime: "1year",
        },
        () => {
          this.gettrendchart();
        }
      );
    } else if (daterange == "3Year") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 3);
      from_date = new Date(from_date);
      var from_dd = String(from_date.getDate()).padStart(2, "0");
      var from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var from_yyyy = from_date.getFullYear();
      var start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      var to_dd = String(current_date.getDate()).padStart(2, "0");
      var to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var to_yyyy = current_date.getFullYear();
      var to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      this.setState(
        {
          from_date: start_date,
          to_date: to_date,
          currentCharttime: "3year",
        },
        () => {
          this.gettrendchart();
        }
      );
    } else if (daterange == "5Year") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setFullYear(from_date.getFullYear() - 5);
      from_date = new Date(from_date);
      var from_dd = String(from_date.getDate()).padStart(2, "0");
      var from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var from_yyyy = from_date.getFullYear();
      var start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      var to_dd = String(current_date.getDate()).padStart(2, "0");
      var to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var to_yyyy = current_date.getFullYear();
      var to_date = to_yyyy + "-" + to_mm + "-" + to_dd;
      this.setState(
        {
          from_date: start_date,
          to_date: to_date,
          currentCharttime: "5year",
        },
        () => {
          this.gettrendchart();
        }
      );
    }
  }
timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  // var year = a.getFullYear();
  // var month = months[a.getMonth()];
  // var date = a.getDate();
  // var hour = a.getHours();
  // var min = a.getMinutes();
  // var sec = a.getSeconds();
  // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  var dd = String(a.getDate()).padStart(2, "0");
  var mm = String(a.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = a.getFullYear();
  var date = yyyy + "-" + mm + "-" + dd;
  // return time;
  console.log("TIMESTAMP CONV",date)
  this.setState({
    last_updated:date
  })
}
  render() {
    const menu = (
      <Menu onClick={this.onClickParameter}>
        <Menu.Item key="rain" >Rainfall</Menu.Item>
        <Menu.Item key="min_temp">Minimum Temperature</Menu.Item>
        <Menu.Item key="max_temp">Maximum Temperature</Menu.Item>
        <Menu.Item key="min_humidity">Minimum Humidity</Menu.Item>
        <Menu.Item key="max_humidity">Maximum Humidity</Menu.Item>
        <Menu.Item key="min_wind_speed">Minimum Wind Speed</Menu.Item>
        <Menu.Item key="max_wind_speed">Maximum Wind Speed</Menu.Item>
      </Menu>
    );
    const width = 800;
    const height = width * 0.9;
    const projection = geoMercator().fitExtent(
      [
        [0, 0],
        [width * 0.7, height * 0.7],
      ],
      this.state.selected_shape
    );

    const path = geoPath().projection(projection);
    const centerpoint =
      this.state.selected_shape.features[0].properties.centroid;
    var scaleValue;
    if (this.props.district.area < 0.001) {
      scaleValue = 20000000;
    } else if (
      this.props.district.area >= 0.001 &&
      this.props.district.area <= 0.1
    ) {
      scaleValue = 15000000;
    } else if (
      this.props.district.area >= 1 &&
      this.props.district.area <= 50
    ) {
      scaleValue = 250000;
    } else if (
      this.props.district.area >= 50 &&
      this.props.district.area <= 100
    ) {
      scaleValue = 200000;
    } else if (
      this.props.district.area >= 100 &&
      this.props.district.area <= 200
    ) {
      scaleValue = 100000;
    } else if (
      this.props.district.area >= 200 &&
      this.props.district.area <= 300
    ) {
      scaleValue = 80000;
    } else if (
      this.props.district.area >= 300 &&
      this.props.district.area <= 400
    ) {
      scaleValue = 70000;
    } else if (
      this.props.district.area >= 400 &&
      this.props.district.area <= 500
    ) {
      scaleValue = 60000;
    } else if (
      this.props.district.area >= 500 &&
      this.props.district.area <= 800
    ) {
      scaleValue = 50000;
    } else if (
      this.props.district.area >= 1000 &&
      this.props.district.area <= 2000
    ) {
      scaleValue = 40000;
    } else {
      scaleValue = 25000;
    }
    const PROJECTION_CONFIG = {
      scale: scaleValue,
      center: centerpoint,
    };

    return (
      <div>
        <Drawer
          title="SELECTION"
          placement="right"
          onClose={this.onClose}
          visible={this.props.DrawerChange}
          maskClosable={false}
          mask={false}
          closable={false}
          width={450}
          extra={
            <Space>
              <BiX className="drawer-close" onClick={this.onClose} />
            </Space>
          }
        >
          <Col>
          <Card style={{backgroundColor:"#032e4e", marginBottom:"15px"}}>
            <CardBody>
            <Row>
              <Col
                style={
                  this.props.CurrentRegion == "CUSTOM"
                    ? { display: "none" }
                    : {}
                }
                md={4}
              >
                <div>
                  <ComposableMap
                    projectionConfig={PROJECTION_CONFIG}
                    projection="geoMercator"
                    width={600}
                    height={600}
                  >
                    <Geographies geography={this.state.selected_shape.features}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#032e4e"
                            stroke="#fff"
                            strokeWidth="1"
                          />
                        ))
                      }
                    </Geographies>
                  </ComposableMap>
                </div>
              </Col>

              {/* custom draw */}
              <Col
                style={
                  this.props.CurrentRegion == "CUSTOM"
                    ? {}
                    : { display: "none" }
                }
                md={4}

              >
                <ComposableMap
                  projectionConfig={PROJECTION_CONFIG}
                  projection={projection}
                  width={600}
                  height={600}
                >
                  <Geographies
                    geography={this.state.selected_shape.features}
                    disableOptimization
                  >
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#032e4e"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                      ))
                    }
                  </Geographies>
                </ComposableMap>
              </Col>
              <Col md={8} >
                <Row style={{ fontSize: "14px",
                     marginBottom: "-2px"
                     }}>
                    <p style={{marginBottom:"-2px", textAlign:"right"}}>{this.props.CurrentRegion}</p>
                </Row>
                <Row style={{ fontSize: "18px" ,  color: "#fff"}}>
                    <p style={{marginBottom:"-2px", textAlign:"right"}}>{this.props.district.selectedRegion}</p>
                </Row>
                  <Row><p style={{marginBottom:"-2px", textAlign:"right"}}>AREA</p></Row>
                  <Row style={{ color: "#fff" }}>
                    <p style={{marginBottom:"-2px", textAlign:"right"}}>{this.props.district.area} (&#13218;)</p>
                  </Row>
              </Col>
            </Row>
            </CardBody>
            </Card>
            {/* <hr /> */}
            <Row>
              <Col>
              <div>
                <p style={{ fontSize: "18px",display: "inline" }}>
                  <BiLayer /> {this.props.LayerDescription.display_name}
                </p>               
              </div>
              </Col>
              <Col style={{ fontSize: "18px", textAlign: "right" }}
               style={
                this.props.CurrentLayer == "WEATHER"
                  ? { display: "none" }
                  : {}
              }
              >
                {this.props.LayerDescription.last_updated.slice(0, 10)}
              </Col>
            </Row>
            <Row>
              <Col>
              <span
                  style={{ display: "inline", "margin-left": "10px" }}
                  style={
                    this.props.CurrentLayer == "WEATHER"
                      ? {}
                      : { display: "none" }
                  }
                >
                  <Dropdown overlay={menu}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Select Parameter <DownOutlined /> | {this.state.selectedWeatherparams}
                    </a>
                  </Dropdown>
                </span>
              </Col>
              <Col style={{ fontSize: "18px", textAlign: "right" }}
               style={
                this.props.CurrentLayer == "WEATHER"
                  ? {}
                  : { display: "none" }
              }
              >
                {this.state.last_updated}
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <div>
                  {this.checkValue(this.props.district.areaValue) > 200 ? (
                    <p style={{ fontSize: "27px", fontWeight: "bold" }}>
                      {this.checkValue(this.props.district.areaValue)}
                      <p style={{ fontSize: "15px", fontWeight: "lighter" }}>
                        {this.props.LayerDescription.unit}
                      </p>
                    </p>
                  ) : (
                    <p style={{ fontSize: "35px", fontWeight: "bold" }}>
                      {this.checkValue(this.props.district.areaValue)}
                      <p style={{ fontSize: "15px", fontWeight: "lighter" }}>
                        {this.props.LayerDescription.unit}
                      </p>
                    </p>
                  )}
                </div>
              </Col>
              <Col
                md={8}
                style={{ paddingLeft: "0px", paddingTop: "20px" }}
                style={
                  this.props.CurrentLayer == "FIREEV" ? { display: "none" } : {}
                }
                style={
                  this.props.CurrentLayer == "WEATHER"
                    ? { display: "none" }
                    : {}
                }
              >
                <Row>
                  <Col className="steps-min">
                    {" "}
                    {this.checkValue(this.props.district.minVal)}
                  </Col>
                  <Col className="steps-avg">
                    {this.checkValue(this.props.district.areaValue)}
                  </Col>
                  <Col className="steps-max">
                    {this.checkValue(this.props.district.maxVal)}
                  </Col>
                </Row>
                <div>
                  <Steps progressDot current={2}>
                    <Step title="Min" />
                    <Step title="Avg" />
                    <Step title="Max" />
                  </Steps>
                </div>
              </Col>
            </Row>
            <Row>
              <p style={{ fontSize: "15px", fontWeight: "lighter" }}>
                {this.props.LayerDescription.long_description}
              </p>
              <p>Source : {this.props.LayerDescription.source}</p>
            </Row>
            <hr />
            <Row
              style={
                this.props.LayerDescription.multiple_files
                  ? {}
                  : { display: "none" }
              }
            >
              <div>
                <p style={{ fontSize: "18px", display: "inline" }}>
                  <BiLineChart /> Trend
                </p>
              
              </div>
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
              <div
                class="col-md-12"
                style={this.state.loader ? { display: "none" } : {}}
              >
                <div
                  className="btn-group-sm"
                  role="group"
                  aria-label="Basic radio toggle button group"
                  style={{ fontSize: "10px" }}
                  style={
                    this.props.CurrentLayer == "FIREEV"
                      ? { display: "none" }
                      : { marginTop: "20px" }
                  }
                  style={
                    this.props.CurrentLayer == "WEATHER"
                      ? { display: "none" }
                      : { marginTop: "20px" }
                  }
                >
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio1"
                    autocomplete="off"
                    defaultChecked
                    checked={
                      this.state.currentCharttime == "6mon" ? true : false
                    }
                  />
                  <label
                    class="btn btn-primary btn-chart"
                    for="btnradio1"
                    onClick={(e) => {
                      {
                        this.settimerange("6months");
                      }
                    }}
                  >
                    6 months
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio2"
                    autocomplete="off"
                    checked={
                      this.state.currentCharttime == "1year" ? true : false
                    }
                  />
                  <label
                    class="btn btn-primary btn-chart"
                    for="btnradio2"
                    onClick={(e) => {
                      {
                        this.settimerange("1Year");
                      }
                    }}
                  >
                    1 year
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio3"
                    autocomplete="off"
                    checked={
                      this.state.currentCharttime == "3year" ? true : false
                    }
                  />
                  <label
                    class="btn btn-primary btn-chart"
                    for="btnradio3"
                    onClick={(e) => {
                      {
                        this.settimerange("3Year");
                      }
                    }}
                  >
                    3 year
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio4"
                    autocomplete="off"
                    checked={
                      this.state.currentCharttime == "5year" ? true : false
                    }
                  />
                  <label
                    class="btn btn-primary btn-chart"
                    for="btnradio4"
                    onClick={(e) => {
                      {
                        this.settimerange("5Year");
                      }
                    }}
                  >
                    5 year
                  </label>
                </div>
                {/* <Button className="trend-download"style={{fontSize:"10px"}}onClick={this.toggleDownload}><BiDownload/></Button>  */}
              </div>
              <div style={this.state.loader ? { display: "none" } : {}}>
                <Chart
                  series={this.state.series}
                  options={this.state.options}
                  type="line"
                  height="140"
                />
              </div>
            </Row>
            {/* <Row>
              <Col md={12}>
                <Button style={{ float: "right" }}>Download</Button>
              </Col>
            </Row> */}
          </Col>
        </Drawer>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleDownload}
          className={this.props.className}
          centered
          backdrop="static"
        >
          <ModalHeader toggle={this.toggleDownload}>Download</ModalHeader>
          <ModalBody className="trend-modal">
            <AvForm>
              <div
                style={{
                  maxHeight: "calc(100vh - 290px)",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
                className="trend-download-content"
              >
                <AvGroup>
                  <Label for="example">Name</Label>
                  <AvInput name="name" id="name" required />
                  <AvFeedback>Please enter your name</AvFeedback>
                </AvGroup>
                <AvGroup>
                  <Label for="example">Email</Label>
                  <AvInput name="email" id="email" required />
                  <AvFeedback>Please enter your email address</AvFeedback>
                </AvGroup>
                <Label>USAGE TYPE</Label>
                <AvRadioGroup
                  name="radioExample"
                  required
                  errorMessage="Pick one!"
                >
                  <Row>
                    <Col>
                      <AvRadio label="Commercial" value="commercial" />
                    </Col>
                    <Col>
                      <AvRadio label="Non-commercial" value="non-commercial" />
                    </Col>
                  </Row>
                </AvRadioGroup>

                <AvField type="select" name="select" label="Purpose">
                  <option value="" selected disabled>
                    Purpose
                  </option>
                  <option>Academia</option>
                  <option>Business</option>
                  <option>Government Use</option>
                  <option>R&D</option>
                  <option>Journalistic</option>
                  <option>Others</option>
                </AvField>
                <div className="captcha">
                  <Captcha
                    onChange={this.onChange}
                    placeholder="Enter captcha"
                  />
                </div>
              </div>
              <ModalFooter>
                <Button color="secondary">Download</Button>
              </ModalFooter>
            </AvForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(DrawerModal);
