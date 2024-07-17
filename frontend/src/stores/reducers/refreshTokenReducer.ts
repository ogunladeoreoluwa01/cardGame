import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface RefreshTokenState {
  userRefreshToken: string | null;
}

// Initial state for the refresh token slice
const refreshTokenStateInitialState: RefreshTokenState = {
  userRefreshToken: null,
};

// Create the refresh token slice
const refreshTokenSlice = createSlice({
  name: "refreshToken",
  initialState: refreshTokenStateInitialState,
  reducers: {
    setUserRefreshToken(state, action: PayloadAction<any>) {
      state.userRefreshToken = action.payload;
    },
    resetUserRefreshToken(state) {
      state.userRefreshToken = null;
    },
  },
});

// Export actions and reducer
const refreshTokenAction = refreshTokenSlice.actions;
const refreshTokenReducer = refreshTokenSlice.reducer;

export { refreshTokenAction, refreshTokenReducer };
