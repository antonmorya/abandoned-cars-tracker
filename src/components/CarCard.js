import React from "react";
import {
  Card,
  CardBody,
  Button,
  CardTitle,
  CardText,
  CardImg
} from "reactstrap";

const CarCard = props => {
  const { car } = props;
  const preview = car.prevs.split(", ")[0];

  return (
    <Card className="mb-4">
      <CardImg top width="100%" src={preview} alt="Car image" />
      <CardBody>
        <CardTitle>
          {`${car.brand ? car.brand : "Unknown brand"}, ${
            car.country ? car.country : "Unknown place"
          }`}
        </CardTitle>
        <CardText>
          <small className="text-muted">
            {car.timestamp ? car.timestamp : "Main photo has no timestamp"}
          </small>
        </CardText>
      </CardBody>
    </Card>
  );
};

export default CarCard;
