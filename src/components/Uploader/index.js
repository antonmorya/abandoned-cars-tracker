import React, { Component } from "react";
import firebase from "../../firebaseInit";
import ImageCompressor from "image-compressor.js";
import { Media, Row, Col, Container, Label, Button } from "reactstrap";

var storage = firebase.storage();
var storageRef = storage.ref("images/");

function buttonColor(...args) {
  console.log("args: ", args);
  return args.every(item => !!item) ? "success" : "danger";
}

const DescriptionLabelRow = props => {
  const { headerLabel, bodyLabel, rowClasses, colClasses } = props;

  return (
    <Row className={rowClasses}>
      <Col className={colClasses}>
        <Label className="font-weight-bold">{headerLabel}</Label>
        <Label className="ml-3">{bodyLabel}</Label>
      </Col>
    </Row>
  );
};

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

const imgPreview = (filesList, compressedList, aboutList, removeItem) => {
  let nodeList = [];
  const count = filesList.length;

  for (let i = 0; i < count; i++) {
    /* console.log("aboutList: ", aboutList);
    console.log(
      "compressedList.length: ",
      compressedList ? compressedList.length : null
    ); */

    nodeList.push(
      filesList[i] ? (
        <Media key={filesList[i].name} className="mb-4 flex-column flex-md-row">
          <Media left>
            <Media
              object
              alt=""
              data-src={
                compressedList && compressedList[i]
                  ? URL.createObjectURL(compressedList[i])
                  : ""
              }
              src={
                compressedList && compressedList[i]
                  ? URL.createObjectURL(compressedList[i])
                  : ""
              }
            />
          </Media>
          <Media body>
            <Media heading className="px-0 px-md-3">
              {compressedList && compressedList[i] ? (
                <Button size="sm" color="danger" onClick={() => removeItem(i)}>
                  remove
                </Button>
              ) : (
                "Generating preview"
              )}
            </Media>
            <Container fluid>
              {aboutList &&
              aboutList[i] &&
              compressedList &&
              compressedList[i] ? (
                <React.Fragment>
                  <DescriptionLabelRow
                    colClasses="px-0 px-md-3"
                    rowClasses=""
                    headerLabel="Local time:"
                    bodyLabel={aboutList[i].DateTimeOriginal}
                  />
                  <DescriptionLabelRow
                    colClasses="px-0 px-md-3"
                    rowClasses=""
                    headerLabel="Camera:"
                    bodyLabel={aboutList[i].Model}
                  />
                  <DescriptionLabelRow
                    colClasses="px-0 px-md-3"
                    rowClasses=""
                    headerLabel="Made:"
                    bodyLabel={`${aboutList[i].gLat} x ${aboutList[i].gLon}`}
                  />
                </React.Fragment>
              ) : null}
            </Container>
          </Media>
        </Media>
      ) : null
    );
  }

  return nodeList;
};

class UploaderPage extends Component {
  constructor() {
    super();
    this.state = {
      selectedFiles: null,
      compressedFiles: null,
      aboutFIles: null
    };

    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.imgCompressor = this.imgCompressor.bind(this);
    this.imgInfoFiller = this.imgInfoFiller.bind(this);
    this.imgCompressor = this.imgCompressor.bind(this);
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
    console.log("uploadHandler", this.state.selectedFiles.name);
    imageRef.put(this.state.selectedFiles).then(function(snapshot) {
      console.log("Uploaded a blob or file!");
      console.log("imageRef: ", imageRef);
    });
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
          console.log("ERROR: ", err);
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
            >
              Upload!
            </Button>
          </div>
        </div>

        {this.state.selectedFiles
          ? imgPreview(
              this.state.selectedFiles,
              this.state.compressedFiles,
              this.state.aboutFIles,
              this.removeItem
            )
          : null}
      </React.Fragment>
    );
  }
}

export default UploaderPage;
