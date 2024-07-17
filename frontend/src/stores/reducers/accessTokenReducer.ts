import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface AccessTokenState {
  userAccessToken: string | null;
}

// Initial state for the access token slice
const accessTokenStateInitialState: AccessTokenState = {
  userAccessToken: null,
};

// Create the access token slice
const accessTokenSlice = createSlice({
  name: "accessToken",
  initialState: accessTokenStateInitialState,
  reducers: {
    setUserAccessToken(state, action: PayloadAction<any>) {
      state.userAccessToken = action.payload;
    },
    resetUserAccessToken(state) {
      state.userAccessToken = null;
    },
  },
});

// Export actions and reducer
const accessTokenAction = accessTokenSlice.actions;
const accessTokenReducer = accessTokenSlice.reducer;

export { accessTokenAction, accessTokenReducer };
