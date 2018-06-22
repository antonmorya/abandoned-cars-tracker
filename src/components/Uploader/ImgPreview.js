import React from "react";
import DescriptionLabelRow from "../common/DescriptionLabelRow";
import { Media, Container, Button } from "reactstrap";

const ImgPreview = props => {
  const { filesList, compressedList, aboutList, removeItem } = props;
  let nodeList = [];
  const count = filesList.length;

  for (let i = 0; i < count; i++) {
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

export default ImgPreview;
