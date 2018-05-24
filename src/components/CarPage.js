import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";

const mapStateToProps = (state, ownProps) => {
  return { loaded: state.loaded, cars: state.cars, ownProps };
};

const getCar = (list, car) => list.filter(item => item.id == car);

const ConnectedLayout = ({ loaded, cars, ownProps }) => {
  const data = loaded ? getCar(cars, ownProps.location.slice(1)) : [];
  console.log("data: ", data);
  console.log("data.length: ", data.length);
  return (
    <Container>
      <Row>
        <Col className="" hidden={loaded}>
          Loading...
        </Col>
        <Col className="" hidden={!loaded}>
          {data.length > 0 ? <h1>{data[0].brand}</h1> : <h1>No such car</h1>}
        </Col>
      </Row>
    </Container>
  );
};

const Layout = connect(mapStateToProps)(ConnectedLayout);

const CarPage = props => {
  return <Layout location={props.location.pathname} />;
};

export default CarPage;
