import React from "react";
import { connect } from "react-redux";
import CarCard from "./CarCard";

const mapStateToProps = state => {
  return { cars: state.cars };
};

const ConnectedCarList = ({ cars }) =>
  cars.map(car => <CarCard key={car.id} car={car} />);

const CarsList = connect(mapStateToProps)(ConnectedCarList);

export default CarsList;
