import React, { Component } from "react";
import Navbar from "./components/Navbar";
import firebase from './firebaseInit';
import { Container, Row, Col } from "reactstrap";
import CarList from "./components/CarList";
import { connect } from "react-redux";
import { updateList } from "./actions";
import CarPage from "./components/CarPage";
import UploaderPage from "./components/Uploader";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
      function (snapshot) {
        updateCars(snapshot.val());
      },
      function (errorObject) { }
    );
  }

  render() {
    return (
      <Router>
        <div className="">
          <Navbar />
          <Container fluid>
            <Switch>
              <Route exact path="/" component={CarList} />
              <Route path="/car/*" component={CarPage} />
              <Route path="/add" component={UploaderPage} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

const App = connect(null, mapDispatchToProps)(ConnectedApp);

export default App;
