import { Dispatch } from "redux";
import { accessTokenAction } from "../reducers/accessTokenReducer";

const clearAccessToken = () => {
  return (dispatch: Dispatch) => {
    dispatch(accessTokenAction.resetUserAccessToken());
  
  };
};

export default clearAccessToken;
