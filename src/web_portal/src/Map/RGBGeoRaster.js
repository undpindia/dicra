import React, { useEffect, useRef } from "react";
import { useLeaflet } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import chroma from "chroma-js";
import geoblaze from "geoblaze";
import "antd/dist/antd.css";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
export default function GeoRaster(props) {
  // const { changeRasterLoader } = props;
  let dispatch = useDispatch();
  let { map, layerContainer } = useLeaflet();
  let currentLayer = useSelector((state) => state.CurrentLayer);
  let RasterOpacity = useSelector((state) => state.RasterOpacity);
  let ColorscalePicker = useSelector((state) => state.SetColor);
  // let [layerrange, setLayerrange] = useState(0);
  let removeLayer = (layer) => {
    map.removeLayer(layer);
    window.tiff = 0;
  };
  let colorscalepickerRef=React.useRef(null)
  colorscalepickerRef.current=ColorscalePicker
  let layerRef = React.useRef(null);
  let layermin =  React.useRef(null);
  let layermax =  React.useRef(null);
  let layerrange =  React.useRef(null);
  var scale;
  let currentLayerNow = useRef();
  const changeLayer = useRef(() => {
    setTimeout(function () {
      getColorFromValues();
    }, 700);
  });
  let LayeropacityRef= React.useRef(null);
  LayeropacityRef.current=useSelector((state) => state.RasterOpacity)
  const addLayerRef = useRef(() => {
    addlayer();
    // props.onRef(undefined);
  });

  useEffect(() => {
    colorscalepickerRef.current=ColorscalePicker
    changeLayer.current();
  }, [ColorscalePicker, RasterOpacity]);
  useEffect(() => {
    // addlayer();
    currentLayerNow.current = currentLayer;
    addLayerRef.current();
    // props.onRef(undefined);
  }, [currentLayer]);

  async function addlayer() {
    props.changeLoader(17.754639747121828, 79.05833831966801);
    var url =
      "https://internalapidev.chickenkiller.com/currentraster?parameter=" +
      currentLayerNow.current;
    fetch(url).then((response) => {
      const container = layerContainer || map;
      let layer;
      if (layerRef.current) {
        removeLayer(layerRef.current);
        // layerRef.current = null;
        // window.tiff = 0;
      }

      response.blob().then((blob) => {
        try {
          geoblaze.load(blob).then((georaster) => {
            var min = georaster.mins[0];
            var max = georaster.maxs[0];
            var range;
            layermin.current=min
            layermax.current=max
            // setLayermin(min);
            // setLayermax(max);

            if (currentLayerNow.current === "LULC") {
              range = georaster.ranges[0];
              layerrange.current=range
              // setLayerrange(range);
              //  var scale = chroma.scale("Spectral").domain([0, 1]);
              scale = chroma.scale([
                "#dc0f0f",
                "#44ce5d",
                "#7533e6",
                "#de8313",
                "#dfef4d",
                "#98e16e",
                "#bb3cc9",
                "#455dca",
                "#3feabd",
                "#cf3c8d",
                "#64caef",
              ]);

              window.tiff = georaster;
            } else {
              range = georaster.ranges[0];
              layerrange.current=range
              // setLayerrange(range);
              // var scale = chroma.scale("Spectral").domain([0, 1]);
              scale = chroma
                .scale(colorscalepickerRef.current)
                .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
            }
            window.tiff = georaster;
            layer = new GeoRasterLayer({
              // attribution: "Planet",
              georaster,
              opacity: 1.0,
              resolution: 128,
              debugLevel: 0,
              // pane: 'something',
              pixelValuesToColorFn: (values) => {
                var pixelValue = values[0];
                // console.log("DATA VALUE",pixelValue)
                if (pixelValue < min) {
                  return null;
                } else if (pixelValue > max) {
                  return "#757575";
                } else {
                  var scaledPixelvalue = (pixelValue - min) / range;
                  var color = scale(scaledPixelvalue).hex();
                  return color;
                }
              },
              // onEachFeature : (feature, layer) => {
              //   layer.on('mouseover', function (e) {

              //   });
              // }
            });

            map.on("mousemove", function (evt) {
              if (window.layerType === "Raster") {
                // console.log("RASTER HOVER ", window.layerType);
                var latlng = map.mouseEventToLatLng(evt.originalEvent);
                // getcurrentvalue(latlng.lng, latlng.lat);
                dispatch({
                  type: "SETLATLON",
                  payload: [
                    parseFloat(latlng.lat).toFixed(2),
                    ",",
                    parseFloat(latlng.lng).toFixed(2),
                  ],
                });
                let result = geoblaze.identify(georaster, [
                  latlng.lng,
                  latlng.lat,
                ]);
                if (Number(result) > 0.0) {
                  result = parseFloat(result).toFixed(2);
                  dispatch({ type: "SETVALUE", payload: result });
                } else {
                  dispatch({ type: "SETVALUE", payload: "N/A" });
                }
              }
            });

            layerRef.current = layer;
            container.addLayer(layer);
            dispatch({
              type: "ENABLERASTER",
            });
            props.changeLoader(60.732421875, 80.67555881973475);
          });
        } catch (err) {
          message.error("Failed to connect to server");
        }

        return () => map.removeLayer(layerRef.current);
      });
    });
  }

  function getColorFromValues() {
   
    if (layerRef.current) {
      layerRef.current.updateColors(function (values) {
        // break;
        var newScale;
        var scaledPixelvalue;
        var color;
        if (LayeropacityRef.current === false) {
          return null;
        } else {
          if (values[0] < layermin.current) {
            return null;
          } else if (values[0] > layermax.current) {
            return "#757575";
          }
          if (currentLayerNow.current === "LULC") {
            newScale = chroma.scale([
              "#dc0f0f",
              "#44ce5d",
              "#7533e6",
              "#de8313",
              "#dfef4d",
              "#98e16e",
              "#bb3cc9",
              "#455dca",
              "#3feabd",
              "#cf3c8d",
              "#64caef",
            ]);
            scaledPixelvalue = (values[0] - layermin.current) / layerrange.current;
            color = newScale(scaledPixelvalue).hex();
            return color;
          } else {
            newScale = chroma
              .scale(colorscalepickerRef.current)
              .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
            scaledPixelvalue = (values[0] - layermin.current) / layerrange.current;
            color = newScale(scaledPixelvalue).hex();
            // console.log("COLOR",colorscalepickerRef.current)
            return color;
          }
        }
      });
    }
  }

  return null;
}
