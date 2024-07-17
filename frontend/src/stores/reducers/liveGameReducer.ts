// reducers/userReducer.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface LiveGameState {
  liveGameState: any | null;
}

// Initial state for the user slice
const liveGameInitialState: LiveGameState = {
  liveGameState: null,
};

// Create the user slice
const liveGameSlice = createSlice({
  name: "liveGame",
  initialState: liveGameInitialState,
  reducers: {
    setLiveGameState(state, action: PayloadAction<any>) {
      state.liveGameState = action.payload;
    },
    resetLiveGameState(state) {
      state.liveGameState = null;
    },
  },
});

// Export actions and reducer
const liveGameAction = liveGameSlice.actions;
const liveGameReducer = liveGameSlice.reducer;

export { liveGameAction, liveGameReducer };
