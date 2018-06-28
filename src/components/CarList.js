import React from "react";
import { connect } from "react-redux";
import CarCard from "./CarCard";
import { Row, Col } from "reactstrap";

const mapStateToProps = state => {
  return { cars: state.cars };
};

const ConnectedCarList = ({ cars }) => (
  <Row className="pt-2">
    <Col xs="12" className="d-flex flex-row flex-wrap">
      {cars.map(car => <CarCard key={car.id} car={car} />)}
    </Col>
  </Row>
);

const CarsList = connect(mapStateToProps)(ConnectedCarList);

export default CarsList;
