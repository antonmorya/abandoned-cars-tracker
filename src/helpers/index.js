export function buttonColor(...args) {
  return args.every(item => !!item) ? "success" : "danger";
}

export function isDisabled(...args) {
  return args.every(item => !!item) ? false : true;
}

export function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
};
