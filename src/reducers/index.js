import { UPDATE_LIST } from "../constants/action-types";

const initialState = {
  cars: [],
  list_untouched: {}
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LIST:
    console.log(action.payload);
      const payloadArray = Object.values(action.payload);
      return { ...state, cars: payloadArray, list_untouched: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
