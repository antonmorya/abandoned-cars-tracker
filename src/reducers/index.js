import { UPDATE_LIST } from "../constants/action-types";

const initialState = {
  cars: [],
  list_untouched: {},
  loaded: false
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LIST:
      const payloadArray = Object.values(action.payload);
      return {
        ...state,
        cars: payloadArray,
        list_untouched: action.payload,
        loaded: true
      };
    default:
      return state;
  }
};

export default rootReducer;
