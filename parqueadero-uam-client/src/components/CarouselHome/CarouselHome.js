import React from 'react'
import { Carousel, Radio } from 'antd';
import { useState } from 'react';
import "./CarouselHome.scss";

export const CarouselHome = () => {
    const [dotPosition, setDotPosition] = useState('top');
    const handlePositionChange = ({ target: { value } }) => {
        setDotPosition(value);
    };
  return (
    <>
      <Radio.Group
        onChange={handlePositionChange}
        value={dotPosition}
        style={{
          marginBottom: 8,
        }}
      >
        <Radio.Button value="top">Top</Radio.Button>
        <Radio.Button value="bottom">Bottom</Radio.Button>
        <Radio.Button value="left">Left</Radio.Button>
        <Radio.Button value="right">Right</Radio.Button>
      </Radio.Group>
      <Carousel dotPosition={dotPosition}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
      </Carousel>
    </>
  )
}
