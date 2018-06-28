import React, { Component } from "react";
import firebase from "../../firebaseInit";
import ImageCompressor from "image-compressor.js";
import { Button, FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap";
import {
  buttonColor,
  isDisabled,
  ConvertDMSToDD,
  getGeoData,
  isValid
} from "../../helpers";
import ImgPreview from "./ImgPreview";
import Geocode from "../../helpers/geocode";

var storage = firebase.storage();
var storageRef = storage.ref("images/");

class UploaderPage extends Component {
  constructor() {
    super();
    this.state = {
      selectedFiles: null,
      compressedFiles: null,
      aboutFIles: null
    };

    this.modelInput = React.createRef();

    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.imgCompressor = this.imgCompressor.bind(this);
    this.imgInfoFiller = this.imgInfoFiller.bind(this);
    this.clearState = this.clearState.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  removeItem = index => {
    const { selectedFiles, compressedFiles, aboutFIles } = this.state;

    selectedFiles.splice(index, 1);
    compressedFiles.splice(index, 1);
    aboutFIles.splice(index, 1);

    this.setState({
      selectedFiles,
      compressedFiles,
      aboutFIles
    });
  };

  fileChangedHandler = event => {
    this.clearState();

    let filesArray = Object.values(event.target.files);

    this.setState({
      selectedFiles: filesArray
    });

    this.imgCompressor(filesArray);

    this.imgInfoFiller(filesArray);
  };

  uploadHandler = () => {
    var imageRef = storageRef.child(this.state.selectedFiles.name);
    imageRef.put(this.state.selectedFiles).then(function(snapshot) {});
  };

  imgInfoFiller = fileList => {
    let aboutFIles = [];

    fileList.forEach((item, i) => {
      window.EXIF.getData(item, function() {
        aboutFIles[i] = window.EXIF.getAllTags(this);
        const Data = this;

        const latDegree = Data.exifdata.GPSLatitude[0].numerator;
        const latMinute = Data.exifdata.GPSLatitude[1].numerator;
        const latSecond = Data.exifdata.GPSLatitude[2].numerator / 100;
        const latDirection = Data.exifdata.GPSLatitudeRef;
        const gLat = ConvertDMSToDD(
          latDegree,
          latMinute,
          latSecond,
          latDirection
        );

        const lonDegree = Data.exifdata.GPSLongitude[0].numerator;
        const lonMinute = Data.exifdata.GPSLongitude[1].numerator;
        const lonSecond = Data.exifdata.GPSLongitude[2].numerator / 100;
        const lonDirection = Data.exifdata.GPSLongitudeRef;

        const gLon = ConvertDMSToDD(
          lonDegree,
          lonMinute,
          lonSecond,
          lonDirection
        );

        Geocode.fromLatLng(gLat, gLon).then(
          response => {
            const address = response.results[0].formatted_address;

            aboutFIles[i].formattedAddress = address;
            aboutFIles[i].country = getGeoData(response, "country");
          },
          error => {
            // TODO: replace with Alert Component
            // TODO: handle an error - what file cause error then clear state
            console.error(error);
          }
        );

        aboutFIles[i].gLon = gLon;
        aboutFIles[i].gLat = gLat;
      });
    });

    this.setState({
      aboutFIles
    });
  };

  imgCompressor = fileList => {
    const imageCompressor = new ImageCompressor();
    let compressedList = [];

    const options = {
      quality: 0.8,
      maxHeight: 210
    };

    fileList.forEach((image, i) =>
      imageCompressor
        .compress(image, options)
        .then(result => {
          compressedList[i] = result;
          this.setState({
            compressedFiles: compressedList
          });
        })
        .catch(err => {
          // TODO: replace with Alert Component
          // TODO: handle an error - what file cause error then clear state
          console.error("ERROR: ", err);
        })
    );
  };

  clearState = () => {
    this.setState({
      selectedFiles: null,
      compressedFiles: null,
      aboutFIles: null
    });
  };

  render() {
    return (
      <React.Fragment>
        <FormGroup>
          <Label for="model_name">Model name</Label>
          <Input id="model_name" type="text" id="title" placeholder="" invalid = {isValid()}/>
          <FormFeedback valid>That's it!</FormFeedback>
          <FormFeedback invalid>Must input model name at least</FormFeedback>
          <FormText>BMW, Porsche, Lada</FormText>
        </FormGroup>
        <FormGroup>
        <Label for="model">Model</Label>
          <Input id="model" type="text" id="title" placeholder="" />
          <FormText>E230, 911, T-1000</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="notes">Notes</Label>
          <Input type="textarea" name="text" id="notes" />
        </FormGroup>
        <div className="input-group my-3">
          <div className="custom-file">
            <input
              type="file"
              onChange={this.fileChangedHandler}
              multiple
              className="custom-file-input"
              name="fileInput"
            />
            <label className="custom-file-label" htmlFor="fileInput">
              Choose file
            </label>
          </div>
          <div className="input-group-append">
            <Button
              type="button"
              className="btn"
              onClick={this.uploadHandler}
              color={buttonColor(
                this.state.selectedFiles,
                this.state.compressedFiles,
                this.state.aboutFIles,
                this.state.selectedFiles &&
                  this.state.compressedFiles &&
                  this.state.aboutFIles &&
                  this.state.selectedFiles.length > 0 &&
                  this.state.selectedFiles.length ===
                    this.state.compressedFiles.length &&
                  this.state.selectedFiles.length ===
                    this.state.aboutFIles.length
              )}
              disabled={isDisabled(
                this.state.selectedFiles,
                this.state.compressedFiles,
                this.state.aboutFIles,
                this.state.selectedFiles &&
                  this.state.compressedFiles &&
                  this.state.aboutFIles &&
                  this.state.selectedFiles.length > 0 &&
                  this.state.selectedFiles.length ===
                    this.state.compressedFiles.length &&
                  this.state.selectedFiles.length ===
                    this.state.aboutFIles.length
              )}
            >
              Upload!
            </Button>
          </div>
        </div>

        {this.state.selectedFiles ? (
          <ImgPreview
            filesList={this.state.selectedFiles}
            compressedList={this.state.compressedFiles}
            aboutList={this.state.aboutFIles}
            removeItem={this.removeItem}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default UploaderPage;
