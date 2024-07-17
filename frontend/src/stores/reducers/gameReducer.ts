// reducers/userReducer.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface UserState {
  gameState: any | null;
}

// Initial state for the user slice
const gameInitialState: UserState = {
  gameState: null,
};

// Create the user slice
const gameSlice = createSlice({
  name: "game",
  initialState: gameInitialState,
  reducers: {
    setGameState(state, action: PayloadAction<any>) {
      state.gameState = action.payload;
    },
    resetGameState(state) {
      state.gameState = null;
    },
  },
});

// Export actions and reducer
const gameAction = gameSlice.actions;
const gameReducer = gameSlice.reducer;

export { gameAction, gameReducer };
