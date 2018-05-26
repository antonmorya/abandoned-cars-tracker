import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import CarFullInfo from "./CarFullInfo";

const mapStateToProps = (state, ownProps) => {
  return { loaded: state.loaded, cars: state.cars, ownProps };
};

const getCar = (list, car) => list.filter(item => item.id == car)[0];

const ConnectedLayout = ({ loaded, cars, ownProps }) => {
  const data = loaded ? getCar(cars, ownProps.location.slice(1)) : null;
  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="here1" hidden={loaded}>
          Loading...
        </Col>
        <Col className="here" sm={10} md={9} lg={7} hidden={!loaded}>
          {data ? <CarFullInfo {...data} /> : <h1>No such car</h1>}
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
