import React, { Component } from "react";
import Navbar from "./components/Navbar";
import { Container, Row, Col } from "reactstrap";
import CarList from "./components/CarList";
import firebase from "firebase";
import { connect } from "react-redux";
import { updateList } from "./actions";
import CarPage from "./components/CarPage";
import { config } from "./firebaseConfig";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

firebase.initializeApp(config);

const mapDispatchToProps = dispatch => {
  return {
    updateList: cars => dispatch(updateList(cars))
  };
};

class ConnectedApp extends Component {

  componentDidMount() {
    const rootRef = firebase
      .database()
      .ref()
      .child("cars");

    const updateCars = this.props.updateList;

    rootRef.on(
      "value",
      function(snapshot) {
        updateCars(snapshot.val());
      },
      function(errorObject) {}
    );
  }

  render() {
    return (
      <Router>
        <div className="">
          <Navbar />
          <Container fluid>
            <Row className='pt-2'>
              <Col xs="12" className="d-flex flex-row flex-wrap">
                <Switch>
                  <Route exact path="/" component={CarList} />
                  <Route path="/*" component={CarPage} />
                </Switch>
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
    );
  }
}

const App = connect(null, mapDispatchToProps)(ConnectedApp);

export default App;
