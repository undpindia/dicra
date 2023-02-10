import React, { useEffect, useRef } from "react";
import { useLeaflet } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import chroma from "chroma-js";
import geoblaze from "geoblaze";
import "antd/dist/antd.css";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
export default function GeoRaster(props) {
  let dispatch = useDispatch();
  let { map, layerContainer } = useLeaflet();
  let currentLayer = useSelector((state) => state.CurrentLayer);

  let RasterOpacity = useSelector((state) => state.RasterOpacity);
  let ColorscalePicker = useSelector((state) => state.SetColor);
  let currentlayerType = useSelector((state) => state.CurrentLayerType);
  let removeLayer = (layer) => {
    map.removeLayer(layer);
    window.tiff = 0;
  };
  let colorscalepickerRef = React.useRef(null);
  colorscalepickerRef.current = ColorscalePicker;
  let layerRef = React.useRef(null);
  let layermin = React.useRef(null);
  let layermax = React.useRef(null);
  let layerrange = React.useRef(null);
  var scale;
  let currentLayerNow = useRef();
  const changeLayer = useRef(() => {
    setTimeout(function () {
      getColorFromValues();
    }, 700);
  });
  let LayeropacityRef = React.useRef(null);
  LayeropacityRef.current = useSelector((state) => state.RasterOpacity);
  const addLayerRef = useRef(() => {
    addlayer();
  });

  useEffect(() => {
    colorscalepickerRef.current = ColorscalePicker;
    changeLayer.current();
  }, [ColorscalePicker, RasterOpacity]);
  useEffect(() => {
    currentLayerNow.current = currentLayer;
    if(currentlayerType === "Raster" || window.layerType === "Raster"){
      addLayerRef.current();
    } else
    {
      console.log()
    }
  }, [currentLayer, currentlayerType]);

  async function addlayer() {
    props.changeLoader(17.754639747121828, 79.05833831966801);
    var url =
      "https://api-dicra.misteo.co/currentraster?parameter=" +
      currentLayerNow.current;
    fetch(url).then((response) => {
      const container = layerContainer || map;
      let layer;
      if (layerRef.current) {
        removeLayer(layerRef.current);
      }

      response.blob().then((blob) => {
        try {
          geoblaze.load(blob).then((georaster) => {
            var min = georaster.mins[0];
            var max = georaster.maxs[0];
            var range;
            layermin.current = min;
            layermax.current = max;
              range = georaster.ranges[0];
              layerrange.current = range;
              scale = chroma
                .scale(colorscalepickerRef.current)
                .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
            window.tiff = georaster;
            layer = new GeoRasterLayer({
              georaster,
              opacity: 1.0,
              resolution: 128,
              debugLevel: 0,
              pixelValuesToColorFn: (values) => {
                var pixelValue = values[0];
                if(currentLayerNow.current === "LULC"){
                  if(pixelValue === 1){
                    return "#1A5BAB";
                  }
                  if(pixelValue === 2){
                    return "#358221";
                  }
                  if(pixelValue === 4){
                    return "#87D19E";
                  }
                  if(pixelValue === 5){
                    return "#FFDB5C";
                  }
                  if(pixelValue === 7){
                    return "#ED022A";
                  }
                  if(pixelValue === 8){
                    return "#91908e";
                  }
                  if(pixelValue === 9){
                    return "#F2FAFF";
                  }
                  if(pixelValue === 10){
                    return "#C8C8C8";
                  }
                  if(pixelValue === 11){
                    return "#C6AD8D";
                  }
                  else{
                    console.log()
                  }
                  
                }
                else if (pixelValue < min) {
                  return null;
                } else if (pixelValue > max) {
                  return "#757575";
                } else {
                  var scaledPixelvalue = (pixelValue - min) / range;
                  var color = scale(scaledPixelvalue).hex();
                  return color;
                }
              },
            });

            map.on("mousemove", function (evt) {
              if (window.layerType === "Raster" ) {
                var latlng = map.mouseEventToLatLng(evt.originalEvent);
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
                if (Number(result) > layermin.current) {
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
          var pixelValue = values[0];
          if (currentLayerNow.current === "LULC") {
            if(pixelValue === 1){
              return "#1A5BAB";
            }
            if(pixelValue === 2){
              return "#358221";
            }
            if(pixelValue === 4){
              return "#87D19E";
            }
            if(pixelValue === 5){
              return "#FFDB5C";
            }
            if(pixelValue === 7){
              return "#ED022A";
            }
            if(pixelValue === 8){
              return "#91908e";
            }
            if(pixelValue === 9){
              return "#F2FAFF";
            }
            if(pixelValue === 10){
              return "#C8C8C8";
            }
            if(pixelValue === 11){
              return "#C6AD8D";
            }
            else{
              console.log()
            }
           
          } else {
            newScale = chroma
              .scale(colorscalepickerRef.current)
              .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
            scaledPixelvalue =
              (values[0] - layermin.current) / layerrange.current;
            color = newScale(scaledPixelvalue).hex();
            return color;
          }
        }
      });
    }
  }

  return null;
}
