import React from "react";
import { Row, Col, Label } from "reactstrap";
import SlideCarousel from "./Carousel";

// const imgPlaceholder = [{
//   src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABkAAAASwAQMAAACZzxTUAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURTAwMHqO3hUAAAD/SURBVBgZ7cEBAQAAAIKg/q92SMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBArl0AATy1GXQAAAAASUVORK5CYII=',
//   alt: 'just a placeholder'
// }]

const getSouces = data => {
  const srcList = data.images.split(",");
  return srcList.map(item => ({
    src: item,
    alt: `${data.brand}, ${data.country}`
  }));
};

const descriptionLabels = (key, value) => (
  <Row>
    <Label className="col-4">{key}</Label>
    <Label className="col-8 fw-500">{value}</Label>
  </Row>
);

const CarFullInfo = props => {
  const { heroImage } = props;

  return (
    <div>
      <Row className="mb-4">
        <Col sm={12}>
          <SlideCarousel items={getSouces(props)} />
        </Col>
      </Row>
      {props.brand ? descriptionLabels("Brand", props.brand) : null}
      {props.EXIFdata[heroImage].formattedAddress
        ? descriptionLabels(
            "Address",
            props.EXIFdata[heroImage].formattedAddress
          )
        : null}
      {props.EXIFdata[heroImage].DateTimeOriginal
        ? descriptionLabels("Time", props.EXIFdata[heroImage].DateTimeOriginal)
        : null}
    </div>
  );
};

export default CarFullInfo;
