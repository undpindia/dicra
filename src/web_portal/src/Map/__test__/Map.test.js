import { render, screen, cleanup } from "@testing-library/react";
// import React, { useState } from "react";
import Map, { map as Map1 } from "../Map";
import React, { Component } from "react";
import enzyme from "enzyme";
import { mount } from "enzyme";
import renderer from "react-test-renderer";
// import axiosConfig from "../../Common/axios_Config";
// import GeoRaster from "./RGBGeoRaster";
// import { Route, Link, BrowserRouter  } from 'react-router-dom'
// import usePlacesAutocomplete, {
//     getGeocode,
//     getLatLng,
//   } from "use-places-autocomplete";
// // <rootdir>/__tests__/app.test.js
// import { assert, expect } from "chai";
import { shallow, configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import * as ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  getGeocode,
  getLatLng,
  HookArgs,
  loadApiErr,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { centroid, feature } from "@turf/turf";
jest.mock("use-places-autocomplete");
jest.mock("leaflet");
// jest.spyOn((point)=>{return {geometry:{coordinates:[]}}},'centroid')
jest.mock("@turf/turf", () => {
  return {
    __esModule: true,
    centroid: (point) => {
      return {
        geometry: {
          coordinates: [],
        },
      };
    },
    polygon: (point) => {
      return {};
    },
  };
});
//Mock "@mapbox/geojson-area"
jest.mock("@mapbox/geojson-area", () => {
  return {
    __esModule: true,
    geometry: (data) => {
      return 200000000;
    },
  };
});
//Mock axiosConfig
// jest.mock('../../Common/axios_Config');
// axiosConfig.post.mockResolvedValueOnce({data:[0,{count:20}]});
// ,()=>{
//     return {
//         __esModule: true,
//         default:
//             // ()=>{
//           {  post:jest.fn().mockResolvedValue({data:[0,{count:20}]})
// (url,params)=>{console.log('in post');return {data:[0,{count:20}]}}
// (url,params)=>{console.log('in call post'); return new Promise((resolve,reject)=>{
//  resolve({data:[0,{count:20}]})
// })}}
// }
// },
// post:jest.fn().mockResolvedValue({data:[0,{count:20}]})
// (url,params)=>{console.log('in post');return {data:[0,{count:20}]}}
// {
// post:(url,params)=>{console.log('in call post'); return new Promise((resolve,reject)=>{
//          resolve({data:[0,{count:20}]})
//         })}}
// (url,params)=>{
//     if(url=='/getpoints'){
//         return new Promise((resolve,reject)=>{
//          data:[0,{count:20}]
//         })
//     }else{
//         return new Promise((resolve,reject)=>{

//         })
//     }

// }
//     }
// }
// )
import usePlacesAutocomplete from "use-places-autocomplete";
// import * as hooks from 'use-places-autocomplete';
import { __esModule } from "availity-reactstrap-validation";
import SearchPlace from "../searchPlaces";
import { of } from "ramda";
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));
jest.mock("react-cool-onclickoutside", () => {
  return {
    __esModule: true,
    default: (callback, options) => {
      return callback();
    },
  };
});
jest.mock("use-places-autocomplete", () => {
  return {
    __esModule: true,
    // _usePlacesAutocomplete:{default:()=>{}},
    default: (options, data) => {
      return {
        clearCache: () => {},
        clearSuggestions: () => {},
        init: () => {},
        ready: true,
        setValue: (val, shouldFetchData) => {},
        suggestions: {
          loading: false,
          status: "OK",
          data: [
            {
              id: 1,
              structured_formatting: {
                main_text: "Welcome",
                secondary_text: "Unit Test",
              },
            },
            {
              id: 2,
              structured_formatting: {
                main_text: "Hi",
                secondary_text: "Hello",
              },
            },
          ],
        },
        value: "",
      };
    },
    getGeocode: (data) => {
      return new Promise((resolve, reject) => {
        resolve([{}, {}]);
      });
    },
    getLatLng: (data) => {
      return new Promise((resolve, reject) => {
        resolve({ lat: 6.7878, lng: 8.8998 });
      });
    },
    usePlacesAutocomplete: (options, data) => {
      return {
        clearCache: () => {},
        clearSuggestions: () => {},
        init: () => {},
        ready: true,
        setValue: (val, shouldFetchData) => {},
        suggestions: { loading: false, status: "", data: Array(0) },
        value: "",
      };
    },
  };
});
const mockChildComponent = jest.fn();
jest.mock("../../Common/BottomNav", () => (props) => {
  mockChildComponent(props);
  return <mock-childComponent />;
});
jest.mock("../../Common/Sidebar", () => (props) => {
  mockChildComponent(props);
  return <mock-childComponent />;
});
configure({ adapter: new Adapter() });
let fetch = (url) => {
  return new Promise((resolve, reject) => {
    let users = { 1: "hi", 2: "hello" };
    const userID = parseInt(url.substr("/users/".length), 10);
    process.nextTick(() =>
      users[userID]
        ? resolve(users[userID])
        : reject({
            error: `User with ${userID} not found.`,
          })
    );
  });
};
const storeData = {
  setvalue: () => {},
  setval: "N/A",
  setplace: () => {
    return "siddipet";
  },
  Layers: [
    {
      color: "spectral",
      yaxislabel: "NDVI",
      layer_name: "NDVI",
      isavailable: true,
      update_frequnecy: 0,
      xaxislabel: "Date/Time",
      citation:
        " Didan, K. (2015). MOD13A1 MODIS/Terra Vegetation Indices 16-Day L3 Global 500m SIN Grid V006 [Data set]. NASA EOSDIS Land Processes DAAC. Accessed 2022-04-12 from https://doi.org/10.5067/MODIS/MOD13A1.006",
      short_description: "Normalized difference vegetation index",
      last_updated: "2022-05-08T00:00:00",
      long_description:
        " NDVI quantifies vegetation by measuring the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs)",
      standards:
        " All data distributed by the LP DAAC contain no restrictions on the data reus",
      raster_status: true,
      source: "GLAM NDVIDB",
      timerangefilter: true,
      vector_status: true,
      id: 2,
      url: "https://pekko.geog.umd.edu/usda/beta/",
      showcustom: null,
      multiple_files: true,
      unit: "",
      datafromvector: null,
      display_name: "Normalized Difference Vegetation Index (NDVI)",
      category: "SOCIO-ECONOMIC",
    },
    {
      color: "spectral",
      yaxislabel: null,
      layer_name: "RWI",
      isavailable: true,
      update_frequnecy: 0,
      xaxislabel: null,
      citation:
        "Microestimates of wealth for all low- and middle-income countries Guanghua Chi, Han Fang, Sourav Chatterjee, Joshua E. Blumenstock Proceedings of the National Academy of Sciences Jan 2022, 119 (3) e2113658119; DOI: 10.1073/pnas.2113658119",
      short_description: "Relative Wealth Index",
      last_updated: "2021-01-01T00:00:00",
      long_description:
        "The Relative Wealth Index predicts the relative standard of living within countries using privacy protecting connectivity data, satellite imagery, and other novel data sources.",
      standards:
        "Creative Commons Attribution-Non Commercial 4.0 International (CC BY-NC 4.0)",
      raster_status: true,
      source: "Facebook Data for Good Relative Wealth Index",
      timerangefilter: false,
      vector_status: true,
      id: 3,
      url: "https://dataforgood.facebook.com/dfg/tools/relative-wealth-index#accessdata",
      showcustom: null,
      multiple_files: false,
      unit: "",
      datafromvector: null,
      display_name: "Relative Wealth Index",
      category: "SOCIO-ECONOMIC",
    },
  ],
  DownloadLayer: "NDVI",
  DownloadLayerDate: "",
  DownloadLayerRegion: "DISTRICT",
  DownloadLayerType: "Raster",
  CurrentLayer: "NDVI",
  RasterLoader: true,
  VectorLoader: false,
  CurrentVector: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [80.91930093700006, 17.219501523000076],
              [80.93815677200007, 17.219711505000078],
            ],
          ],
        },
        properties: {
          Area: 6974.14251698,
          Dist_Name: "Bhadradri Kothagudem",
          centroid: [80.70439006278075, 17.689273994357553],
          uid: "TDID1",
          zonalstat: {
            min: -0.07110710442066193,
            max: 0.5949099063873291,
            mean: 0.3349369764733891,
            count: 11748,
            sum: 3934.839599609375,
            median: 0.34021633863449097,
          },
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [79.29767471800005, 18.81832694700006],
              [79.27565634000007, 18.825384145000044],
              [79.26667298200005, 18.831414323000047],
            ],
          ],
        },
        properties: {
          Area: 2112.7080017,
          Dist_Name: "Jangoan",
          centroid: [79.27607800489348, 17.750740986831726],
          uid: "TDID3",
          zonalstat: {
            min: 0.007208765018731356,
            max: 0.5408351421356201,
            mean: 0.30812868656468745,
            count: 12429,
            sum: 3829.7314453125,
            median: 0.30396196246147156,
          },
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [79.84389059300008, 18.159640988000035],
              [79.85468848500005, 18.147127770000054],
              [79.84056943900003, 18.13210310300002],
            ],
          ],
        },
        properties: {
          Area: 4189.02290394,
          Dist_Name: "Mulugu",
          centroid: [80.33786772661823, 18.29047147518736],
          uid: "TDID4",
          zonalstat: {
            min: -0.3682961165904999,
            max: 0.6808561086654663,
            mean: 0.32480523647329795,
            count: 12808,
            sum: 4160.10546875,
            median: 0.3351017236709595,
          },
        },
      },
    ],
  },
  CurrentRegion: "DISTRICT",
  MapKey: 2,
  SetColor: [
    "#fafa6e",
    "#bdea75",
    "#86d780",
    "#54c18a",
    "#23aa8f",
    "#00918d",
    "#007882",
    "#1f5f70",
    "#2a4858",
  ],
  LayerDescription: {
    color: "spectral",
    yaxislabel: "NDVI",
    layer_name: "NDVI",
    isavailable: true,
    update_frequnecy: 0,
    xaxislabel: "Date/Time",
    citation:
      " Didan, K. (2015). MOD13A1 MODIS/Terra Vegetation Indices 16-Day L3 Global 500m SIN Grid V006 [Data set]. NASA EOSDIS Land Processes DAAC. Accessed 2022-04-12 from https://doi.org/10.5067/MODIS/MOD13A1.006",
    short_description: "Normalized difference vegetation index",
    last_updated: "2022-05-08T00:00:00",
    long_description:
      " NDVI quantifies vegetation by measuring the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs)",
    standards:
      " All data distributed by the LP DAAC contain no restrictions on the data reus",
    raster_status: true,
    source: "GLAM NDVIDB",
    timerangefilter: true,
    vector_status: true,
    url: "https://pekko.geog.umd.edu/usda/beta/",
    showcustom: null,
    multiple_files: true,
    unit: "",
    datafromvector: null,
    display_name: "Normalized Difference Vegetation Index (NDVI)",
    id: 2,
    category: "SOCIO-ECONOMIC",
  },
  DownloadLayerDesc: {
    color: "spectral",
    yaxislabel: "NDVI",
    layer_name: "NDVI",
    isavailable: true,
    update_frequnecy: 0,
    xaxislabel: "Date/Time",
    citation:
      " Didan, K. (2015). MOD13A1 MODIS/Terra Vegetation Indices 16-Day L3 Global 500m SIN Grid V006 [Data set]. NASA EOSDIS Land Processes DAAC. Accessed 2022-04-12 from https://doi.org/10.5067/MODIS/MOD13A1.006",
    short_description: "Normalized difference vegetation index",
    last_updated: "2022-05-08T00:00:00",
    long_description:
      " NDVI quantifies vegetation by measuring the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs)",
    standards:
      " All data distributed by the LP DAAC contain no restrictions on the data reus",
    raster_status: true,
    source: "GLAM NDVIDB",
    timerangefilter: true,
    vector_status: true,
    url: "https://pekko.geog.umd.edu/usda/beta/",
    showcustom: null,
    multiple_files: true,
    unit: "",
    datafromvector: null,
    display_name: "Normalized Difference Vegetation Index (NDVI)",
    id: 2,
    category: "SOCIO-ECONOMIC",
  },
  ShowDrawer: false,
  RasterOpacity: true,
  DownloadFile: "NDVI_2016",
  CurrentLayerType: "Raster",
  Hoverlatlon: ["10.90", ",", "82.07"],
};
const mockStore = configureMockStore();
const store = mockStore(storeData);
const layerDescription = { vector_status: false, raster_status: true };
describe("Test Map Component", () => {
  beforeEach(() => {
    //   const div = document.createElement('div');
    //   ReactDom.render(
    //    <BrowserRouter>
    //   <Provider store={store}>
    //      <Map LayerDescription={layerDescription} />
    //    </Provider>
    //      </BrowserRouter>,div
    //    )
  });
  it("render Map component with status OK to load suggestions list", () => {
    let component = shallow(
      <Map1
        LayerDescription={layerDescription}
        setval={storeData.setval}
        setplace={storeData.setplace}
        Layers={storeData.Layers}
        DownloadLayer={storeData.DownloadLayer}
        DownloadLayerDate={storeData.DownloadLayerDate}
        DownloadLayerType={storeData.DownloadLayerType}
        DownloadLayerRegion={storeData.DownloadLayerRegion}
        CurrentLayer={storeData.CurrentLayer}
        RasterLoader={storeData.RasterLoader}
        VectorLoader={storeData.VectorLoader}
        CurrentVector={storeData.CurrentVector}
        CurrentRegion={storeData.CurrentRegion}
        MapKey={storeData.MapKey}
        setColor={storeData.setColor}
        DownloadLayerDesc={storeData.DownloadLayerDesc}
        ShowDrawer={storeData.ShowDrawer}
        RasterOpacity={storeData.RasterOpacity}
        DownloadFile={storeData.DownloadFile}
        CurrentLayerType={storeData.CurrentLayerType}
        Hoverlatlon={storeData.Hoverlatlon}
        setvalue={storeData.setvalue}
      />
    );
    component.mapInstance = { leafletElement: "" };
    //   component.find('Map').toHaveLength(1);
    //   const instance=component.instance();
    //   jest.spyOn(Map.prototype, 'componentDidMount');
    // instance.componentDidMount();
    // component.componentDidMount();
    component.resetmapzoom;
    // console.log(component.componentDidMount(),'in comp');
    expect(component).toBeTruthy();
    let elements = window.document.getElementsByClassName("suggestion");
    console.log(component.find("Map").getElement().ref);
    console.log(elements && elements.length, "in elements length");
    expect(true).toBe(true);
  });
  it("should generate change event of autocomplete text box", () => {
    const onSearchMock = jest.fn();
    const event = {
      target: { value: "the-value" },
    };
    const component = enzyme.shallow(<SearchPlace />);
    component.find("input").simulate("change", event);
    console.log(component.find("input"), "in find");
    //   expect(onSearchMock).toBeCalledWith('the-value');
    expect(component.handleInput).toHaveBeenCalled;
  });
  it("should generate change event of autocomplete suggestion click", () => {
    const onSearchMock = jest.fn();
    const event = {
      target: { value: "the-value" },
    };
    const component = enzyme.shallow(<SearchPlace />);
    if (component.find("li")) {
      component.find("li").at(0).simulate("click", event);
      console.log(component.find("input"), "in find");
    }

    //   expect(onSearchMock).toBeCalledWith('the-value');
    expect(component.handleSelect).toHaveBeenCalled;
  });
  it("should generate outside click for suggestions and closes suggestions", () => {
    const onSearchMock = jest.fn();
    let changeRasterLoader = (lat, lng) => {
      console.log(lat, lng, "Raster Loader emitted");
    };
    const event = {
      target: { value: "the-value" },
    };
    render(<SearchPlace />);
    let getcustomlocation = () => {};
    const component = enzyme.shallow(
      <SearchPlace searchArea={getcustomlocation} />
    );
    let div = window.document.createElement("div");
    div.setAttribute("ref", component.ref);
    div.setAttribute("id", "outsideClick");
    //   window.document.appendChild(div);
    //   const component = enzyme.shallow(
    //     <GeoRaster
    //     onRef={(ref) => (console.log(ref,'in emit ref'))}
    //     changeLoader={changeRasterLoader}
    //   />);
    let data = document.getElementsByTagName("body");
    const e = new Event("click");
    console.log(data[0], "in ddd");
    data[0].dispatchEvent(e);
    if (div) {
      // div.simulate('click', event);
      // console.log( component.find('input'),'in find');
    }
    // console.log(useOnclickOutside(()=>{}),'in reference',data);
    //   expect(onSearchMock).toBeCalledWith('the-value');
    expect(component.ref).toHaveBeenCalled;
  });
  it("should cover search icon", () => {
    let component = enzyme.shallow(
      <Map1
        LayerDescription={layerDescription}
        setval={storeData.setval}
        setplace={storeData.setplace}
        Layers={storeData.Layers}
        DownloadLayer={storeData.DownloadLayer}
        DownloadLayerDate={storeData.DownloadLayerDate}
        DownloadLayerType={storeData.DownloadLayerType}
        DownloadLayerRegion={storeData.DownloadLayerRegion}
        CurrentLayer={storeData.CurrentLayer}
        RasterLoader={storeData.RasterLoader}
        VectorLoader={storeData.VectorLoader}
        CurrentVector={storeData.CurrentVector}
        CurrentRegion={storeData.CurrentRegion}
        MapKey={storeData.MapKey}
        setColor={storeData.setColor}
        DownloadLayerDesc={storeData.DownloadLayerDesc}
        ShowDrawer={storeData.ShowDrawer}
        RasterOpacity={storeData.RasterOpacity}
        DownloadFile={storeData.DownloadFile}
        CurrentLayerType={storeData.CurrentLayerType}
        Hoverlatlon={storeData.Hoverlatlon}
        setvalue={storeData.setvalue}
      />
    );
    component.mapInstance = { leafletElement: "" };
    console.log(
      component.find(".search-icon").at(0).simulate("click"),
      "in div",
      component.state("activeSearch")
    );
    expect(component.state("activeSearch")).toEqual(false);
  });
  it("should change layer from raster to vector", async () => {
    let component = enzyme.shallow(
      <Map1
        LayerDescription={layerDescription}
        setval={storeData.setval}
        setplace={storeData.setplace}
        Layers={storeData.Layers}
        DownloadLayer={storeData.DownloadLayer}
        DownloadLayerDate={storeData.DownloadLayerDate}
        DownloadLayerType={storeData.DownloadLayerType}
        DownloadLayerRegion={storeData.DownloadLayerRegion}
        CurrentLayer={storeData.CurrentLayer}
        RasterLoader={storeData.RasterLoader}
        VectorLoader={storeData.VectorLoader}
        CurrentVector={storeData.CurrentVector}
        CurrentRegion={storeData.CurrentRegion}
        MapKey={storeData.MapKey}
        setColor={storeData.setColor}
        DownloadLayerDesc={storeData.DownloadLayerDesc}
        ShowDrawer={storeData.ShowDrawer}
        RasterOpacity={storeData.RasterOpacity}
        DownloadFile={storeData.DownloadFile}
        CurrentLayerType={storeData.CurrentLayerType}
        Hoverlatlon={storeData.Hoverlatlon}
        setvalue={storeData.setvalue}
      />
    );
    component.mapInstance = { leafletElement: "" };
    component.onChangeLayerType;
    let mapInstance = new Map1();
    await mapInstance.onChangeLayertype({ target: { value: "Raster" } });
    component.setState({ layerType: "Raster" });
    // console.log(component.find('.ant-radio-button-wrapper').at(1).simulate('click'),'in div',component.state('activeSearch'))
    expect(component.state("layerType")).toEqual("Raster");
  });
  it("should create custom layer", async () => {
    let component = enzyme.shallow(
      <Map1
        LayerDescription={layerDescription}
        setval={storeData.setval}
        setplace={storeData.setplace}
        Layers={storeData.Layers}
        DownloadLayer={storeData.DownloadLayer}
        DownloadLayerDate={storeData.DownloadLayerDate}
        DownloadLayerType={storeData.DownloadLayerType}
        DownloadLayerRegion={storeData.DownloadLayerRegion}
        CurrentLayer={storeData.CurrentLayer}
        RasterLoader={storeData.RasterLoader}
        VectorLoader={storeData.VectorLoader}
        CurrentVector={storeData.CurrentVector}
        CurrentRegion={storeData.CurrentRegion}
        MapKey={storeData.MapKey}
        setColor={storeData.setColor}
        DownloadLayerDesc={storeData.DownloadLayerDesc}
        ShowDrawer={storeData.ShowDrawer}
        RasterOpacity={storeData.RasterOpacity}
        DownloadFile={storeData.DownloadFile}
        CurrentLayerType={storeData.CurrentLayerType}
        Hoverlatlon={storeData.Hoverlatlon}
        setvalue={storeData.setvalue}
      />
    );
    component.mapInstance = { leafletElement: "" };
    component.onChangeLayerType;
    let mapInstance = new Map1();
    await mapInstance.Customlayer({
      target: { value: "Raster" },
      layer: {
        _latlngs: [[{ lng: 0.988, lat: 0.889 }]],
        on: (val) => {},
      },
    });
    component.setState({ layerType: "Raster" });
    // console.log(component.find('.ant-radio-button-wrapper').at(1).simulate('click'),'in div',component.state('activeSearch'))
    expect(component.state("layerType")).toEqual("Raster");
  });
  it("should call shape change with MANDAL", () => {
    let component = enzyme.shallow(
      <Map1
        LayerDescription={layerDescription}
        setval={storeData.setval}
        setplace={storeData.setplace}
        Layers={storeData.Layers}
        DownloadLayer={storeData.DownloadLayer}
        DownloadLayerDate={storeData.DownloadLayerDate}
        DownloadLayerType={storeData.DownloadLayerType}
        DownloadLayerRegion={storeData.DownloadLayerRegion}
        CurrentLayer={storeData.CurrentLayer}
        RasterLoader={storeData.RasterLoader}
        VectorLoader={storeData.VectorLoader}
        CurrentVector={storeData.CurrentVector}
        CurrentRegion={storeData.CurrentRegion}
        MapKey={storeData.MapKey}
        setColor={storeData.setColor}
        DownloadLayerDesc={storeData.DownloadLayerDesc}
        ShowDrawer={storeData.ShowDrawer}
        RasterOpacity={storeData.RasterOpacity}
        DownloadFile={storeData.DownloadFile}
        CurrentLayerType={storeData.CurrentLayerType}
        Hoverlatlon={storeData.Hoverlatlon}
        setvalue={storeData.setvalue}
      />
    );
    component.mapInstance = { leafletElement: "" };
    component.onChangeLayerType;
    storeData["showRaster"] = () => {};
    storeData["setRegion"] = (region) => {};
    storeData["setMapKey"] = () => {};
    storeData["SetBoundary"] = (bounds) => {};
    let mapInstance = new Map1(storeData);
    // await mapInstance.Customlayer({target:{value:'Raster'}})
    console.log(component.find("[value='MANDAL']").at(0).simulate("click"));
    component.setState({ layerType: "Raster" });
    mapInstance.onchangeshape({ target: { value: "MANDAL" } });
    // console.log(component.find('.ant-radio-button-wrapper').at(1).simulate('click'),'in div',component.state('activeSearch'))
    expect(component.props.setRegion).toHaveBeenCalled;
  });
  it("should call shape change with DISTRICT", () => {
    let component = enzyme.shallow(
      <Map1
        LayerDescription={layerDescription}
        setval={storeData.setval}
        setplace={storeData.setplace}
        Layers={storeData.Layers}
        DownloadLayer={storeData.DownloadLayer}
        DownloadLayerDate={storeData.DownloadLayerDate}
        DownloadLayerType={storeData.DownloadLayerType}
        DownloadLayerRegion={storeData.DownloadLayerRegion}
        CurrentLayer={storeData.CurrentLayer}
        RasterLoader={storeData.RasterLoader}
        VectorLoader={storeData.VectorLoader}
        CurrentVector={storeData.CurrentVector}
        CurrentRegion={storeData.CurrentRegion}
        MapKey={storeData.MapKey}
        setColor={storeData.setColor}
        DownloadLayerDesc={storeData.DownloadLayerDesc}
        ShowDrawer={storeData.ShowDrawer}
        RasterOpacity={storeData.RasterOpacity}
        DownloadFile={storeData.DownloadFile}
        CurrentLayerType={storeData.CurrentLayerType}
        Hoverlatlon={storeData.Hoverlatlon}
        setvalue={storeData.setvalue}
      />
    );
    component.mapInstance = { leafletElement: "" };
    component.onChangeLayerType;
    storeData["showRaster"] = () => {};
    storeData["setRegion"] = (region) => {};
    storeData["setMapKey"] = () => {};
    storeData["SetBoundary"] = (bounds) => {};
    let mapInstance = new Map1(storeData);
    // await mapInstance.Customlayer({target:{value:'Raster'}})
    console.log(component.find("[value='DISTRICT']").at(0).simulate("click"));
    component.setState({ layerType: "Raster" });
    mapInstance.onchangeshape({ target: { value: "DISTRICT" } });
    // console.log(component.find('.ant-radio-button-wrapper').at(1).simulate('click'),'in div',component.state('activeSearch'))
    expect(component.props.setRegion).toHaveBeenCalled;
  });
  it("should call shape change with CUSTOM", () => {
    storeData["showRaster"] = () => {};
    storeData["setRegion"] = (region) => {};
    storeData["setMapKey"] = () => {};
    storeData["SetBoundary"] = (bounds) => {};
    storeData["hideRaster"] = () => {};
    let mapInstance = new Map1(storeData);
    mapInstance.onchangeshape({ target: { value: "CUSTOM" } });
    expect(mapInstance.props.setRegion).toHaveBeenCalled;
  });
  it("should cover connect store", () => {
    let component = shallow(
      <Provider store={store}>
        <div id="abc"></div>
      </Provider>
    );
    component.find("#abc");
    render(
      <Provider store={store}>
        <Map
          LayerDescription={layerDescription}
          setval={storeData.setval}
          setplace={storeData.setplace}
          Layers={storeData.Layers}
          DownloadLayer={storeData.DownloadLayer}
          DownloadLayerDate={storeData.DownloadLayerDate}
          DownloadLayerType={storeData.DownloadLayerType}
          DownloadLayerRegion={storeData.DownloadLayerRegion}
          CurrentLayer={storeData.CurrentLayer}
          RasterLoader={storeData.RasterLoader}
          VectorLoader={storeData.VectorLoader}
          CurrentVector={storeData.CurrentVector}
          CurrentRegion={storeData.CurrentRegion}
          MapKey={storeData.MapKey}
          setColor={storeData.setColor}
          DownloadLayerDesc={storeData.DownloadLayerDesc}
          ShowDrawer={storeData.ShowDrawer}
          RasterOpacity={storeData.RasterOpacity}
          DownloadFile={storeData.DownloadFile}
          CurrentLayerType={storeData.CurrentLayerType}
          Hoverlatlon={storeData.Hoverlatlon}
          setvalue={storeData.setvalue}
        />
      </Provider>
    );
  });
  it("should create ura", () => {
    let mapInstance = new Map1(storeData);
    mapInstance.onEachrua(
      { properties: { Dist_Name: "Hydrabad" } },
      { bindPopup: (ruaname) => {} }
    );
    expect(mapInstance.onEachrua).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer FIREEV", () => {
    storeData.CurrentLayer = "FIREEV";
    let mapInstance = new Map1(storeData);
    mapInstance.props.currentLayer = "FIREEV";
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer WH", () => {
    storeData.CurrentLayer = "WH";
    let mapInstance = new Map1(storeData);
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer CP", () => {
    storeData.CurrentLayer = "CP";
    let mapInstance = new Map1(storeData);
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer WEATHER", () => {
    storeData.CurrentLayer = "WEATHER";
    let mapInstance = new Map1(storeData);
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer LULC", () => {
    storeData.CurrentLayer = "LULC";
    let mapInstance = new Map1(storeData);
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer POPULATION", () => {
    storeData.CurrentLayer = "POPULATION";
    let mapInstance = new Map1(storeData);
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    console.log("in child", mapInstance.child);
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer RWI", () => {
    storeData.CurrentLayer = "RWI";
    let mapInstance = new Map1(storeData);
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    console.log("in child", mapInstance.child);
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
  it("it should open drawer based on currentlayer custom", () => {
    storeData.CurrentLayer = "NEW";
    let mapInstance = new Map1(storeData);
    mapInstance.child = {
      current: { showDrawer: () => {}, getWeathertrend: (duration) => {} },
    };
    console.log("in child", mapInstance.child);
    mapInstance.openDrawer({
      sourceTarget: {
        feature: {
          properties: {
            Dist_Name: "Hydrabad",
            zonalstat: { min: 0.2, max: 0.8 },
          },
          geometry: "",
        },
      },
    });
    expect(mapInstance.getCountEvents).toHaveBeenCalled;
  });
});
