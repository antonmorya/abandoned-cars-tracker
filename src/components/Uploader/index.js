import React, { Component } from "react";
import firebase from "../../firebaseInit";
import ImageCompressor from "image-compressor.js";
import {
  Button,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  FormText,
  Alert
} from "reactstrap";
import {
  buttonColor,
  isDisabled,
  ConvertDMSToDD,
  getGeoData,
  isInvalid,
  isArrayValid
} from "../../helpers";
import ImgPreview from "./ImgPreview";
import Geocode from "../../helpers/geocode";

let storage = firebase.storage();
let storageRef = storage.ref("images/");
let previewStorageRef = storage.ref("prevs/");
let database = firebase.database();

class UploaderPage extends Component {
  constructor() {
    super();
    this.state = {
      brand: "",
      model: "",
      notes: "",
      selectedFiles: null,
      compressedFiles: null,
      aboutFIles: null,
      imgURLs: [],
      prevURLs: [],
      imgUploaded: false,
      prevUploaded: false,
      heroImage: 0
    };

    this.modelInput = React.createRef();

    this.fileChangeHandler = this.fileChangeHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.imgCompressor = this.imgCompressor.bind(this);
    this.imgInfoFiller = this.imgInfoFiller.bind(this);
    this.clearState = this.clearState.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.stateSetter = this.stateSetter.bind(this);
    this.filesAreUploaded = this.filesAreUploaded.bind(this);
    this.databaseSendInfo = this.databaseSendInfo.bind(this);
    this.setPrimary = this.setPrimary.bind(this);
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

  setPrimary = index => {
    this.setState({
      heroImage: index
    });
  };

  fileChangeHandler = event => {
    this.clearState();

    let filesArray = Object.values(event.target.files);

    this.setState({
      selectedFiles: filesArray
    });

    this.imgCompressor(filesArray);

    this.imgInfoFiller(filesArray);
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  uploadHandler = () => {
    const self = this;
    const stateSetter = this.stateSetter;
    const files = this.state.selectedFiles;
    const controlLength = self.state.selectedFiles.length;
    let imgURLs = [];
    let prevURLs = [];

    files.forEach((file, i) => {
      let imageUploadTask = storageRef.child(file.name).put(file);
      let previewUploadTask = previewStorageRef
        .child(`prev_${file.name}`)
        .put(this.state.compressedFiles[i]);

      imageUploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // "Upload is " + progress + "% done";
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              // "Upload is paused";
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              // "Upload is running";
              break;
          }
        },
        function(error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;

            case "storage/canceled":
              // User canceled the upload
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          imageUploadTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              imgURLs[i] = downloadURL;
              stateSetter({ imgURLs: imgURLs });
              if (controlLength === self.state.imgURLs.length) {
                self.setState({ imgUploaded: true });
                self.filesAreUploaded();
              }
            });
        }
      );

      previewUploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // "Upload is " + progress + "% done";
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              // "Upload is paused";
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              // "Upload is running";
              break;
          }
        },
        function(error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;

            case "storage/canceled":
              // User canceled the upload
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          previewUploadTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              prevURLs[i] = downloadURL;
              stateSetter({ prevURLs: prevURLs });
              if (controlLength === self.state.prevURLs.length) {
                self.setState({ prevUploaded: true });
                self.filesAreUploaded();
              }
            });
        }
      );
    });
  };

  databaseSendInfo = () => {
    const self = this;

    database.ref("cars/").push(
      {
        brand: this.state.brand,
        model: this.state.model,
        notes: this.state.notes,
        EXIFdata: this.state.aboutFIles,
        images: this.state.imgURLs.toString(),
        prevs: this.state.prevURLs.toString(),
        heroImage: this.state.heroImage
      },
      function(error) {
        if (error) console.error("Error has occured during saving process");
        else {
          // "Data has been saved succesfully"
          self.clearState();
        }
      }
    );
  };

  stateSetter = value => {
    this.setState({
      ...value
    });
  };

  filesAreUploaded = () => {
    if (
      this.state.imgUploaded &&
      this.state.prevUploaded &&
      isArrayValid(this.state.imgURLs) &&
      isArrayValid(this.state.prevURLs)
    ) {
      this.databaseSendInfo();
    }
  };

  imgInfoFiller = fileList => {
    let aboutFIles = [];

    fileList.forEach((item, i) => {
      window.EXIF.getData(item, function() {
        let EXIFdata = window.EXIF.getAllTags(this);
        Object.keys(EXIFdata).forEach(key => {
          if (key === "undefined" || key === "CustomRendered") {
            delete EXIFdata[key];
          }
        });
        aboutFIles[i] = EXIFdata;
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
      aboutFIles: null,
      imgURLs: [],
      prevURLs: [],
      imgUploaded: false,
      prevUploaded: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <FormGroup>
          <Label for="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            type="text"
            id="title"
            value={this.state.brand}
            onChange={this.handleInputChange}
          />
          <FormFeedback valid>That's it!</FormFeedback>
          <FormFeedback invalid>Must input brand name at least</FormFeedback>
          <FormText>BMW, Porsche, Lada</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="model">Model</Label>
          <Input
            id="model"
            name="model"
            type="text"
            id="title"
            value={this.state.model}
            onChange={this.handleInputChange}
          />
          <FormText>E230, 911, T-1000</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="notes">Notes</Label>
          <Input
            type="textarea"
            name="notes"
            id="notes"
            value={this.state.notes}
            onChange={this.handleInputChange}
          />
        </FormGroup>
        <div className="input-group my-3">
          <div className="custom-file">
            <input
              type="file"
              onChange={this.fileChangeHandler}
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
                    this.state.aboutFIles.length,
                this.state.brand
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
                    this.state.aboutFIles.length,
                this.state.brand
              )}
            >
              Add
            </Button>
          </div>
        </div>

        {this.state.selectedFiles ? (
          <ImgPreview
            filesList={this.state.selectedFiles}
            compressedList={this.state.compressedFiles}
            aboutList={this.state.aboutFIles}
            removeItem={this.removeItem}
            setPrimary={this.setPrimary}
            primaryNumber={this.state.heroImage}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default UploaderPage;
