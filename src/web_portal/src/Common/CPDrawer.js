import React, { Component } from "react";
import "antd/dist/antd.css";
import { Drawer } from "antd";
import { Menu, Dropdown, notification } from "antd";
import { DownOutlined, InfoCircleTwoTone } from "@ant-design/icons";
import { BiLayer, BiLineChart, BiX } from "react-icons/bi";
import geojson from "../Shapes/Telangana.json";
import Moment from "moment";
import { Button, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import { message } from "antd";
import axiosConfig from "../Common/axios_Config";
import Loader from "../img/loader.gif";
import { connect } from "react-redux";

const mapStateToProps = (ReduxProps) => {
  return {
    CurrentLayer: ReduxProps.CurrentLayer,
    LayerDescription: ReduxProps.LayerDescription,
    CurrentRegion: ReduxProps.CurrentRegion,
    DrawerChange: ReduxProps.ShowDrawer,
    CurrentVector: ReduxProps.CurrentVector,
    CurrentPlace: ReduxProps.setplace,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showDrawer: (val) => dispatch({ type: "SHOWDRAWER" }),
    hideDrawer: (val) => dispatch({ type: "HIDEDRAWER" }),
  };
};
const key = "updatable";
const openNotification = () => {
  notification.open({
    key,
    description: "Trend data is not available for given time range !",
    icon: <InfoCircleTwoTone />,
  });
};
class CPDrawerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centerpoint: [77.74593740335436, 17.25474880524307],
      properties: [],
      visible: false,
      selectedCommodity: "",
      modal: false,
      selected_shape: geojson,
      loader: false,
      populationData: "0.00",
      varietyNames: [],
      disableVariety: false,
      customStatus: false,
      disableCommodiy: false,
      currentCharttime: "6mon",
      selectedVariety: "",
      customLULC: [],
      tableKey: 0,
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
              show: true,
            },
          },
        },
        yaxis: {
          show: true,
          tickAmount:3,
          format: "dd MMM yyyy",
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
          tickAmount: 6,
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'dd MMM',
            },
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
      from_date: "2021-06-10",
      to_date: "2021-12-12",
      last_updated: "",
      weatherValue: 0.0,
      commodities: [],
      currentCM: "",
    };
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onClickVariety = this.onClickVariety.bind(this);
    this.onClickParameter = this.onClickParameter.bind(this);
  }

  onClickParameter({ key }) {
    this.setState(
      {
        loader: true,
        selectedCommodity: key,
      },
      () => {
        this.getvarietylist();
      }
    );
  }
  onClickVariety({ key }) {
    this.setState(
      {
        loader: true,
        selectedVariety: key,
      },
      () => {
        this.getcommoditytrend();
      }
    );
  }
  showDrawer(name) {
    this.props.showDrawer();
    this.setState({
      currentCM: name,
    });
    this.getcommodities();
  }
  async getcommoditytrend() {
    this.setState({
      loader: true,
    });
    var bodyParams = {
      startdate: "2021-01-01",
      enddate: "2022-01-30",
      name: this.state.currentCM,
      commodity: this.state.selectedCommodity,
      varity: this.state.selectedVariety,
      parameter: "Maximum",
    };

    try {
      const resTrend = await axiosConfig.post(
        `/getmarketyardtrend?`,
        bodyParams
      );
     
      if (resTrend.data.trend.length > 0) {
        this.generatechart(resTrend.data.trend);
      } else {
        openNotification();
        this.setState({
          series: [],
          loader: false,
        });
      }
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  onClose() {

    this.props.hideDrawer();
  }
  async getcommodities() {
    try {
      const resCommodity = await axiosConfig.get(
        `/getcommodityname?marketname=` + String(this.state.currentCM)
      );
      this.setState(
        {
          commodities: resCommodity.data.commodity_names,
          selectedCommodity: resCommodity.data.commodity_names[0],
        },
        () => {
          if (resCommodity.data.commodity_names.length > 0) {
            this.getvarietylist();
            this.setState({
              disableVariety: false,
              disableCommodiy: false,
            });
          } else {
            openNotification();
            this.setState({
              disableVariety: true,
              disableCommodiy: true,
              series: [],
              loader: false,
            });
          }
        }
      );
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  async getvarietylist() {
    try {
      const resVariety = await axiosConfig.get(
        `/getvarietyname?commodity=` +
          this.state.selectedCommodity +
          `&marketname=` +
          String(this.state.currentCM)
      );

      this.sortVarietyname(resVariety.data.varity_name);
    } catch (err) {
      message.error("Failed to connect to server");
    }
  }
  sortVarietyname(list) {
    var VarietyList = [];

    list.map((item) => VarietyList.push(item[0]));

    this.setState(
      {
        varietyNames: VarietyList,
        selectedVariety: VarietyList[0],
      },
      () => {
        this.getcommoditytrend();
      }
    );
  }
  generatechart(data) {
    var trendData = {
      name: this.props.CurrentLayer,
      data: [],
    };

    if (data != null) {
      data.map((item) =>  trendData.data.push({
        x: item[0],
        y: item[1],
      }));
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
          tickAmount:3,
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
            text: this.props.LayerDescription.yaxislabel,
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
              year: 'yyyy',
              month: 'dd MMM',
              day: 'dd MMM',
              hour: 'HH:mm'
            },
            style: {
              colors: "#90989b",
              cssClass: "apexcharts-xaxis-label",
            },
          },
          title: {
            text: this.props.LayerDescription.xaxislabel,
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
  checkValue(value) {
    if (isNaN(value)) {
      return "0.00";
    } else {
      return value;
    }
  }

  settimerange(daterange) {
    if (daterange === "6months") {
      let current_date;
      let from_date;
      current_date = new Date();
      from_date = new Date();
      from_date = from_date.setMonth(from_date.getMonth() - 6);
      from_date = new Date(from_date);
      let from_dd = String(from_date.getDate()).padStart(2, "0");
      let from_mm = String(from_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let from_yyyy = from_date.getFullYear();
      let start_date = from_yyyy + "-" + from_mm + "-" + from_dd;
      let to_dd = String(current_date.getDate()).padStart(2, "0");
      let to_mm = String(current_date.getMonth() + 1).padStart(2, "0"); //January is 0!
      let to_yyyy = current_date.getFullYear();
      let to_date = to_yyyy + "-" + to_mm + "-" + to_dd;

      if (this.props.CurrentLayer === "FIREEV") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "6mon",
          },
          () => {
            this.setPointsChart();
          }
        );
      } else {
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
      }
    } else if (daterange === "1Year") {
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
      if (this.props.CurrentLayer === "FIREEV") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "1year",
          },
          () => {
            this.setPointsChart();
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
            this.gettrendchart();
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

      if (this.props.CurrentLayer === "FIREEV") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "3year",
          },
          () => {
            this.setPointsChart();
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
            this.gettrendchart();
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
      if (this.props.CurrentLayer === "FIREEV") {
        this.setState(
          {
            from_date: start_date,
            to_date: to_date,
            currentCharttime: "5year",
          },
          () => {
            this.setPointsChart();
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
            this.gettrendchart();
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
    this.setState({
      last_updated: date,
    });
  }
  spellPerilcheck(peril) {
    if (peril === "rain") {
      return "Rainfall";
    }
    if (peril === "min_temp") {
      return "Minimum Temperature";
    }
    if (peril === "max_temp") {
      return "Maximum Temperature";
    }
    if (peril === "min_humidity") {
      return "Minimum Humidity";
    }
    if (peril === "max_humidity") {
      return "Maximum Humidity";
    }
    if (peril === "min_wind_speed") {
      return "Minimum Wind Speed";
    }
    if (peril === "max_wind_speed") {
      return "Max Wind Speed";
    }
  }
  checkDefined(value, date, category) {
    if (value[date] === undefined) {
      return "0.00";
    } else {
      if (value[date].hasOwnProperty(category)) {
        return parseFloat(value[date][category]).toFixed(2);
      }
    }
  }
  render() {
    const menu = (
      <Menu onClick={this.onClickParameter}>
        {this.state.commodities.map((commodity) => {
          return <Menu.Item key={commodity}>{commodity}</Menu.Item>;
        })}
      </Menu>
    );
    const varietymenu = (
      <Menu onClick={this.onClickVariety}>
        {this.state.varietyNames.map((commodity) => {
          return <Menu.Item key={commodity}>{commodity}</Menu.Item>;
        })}
      </Menu>
    );
    return (
      <div>
        <Drawer
          placement="right"
          onClose={this.onClose}
          visible={this.props.DrawerChange}
          maskClosable={false}
          mask={false}
          closable={false}
          width={450}
        >
          <Col>
            <Row>
              <div>
                <BiX
                  style={{ float: "right" }}
                  className="drawer-close"
                  onClick={this.onClose}
                />
              </div>
              <Col>
                <div>
                  <p style={{ fontSize: "18px", display: "inline" }}>
                    <BiLayer /> {this.props.LayerDescription.display_name}
                  </p>
                </div>
              </Col>
              <Col className="alignrignt">
                <p style={{ fontSize: "18px", marginBottom: "15px" }}>
                  {Moment(this.props.LayerDescription.last_updated)
                    .format("DD-MM-YYYY")
                    .slice(0, 10)}
                </p>
              </Col>
            </Row>
            <Row>
              <Col className="mb-2">
                <span
                  style={{
                    display: "inline",
                    "margin-left": "10px",
                    marginBottom: "5px",
                  }}
                >
                  <Dropdown
                    overlay={menu}
                    disabled={this.state.disableCommodiy}
                  >
                    <Button
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Select Parameter <DownOutlined /> |{" "}
                      {this.state.selectedCommodity}
                    </Button>
                  </Dropdown>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span style={{ display: "inline", "margin-left": "10px" }}>
                  <Dropdown
                    overlay={varietymenu}
                    disabled={this.state.disableVariety}
                  >
                    <Button
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      Select Variety <DownOutlined /> |{" "}
                      {this.state.selectedVariety}
                    </Button>
                  </Dropdown>
                </span>
              </Col>
            </Row>

            <Row style={{ marginTop: "15px" }}>
              <p style={{ fontSize: "15px", fontWeight: "lighter" }}>
                {this.props.LayerDescription.long_description}
              </p>
              <div style={{ marginBottom: "5px" }}>
                <p style={{ marginBottom: "0px", color: "#2867a1" }}>SOURCE</p>
                <p>{this.props.LayerDescription.source}</p>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <p style={{ marginBottom: "0px", color: "#2867a1" }}>
                  CITATION
                </p>
                <p>{this.props.LayerDescription.citation}</p>
              </div>
              <div>
                <p style={{ marginBottom: "0px", color: "#2867a1" }}>
                  STANDARDS
                </p>
                <p>{this.props.LayerDescription.standards}</p>
              </div>
            </Row>
            <hr />
            <Row
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

              <div style={this.state.loader ? { display: "none" } : {}}>
                <Chart
                  series={this.state.series}
                  options={this.state.options}
                  type="line"
                  height="180"
                />
              </div>
            </Row>
          </Col>
        </Drawer>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(CPDrawerModal);
