import React from 'react';
import '../Sidebar.css';
function LulcLegend() {
 
  return (
    <div className="legend-section-lulc">
    <div className="container">
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
                  backgroundColor: '#1A5BAB',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Water
            </div>
            <div className="col" style={{ marginTop: '10px' }}>
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#358221',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Trees
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#87D19E',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Flooded Vegetation
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#FFDB5C',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Crops
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#ED022A',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Built Area
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#91908e',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Bare Ground
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#F2FAFF',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Snow / Ice
            </div>
            <div className="col">
              <span
                style={{
                  height: '12px',
                  width: '12px',
                  backgroundColor: '#C8C8C8',
                  display: 'inline-block',
                }}
              ></span>{' '}
              Clouds
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="col">
                <span
                  style={{
                    height: '12px',
                    width: '12px',
                    backgroundColor: '#C6AD8D',
                    display: 'inline-block',
                  }}
                ></span>{' '}
                Rangeland
              </div>
            </div>
          </div>
        </div>
        <div className="mb-2"></div>
      </div>
    </div>
  </div>
  );
}
export default LulcLegend;
