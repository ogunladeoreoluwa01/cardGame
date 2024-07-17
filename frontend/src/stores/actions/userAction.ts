// actions/userAction.ts

import { Dispatch } from "redux";
import { userAction } from "../reducers/userReducer";

const logOut = () => {
  return (dispatch: Dispatch) => {
    dispatch(userAction.resetUserInfo());
    localStorage.removeItem("account");
  };
};

export default logOut;
