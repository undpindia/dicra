import React, { useEffect, useState } from 'react';
import { useLeaflet } from 'react-leaflet';
import { isNaN } from 'lodash';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import chroma from 'chroma-js';
import geoblaze from 'geoblaze';
import { useSelector, useDispatch } from 'react-redux';
import Geocode from 'react-geocode';

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.REACT_APP_API_KEY);

// set response language. Defaults to english.
Geocode.setLanguage('en');

// Enable or disable logs. Its optional.
Geocode.enableDebug();

export default function GeoRaster({ url }) {
  const { map, layerContainer } = useLeaflet();
  const layerRef = React.useRef(null);
  const [raster, setRaster] = useState();
  const [minValue, setminValue] = useState('');
  const [maxValue, setmaxValue] = useState('');
  let dispatch = useDispatch();
  let ColorscalePicker = useSelector((state) => state.SetColor);
  let RasterOpacity = useSelector((state) => state.RasterOpacity);
  let colorscalepickerRef = React.useRef(null);
  colorscalepickerRef.current = ColorscalePicker;
  let LayeropacityRef = React.useRef(null);
  let currentLayer = useSelector((state) => state.CurrentLayer);
  let layerDesc = useSelector((state) => state.LayerDescription);
  let layertype = useSelector((state) => state.CurrentLayerType);
  const selectedLayer = useSelector((state) => state.RasterLayerUrl);
  LayeropacityRef.current = useSelector((state) => state.RasterOpacity);
  let DevColorscalePicker = useSelector((state) => state.SetDevColor);
  let DevcolorscalepickerRef = React.useRef(null);
  DevcolorscalepickerRef.current = DevColorscalePicker;
  let DevCfColorscalePicker = useSelector((state) => state.SetDevCFColor);
  let DevcfcolorscalepickerRef = React.useRef(null);
  DevcfcolorscalepickerRef.current = DevCfColorscalePicker;

  const reverseGeocodeHandler = (lat, lng) => {
    Geocode.fromLatLng(lat, lng)
      .then(
        (response) => {
          const address = response.results[0].formatted_address
            .split(' ')
            .splice(1)
            .join(' ');
          dispatch({
            type: 'SETREVERSEDGEOCODE',
            payload: address,
          });
        },
        (error) => {
          console.error(error);
        }
      )
      .then((address) => {
        return address;
      });
  };

  let removeLayer = (layer) => {
    map.removeLayer(layer);
    window.tiff = 0;
  };
  useEffect(
    () => {
      colorscalepickerRef.current = ColorscalePicker;
    },
    [ColorscalePicker],
    [RasterOpacity]
  );
  useEffect(
    () => {
      DevcolorscalepickerRef.current = DevColorscalePicker;
    },
    [DevColorscalePicker],
    [RasterOpacity]
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const georaster = await parseGeoraster(arrayBuffer);
        setminValue(georaster.mins[0]);
        setmaxValue(georaster.maxs[0]);
        setRaster(georaster);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (raster && RasterOpacity !== false ) {
      const layer = new GeoRasterLayer({
        attribution: 'Planet',
        georaster: raster,
        debugLevel: 0,
        resolution: 64,
        pixelValuesToColorFn: (values) => {
          if (layertype === 'Raster') {
            if (values == -9999) {
              return null;
            } else {
              if (values > -1 && values < 1) {
                if (
                  currentLayer === 'SOIL_M_DEV' ||
                  currentLayer === 'LAI_DPPD' ||
                  currentLayer === 'SOC_DPPD' ||
                  currentLayer === 'NDWI_DPPD' ||
                  currentLayer === 'NDVI_DPPD'
                ) {
                  const scale = chroma
                    .scale(DevcolorscalepickerRef.current)
                    .domain([-1,minValue,0,maxValue,1]);

                  const haveDataForAllBands = values.every(
                    (value) => value != false || isNaN(value)
                  );

                  if (!haveDataForAllBands) {
                    return '#00000000';
                  }

                  const color = scale(values[0]).hex();

                  return color;
                } else if (
                  currentLayer === 'LST_DPPD' ||
                  currentLayer === 'NO2_DPPD' ||
                  currentLayer === 'PM25_DPPD'
                ) {
                  const scale = chroma
                    .scale(DevcfcolorscalepickerRef.current)
                    .domain([-1,minValue,0,maxValue,1]);

                  const haveDataForAllBands = values.every(
                    (value) => value != false || isNaN(value)
                  );

                  if (!haveDataForAllBands) {
                    return '#00000000';
                  }

                  const color = scale(values[0]).hex();

                  return color;
                } else {
                  const scale = chroma
                    .scale(colorscalepickerRef.current)
                    .domain([minValue, maxValue]);

                  const haveDataForAllBands = values.every(
                    (value) => value != false || isNaN(value)
                  );

                  if (!haveDataForAllBands) {
                    return '#00000000';
                  }

                  const color = scale(values[0]).hex();

                  return color;
                }
              } else if (values >= 1) {
                if (currentLayer === 'LULC') {
                  const scale = chroma
                    .scale([
                      '#1A5BAB',
                      '#358221',
                      '#87D19E',
                      '#FFDB5C',
                      '#ED022A',
                      '#91908e',
                      '#F2FAFF',
                      '#C8C8C8',
                      '#C6AD8D',
                    ])
                    .domain([1, 2, 4, 5, 7, 8, 9, 10, 11]);
                  const haveDataForAllBands = values.every(
                    (value) => value != false || isNaN(value)
                  );

                  if (!haveDataForAllBands) {
                    return '#00000000';
                  }

                  const color = scale(values[0]).hex();

                  return color;
                } else if (currentLayer === 'crop_intensity') {
                    const scale = chroma
                      .scale([
                        '#e5e823',
                        '#30e823',
                        '#c726a1',
                        '#bfbbbe',
                      ])
                      .domain([1,2,3,4]);
                    const haveDataForAllBands = values.every(
                      (value) => value != false || isNaN(value)
                    );
  
                    if (!haveDataForAllBands) {
                      return '#00000000';
                    }
  
                    const color = scale(values[0]).hex();
  
                    return color;
                  }  else if (currentLayer === 'crop_land') {
                    const scale = chroma
                      .scale([
                        '#30e823',
                        '#bfbbbe',
                      ])
                      .domain([1,2]);
                    const haveDataForAllBands = values.every(
                      (value) => value != false || isNaN(value)
                    );
  
                    if (!haveDataForAllBands) {
                      return '#00000000';
                    }
  
                    const color = scale(values[0]).hex();
  
                    return color;
                  }  else if (currentLayer === 'crop_stress') {
                    const scale = chroma
                      .scale([
                        '#0c3816',
                        '#e5e823',
                        '#c97a20',
                        '#992314',
                        '#246e9c',
                        '#04018a',
                        '#bfbbbe',
                      ])
                      .domain([1,2,3,4,5,6,7]);
                    const haveDataForAllBands = values.every(
                      (value) => value != false || isNaN(value)
                    );
  
                    if (!haveDataForAllBands) {
                      return '#00000000';
                    }
  
                    const color = scale(values[0]).hex();
  
                    return color;
                  }  else if (currentLayer === 'crop_type' && layerDesc.id === 129) {
                    const scale = chroma
                      .scale([
                        '#00FF01',
                        '#A0522C',
                        '#01FFFF',
                        '#006401',
                        '#FFFF01',
                        '#EE82EF',
                        '#FFC0CB',
                        '#A020EF',
                        '#FFFEDF',
                        '#A52B2A',
                        '#D1B48C',
                        '#FFC0CB',
                        '#C0C0C0',
                      ])
                      .domain([1,2,3,4,5,6,7,8,9,10,11,12,13]);
                    const haveDataForAllBands = values.every(
                      (value) => value != false || isNaN(value)
                    );
  
                    if (!haveDataForAllBands) {
                      return '#00000000';
                    }
  
                    const color = scale(values[0]).hex();
  
                    return color;
                  } else if (currentLayer === 'crop_type' && layerDesc.id === 134) {
                    const scale = chroma
                      .scale([
                        '#80FF00',
                        '#80FF00',
                        '#FFFF01',
                        '#006401',
                        '#01FFFF',
                        '#FED700',
                        '#D1B48C',
                        '#FEA500',
                        '#EE82EF',
                        '#A020EF',
                        '#FF00FE',
                        '#FFC0CB',
                        '#FFFEDF',
                        '#C0C0C0'
                      ])
                      .domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
                    const haveDataForAllBands = values.every(
                      (value) => value != false || isNaN(value)
                    );
  
                    if (!haveDataForAllBands) {
                      return '#00000000';
                    }
  
                    const color = scale(values[0]).hex();
  
                    return color;
                  }else if (currentLayer === 'crop_type' && layerDesc.id === 135) {
                    const scale = chroma
                      .scale([
                        '#00FF01',
                        '#80FF00',
                        '#F6F6DC',
                        '#FFFF01',
                        '#EE82EF',
                        '#A020EF',
                        '#FFB6C1',
                        '#D1B48C',
                        '#A52B2A',
                        '#FFC0CB',
                        '#F6F6DC',
                        '#C0C0C0'
                      ])
                      .domain([1,2,3,4,5,6,7,8,9,10,11,12]);
                    const haveDataForAllBands = values.every(
                      (value) => value != false || isNaN(value)
                    );
  
                    if (!haveDataForAllBands) {
                      return '#00000000';
                    }
  
                    const color = scale(values[0]).hex();
  
                    return color;
                  } else {
                  const scale = chroma
                    .scale(colorscalepickerRef.current)
                    .domain([minValue, maxValue]);
                  const haveDataForAllBands = values.every(
                    (value) => value != false || isNaN(value)
                  );

                  if (!haveDataForAllBands) {
                    return '#00000000';
                  }

                  const color = scale(values[0]).hex();

                  return color;
                }
              }
            }
          }
        },
      });

      // this.props.setrasterlatlon([60.732421875, 80.67555881973475])
      map.on('mousemove', async (evt) => {
        //  console.log("EVT", evt.latlng)
        dispatch({
          type: 'SETLATLON',
          payload: [
            parseFloat(evt.latlng.lng).toFixed(2),
            ',',
            parseFloat(evt.latlng.lat).toFixed(2),
          ],
        });
        if (
          currentLayer === 'NO2' ||
          currentLayer === 'SOIL_M_DEV' ||
          currentLayer === 'LST_DPPD' ||
          currentLayer === 'LAI_DPPD' ||
          currentLayer === 'NO2_DPPD' ||
          currentLayer === 'PM25_DPPD' ||
          currentLayer === 'SOC_DPPD' ||
          currentLayer === 'NDWI_DPPD' ||
          currentLayer === 'NDVI_DPPD'
        ) {
          if (layertype === 'Raster') {
            const latlng = [evt.latlng.lng, evt.latlng.lat];
            let result = await geoblaze.identify(raster, latlng);
            result = result
              ? result.filter((result) => result !== -9999)
              : null;
            result = result ? parseFloat(result).toFixed(6) : null;
            // console.log("LayerType", layertype);
            if (layertype === 'Raster') {
              localStorage.setItem('valnow', result);
              dispatch({ type: 'SETVALUE', payload: result });
            }
          }
        } else {
          if (layertype === 'Raster') {
            const latlng = [evt.latlng.lng, evt.latlng.lat];
            let result = await geoblaze.identify(raster, latlng);
            result = result
              ? result.filter((result) => result !== -9999)
              : null;
            result = result ? parseFloat(result).toFixed(2) : null;
            // console.log("LayerType", layertype);
            if (layertype === 'Raster') {
              localStorage.setItem('valnow', result);
              dispatch({ type: 'SETVALUE', payload: result });
            }
          }
        }
      });

      map.on('click', async (evt) => {
        if (layertype === 'Raster') {
          var loc = [evt.latlng.lat, evt.latlng.lng];
          localStorage.setItem('location', JSON.stringify(loc));
          dispatch({
            type: 'ADD_MARKER',
            payload: loc,
          });
          let pos = [evt.latlng.lng, evt.latlng.lat];
          let results = await geoblaze.identify(raster, pos);
          results = results
            ? results.filter((results) => results !== -9999)
            : '0.0';
          results = results ? results : null;
          dispatch({ type: 'SETPIXELVALUE', payload: results });

          reverseGeocodeHandler(evt.latlng.lat, evt.latlng.lng);
        } else {
          console.log();
        }
      });

      layerRef.current = layer;
      const container = layerContainer || map;

      container.addLayer(layer);
    }
    return () => {
      if (map && layerRef.current) {
        map.removeLayer(layerRef.current);
      }
      dispatch({
        type: 'SETRASLATLON',
        payload: [60.732421875, 80.67555881973475],
      });
    };
  }, [raster, map, layerContainer, selectedLayer]);
  return null;
}
