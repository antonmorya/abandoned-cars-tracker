import React from "react";
import { Container, Row, Col } from "reactstrap";
import SlideCarousel from "./Carousel";

const getSouces = data => {
  const srcList = data.images.split(', ')
  return srcList.map(item => ({
    src: item,
    alt: `${data.brand}, ${data.country}`
  }))
}

const CarFullInfo = props => {
  return (
    <Row>
      <Col>
        <h2>Info: {props.brand}</h2>
        <SlideCarousel items = {getSouces(props)} />
      </Col>
    </Row>
  );
};

export default CarFullInfo;
