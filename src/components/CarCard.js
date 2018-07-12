import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  card: {
    display: "flex",
    justifyContent: "space-between"
  },
  details: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "calc(100% - 151px)"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 151,
    height: 112
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  }
});

const CarCard = props => {
  const { car, classes } = props;
  const { heroImage } = car;
  const previewImg = car.prevs.split(",")[heroImage];

  return (
    <div className="col-md-6 col-lg-3">
      <Card className={`${classes.card}`}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography
              className="text-nowrap text-truncate"
              variant="headline"
            >
              <Link to={`/car/${car.id}`}>
                {`${car.brand ? car.brand : "Unknown brand"}, ${
                  car.EXIFdata[heroImage].country
                    ? car.EXIFdata[heroImage].country
                    : "Unknown place"
                }`}
              </Link>
            </Typography>
            <Typography variant="subheading" color="textSecondary">
              <small className="text-muted">
                {car.EXIFdata[heroImage].DateTimeOriginal
                  ? car.EXIFdata[heroImage].DateTimeOriginal
                  : "Main photo has no timestamp"}
              </small>
            </Typography>
          </CardContent>
          <div className={classes.controls} />
        </div>
        <CardMedia className={classes.cover} image={previewImg} />
      </Card>
    </div>
  );
};

/* CarCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}; */

export default withStyles(styles, { withTheme: true })(CarCard);
