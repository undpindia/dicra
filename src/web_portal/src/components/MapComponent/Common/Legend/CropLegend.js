import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../Sidebar.css';
const CropLegend = (props) =>  {
const LayerDesc = useSelector((state) => state.LayerDescription);

  return (
    <div className="legend-section-lulc">
    <div className="container" style={LayerDesc.layer_name === 'crop_intensity' ? {} : {display:"none"}}>
      <div
        className="row"
        style={{
          textAlign: 'left',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFFF00',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Single Crop
            </div>
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#00FF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Double Crop
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FF00FE',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Triple Crop
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C0C0C0',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Other LULC
            </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
    <div className="container" style={LayerDesc.layer_name === 'crop_land' ? {} : {display:"none"}}>
      <div
        className="row"
        style={{
          textAlign: 'left',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#00FF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Cropland
            </div>
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C0C0C0',
                  display: 'inline-block',
                }}
              ></span>{' '}
              NonCropland
            </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
    <div className="container" style={LayerDesc.layer_name === 'crop_type' && LayerDesc.id === 129 ? {} : {display:"none"}}>
      <div
        className="row"
        style={{
          textAlign: 'left',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#00FF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-DC-rice-rice
            </div>
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#A0522C',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Irrigated-DC-rice-pulses
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#01FFFF',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-DC-pulses/maize-maize
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#006401',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-sugarcane
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFFF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Rainfed-DC-cotton-rice
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#EE82EF',
                  display: 'inline-block',
                }}
              ></span>{' '}
                Rainfed-DC-sorghum-chickpea/fallow        
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFC0CB',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-rice-fallow
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C0C0C0',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-pigeonpea/ groundnut
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#A020EF',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-cotton/groundnut
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#A52B2A',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Rainfed-SC-pulses
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#D1B48C',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Rainfed-groundnut
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFC0CB',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Mixed crops
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C0C0C0',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Other LULC
            </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
    <div className="container" style={LayerDesc.layer_name === 'crop_type' && LayerDesc.id === 134 ? {} : {display:"none"}}>
      <div
        className="row"
        style={{
          textAlign: 'left',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#00FF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-DC-rice-pulses
            </div>
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#80FF00',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Irrigated-TC-pulses/rice-rice
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFFF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-DC-maize/potato-wheat
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#006401',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-sugarcane
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#01FFFF',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-DC-pulses/maize-wheat
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FED700',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-supplemental-DC-cotton
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#D1B48C',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC_pigeonpea/ groundnut
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FEA500',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-cotton/groundnut
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#E0697B',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-millet
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#A020EF',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Rainfed-DC-sorghum-chickpea/fallow 
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FF00FE',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Rainfed-SC-pulses
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFC0CB',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-rice-fallow
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFFEDF',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Mixed crops
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C0C0C0',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Other LULC
            </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
    <div className="container" style={LayerDesc.layer_name === 'crop_type' && LayerDesc.id === 135 ? {} : {display:"none"}}>
      <div
        className="row"
        style={{
          textAlign: 'left',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#00FF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-DC-rice-rice/pulses
            </div>
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#80FF00',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Irrigated-TC-pulses/rice-rice
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#F6F6DC',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Irrigated-DC-pulses/maize-maize
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFFF01',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Rainfed-supplemental-DC-cotton
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#EE82EF',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Rainfed-SC-_pigeonpea/ groundnut
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#A020EF',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-coton/groundnut
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#E0697B',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-millet
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#D1B48C',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-DC-sorghum-chickpea/fallow
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#A52B2A',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Rainfed-SC-pulses
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFC0CB',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Rainfed-SC-rice-fallow
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#F6F6DC',
                  display: 'inline-block',
                }}
              ></span>{' '}
             Mixed crops
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C0C0C0',
                  display: 'inline-block',
                }}
              ></span>{' '}
               Other LULC
            </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
    <div className="container" style={LayerDesc.layer_name === 'crop_stress' ? {} : {display:"none"}}>
      <div
        className="row"
        style={{
          textAlign: 'left',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#005F01',
                  display: 'inline-block',
                }}
              ></span>{' '}
             No crop stress
            </div>
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFFF00',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Mild stress
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FF9F00',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Moderate stress
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FE0000',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Severe stress
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#009EDF',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Cropland/cloud
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#0000FE',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Water bodies
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C0C0C0',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Other LULC
            </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
  </div>
  );
}
export default CropLegend;
