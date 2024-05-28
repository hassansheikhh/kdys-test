import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const RangeSlider = ({ resultsFromBiomaker }) => {
  const marks = {
    0: '0',
    10: '10',
    20: '20',
    47: '47',
    57: '57',
  };

  // Determine the slider value based on resultsFromBiomaker
  const sliderValue = resultsFromBiomaker.length > 0 ? resultsFromBiomaker[0] : 0;

  // Determine the track color based on the slider value
  const getTrackColor = (value) => {
    if (value >= 0 && value <= 10) return 'red';
    if (value >= 11 && value <= 20) return 'yellow';
    if (value >= 21 && value <= 47) return 'green';
    if (value >= 48 && value <= 57) return 'yellow';
    if (value > 57) return 'red';
    return 'transparent';
  };

  const trackColor = getTrackColor(sliderValue);

  return (
    <Container>
      <Row>
        <Col>
          <div className="slider-container">
            <div className="slider-background">
              <div className="slider-segment red" style={{ width: '17.54%' }}></div>
              <div className="slider-segment yellow" style={{ width: '17.54%' }}></div>
              <div className="slider-segment green" style={{ width: '47.37%' }}></div>
              <div className="slider-segment yellow" style={{ width: '17.54%' }}></div>
              <div className="slider-segment red" style={{ width: '0.02%' }}></div>
            </div>
            <Slider
              min={0}
              max={60}
              marks={marks}
              step={null}
              value={sliderValue}
              railStyle={{ backgroundColor: trackColor, height: '10px' }}
              trackStyle={{ backgroundColor: trackColor, height: '10px' }}
              handleStyle={{
                borderColor: '#0d6efd',
                backgroundColor: '#ffcc00',
                height: '20px',
                width: '20px',
                marginLeft: '-10px',
                marginTop: '-5px',
              }}
              dotStyle={{ display: 'none' }}
            />
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center w-100">
        <Col className="mt-3">
          <div className="legend">
            <span className="legend-item red">0 - 10</span>
            <span className="legend-item yellow">10 - 20</span>
            <span className="legend-item green">20 - 47</span>
            <span className="legend-item yellow">47 - 57</span>
            <span className="legend-item red">57+</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RangeSlider;
