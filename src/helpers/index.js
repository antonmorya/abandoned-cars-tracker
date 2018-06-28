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
}

export function getGeoData(apiResults, searchFor) {
  let result = null;

  apiResults.results[0].address_components.forEach(item => {
    if (result !== null) return result;

    if (item.types[0] === "route" && searchFor === "route") {
      const itemRoute = item.long_name;
      result = itemRoute;
    }

    if (item.types[0] === "locality" && searchFor === "locality") {
      const itemLocality = item.long_name;
      result = itemLocality;
    }

    if (item.types[0] === "country" && searchFor === "country") {
      const itemCountry = item.short_name;
      result = itemCountry;
    }

    if (
      item.types[0] === "postal_code_prefix" &&
      searchFor === "postal_code_prefix"
    ) {
      const itemPc = item.long_name;
      result = itemPc;
    }

    if (item.types[0] === "street_number" && searchFor === "street_number") {
      const itemSnumber = item.long_name;
      result = itemSnumber;
    }
    // return null;// break the loop
  });

  return result;
}

export const isValid = () => true
