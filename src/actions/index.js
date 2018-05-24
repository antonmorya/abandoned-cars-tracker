import { UPDATE_LIST } from "../constants/action-types";

export const updateList = cars => ({
  type: UPDATE_LIST,
  payload: cars
});
