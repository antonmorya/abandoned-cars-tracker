import React from "react";
import DescriptionLabelRow from "../common/DescriptionLabelRow";
import { Media, Container, Button } from "reactstrap";
import { primaryButtonColor } from "../../helpers";

const ImgPreview = props => {
  const {
    filesList,
    compressedList,
    aboutList,
    removeItem,
    setPrimary,
    primaryNumber
  } = props;
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
                <React.Fragment>
                  <Button
                    className="mr-2"
                    size="sm"
                    color={primaryButtonColor(i, primaryNumber)}
                    onClick={() => setPrimary(i)}
                  >
                    primary
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => removeItem(i)}
                  >
                    remove
                  </Button>
                </React.Fragment>
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
                    headerLabel="Location:"
                    bodyLabel={`${aboutList[i].country}`}
                  />
                  <DescriptionLabelRow
                    colClasses="px-0 px-md-3"
                    rowClasses=""
                    headerLabel="Full address:"
                    bodyLabel={`${aboutList[i].formattedAddress}`}
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
