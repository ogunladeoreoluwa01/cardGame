import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { gameReducer } from "./reducers/gameReducer";
import { liveGameReducer } from "./reducers/liveGameReducer";
import { accessTokenReducer } from "./reducers/accessTokenReducer";
import { refreshTokenReducer } from "./reducers/refreshTokenReducer";
import { gameSessionReducer } from "./reducers/gameSessionReducer";

// Define the shape of your state
interface UserState {
  userInfo: any | null;
} 

interface GameSessionState {
  sessionId: string | null;
}

interface gameState {
  gameState: any | null;
}
interface LiveGameState {
  liveGameState: any | null;
}
interface AccessTokenState {
  userAccessToken: string | null;
}

interface RefreshTokenState {
  userRefreshToken: string | null;
}

interface RootState {
  user: UserState;
  gameSession: GameSessionState;
  ongoingGame: gameState;
  liveGame: LiveGameState;
  accessToken: AccessTokenState;
  refreshToken: RefreshTokenState;
}

// Function to retrieve initial state
const getInitialState = (): RootState => {
  const userInfoFromStorage = localStorage.getItem("account")
    ? JSON.parse(localStorage.getItem("account")!)
    : null;
    const gameSessionInfoFromStorage = localStorage.getItem("gameSession")
      ? JSON.parse(localStorage.getItem("gameSession")!)
      : null;
const gameInfoFromStorage = localStorage.getItem("game")
    ? JSON.parse(localStorage.getItem("game")!)
    : null;   
    const liveGameInfoFromStorage = localStorage.getItem("liveGame")
      ? JSON.parse(localStorage.getItem("liveGame")!)
      : null;  

  const refreshTokenFromStorage = localStorage.getItem("refreshToken")
    ? JSON.parse(localStorage.getItem("refreshToken")!)
    : null;

  return {
    user: { userInfo: userInfoFromStorage },
    gameSession: { sessionId: gameSessionInfoFromStorage },
    ongoingGame: { gameState: gameInfoFromStorage },
    liveGame: { liveGameState: liveGameInfoFromStorage },
    accessToken: { userAccessToken: null },
    refreshToken: { userRefreshToken: refreshTokenFromStorage },
  };
};

// Get initial state
const initialState = getInitialState();

// Configure store
const store = configureStore({
  reducer: {
    user: userReducer,
    gameSession:gameSessionReducer,
    ongoingGame: gameReducer,
    liveGame: liveGameReducer,
    accessToken: accessTokenReducer,
    refreshToken: refreshTokenReducer,
  },
  preloadedState: initialState,
});

// Export types for useSelector
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
