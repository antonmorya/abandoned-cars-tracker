import React from "react";
import { Row, Col, Label } from "reactstrap";

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

export default DescriptionLabelRow;
