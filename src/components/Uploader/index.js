import React, { Component } from "react";
import firebase from "../../firebaseInit";
import ImageCompressor from "image-compressor.js";
import { Media } from "reactstrap";

var storage = firebase.storage();
var storageRef = storage.ref("images/");

const imgPreview = srcList => {
  return srcList.map(item => {
    return (
      <Media key={URL.createObjectURL(item)}>
        <Media left href="#">
          <Media object src={URL.createObjectURL(item)} alt="" />
        </Media>
        <Media body>
          <Media heading>Media heading</Media>
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
          scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in
          vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
          vulputate fringilla. Donec lacinia congue felis in faucibus.
        </Media>
      </Media>
    );
  });
};

class UploaderPage extends Component {
  constructor() {
    super();
    this.state = {
      selectedFiles: null,
      compressedFiles: null
    };

    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.imgCompressor = this.imgCompressor.bind(this);
  }

  fileChangedHandler = event => {
    let filesArray = Object.values(event.target.files);
    this.setState({
      selectedFiles: filesArray
    });

    filesArray.forEach(item => {
      window.EXIF.getData(item, function() {
        console.log(window.EXIF.getAllTags(this));
        var make = window.EXIF.getTag(this, "Orientation");
        console.log(`${make}`);
      });
    });

    this.imgCompressor(filesArray);
  };

  uploadHandler = () => {
    var imageRef = storageRef.child(this.state.selectedFiles.name);
    console.log("uploadHandler", this.state.selectedFiles.name);
    imageRef.put(this.state.selectedFiles).then(function(snapshot) {
      console.log("Uploaded a blob or file!");
      console.log("imageRef: ", imageRef);
    });
  };

  imgCompressor = fileList => {
    const imageCompressor = new ImageCompressor();
    let compressedList = [];

    const options = {
      quality: 0.8,
      maxHeight: 200,
      success: res => {
        compressedList.push(res);
        this.setState({
          compressedFiles: compressedList
        });
      }
    };

    fileList.forEach(image =>
      imageCompressor.compress(image, options).catch(err => {
        console.log("ERROR: ", err);
      })
    );
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.fileChangedHandler} multiple />
        <button onClick={this.uploadHandler}>Upload!</button>
        {this.state.compressedFiles
          ? imgPreview(this.state.compressedFiles)
          : null}
      </div>
    );
  }
}

export default UploaderPage;
