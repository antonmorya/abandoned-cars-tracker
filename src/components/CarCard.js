import React from "react";
import { Card, CardBody, CardTitle, CardText, CardImg } from "reactstrap";
import { Link } from "react-router-dom";

const CarCard = props => {
  const { car } = props;
  const {heroImage} = car;
  const preview = car.prevs.split(",")[0];

  return (
    <Card className="mb-4">
      <CardImg top width="100%" src={preview} alt="Car image" />
      <CardBody>
        <CardTitle>
          <Link to={`/car/${car.id}`}>
            {`${car.brand ? car.brand : "Unknown brand"}, ${
              car.EXIFdata[heroImage].country ? car.EXIFdata[heroImage].country : "Unknown place"
            }`}
          </Link>
        </CardTitle>
        <CardText>
          <small className="text-muted">
            {car.EXIFdata[heroImage].DateTimeOriginal ? car.EXIFdata[heroImage].DateTimeOriginal : "Main photo has no timestamp"}
          </small>
        </CardText>
      </CardBody>
    </Card>
  );
};

export default CarCard;
