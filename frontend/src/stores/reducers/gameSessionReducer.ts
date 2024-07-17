// src/store/gameSessionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameSessionState {
  sessionId: string | null;
}

const initialState: GameSessionState = {
  sessionId: null,
};

const gameSessionSlice = createSlice({
  name: "gameSession",
  initialState,
  reducers: {
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    clearSessionId(state) {
      state.sessionId = null;
    },
  },
});
const gameSessionAction = gameSessionSlice.actions;
const gameSessionReducer = gameSessionSlice.reducer;

export { gameSessionAction, gameSessionReducer };
