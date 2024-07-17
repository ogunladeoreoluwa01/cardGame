// reducers/userReducer.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface UserState {
  userInfo: any | null;
}

// Initial state for the user slice
const userInitialState: UserState = {
  userInfo: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<any>) {
      state.userInfo = action.payload;
    },
    resetUserInfo(state) {
      state.userInfo = null;
    },
  },
});

// Export actions and reducer
const userAction = userSlice.actions;
const userReducer = userSlice.reducer;

export { userAction, userReducer };
