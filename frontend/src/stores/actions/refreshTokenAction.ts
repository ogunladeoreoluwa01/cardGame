import { Dispatch } from "redux";
import { refreshTokenAction } from "../reducers/refreshTokenReducer";

const clearRefreshToken = () => {
  return (dispatch: Dispatch) => {
    dispatch(refreshTokenAction.resetUserRefreshToken());
    localStorage.removeItem("refreshToken");
  };
};

export default clearRefreshToken;
