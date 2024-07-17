export interface User {
  user:any|null
}
export interface gameState {
  gameState: any | null;
}

interface LiveGameState {
  liveGameState: any | null;
}
export interface UserState {
  userInfo:any| null;
}

interface AccessTokenState {
  userAccessToken: string | null;
}

interface RefreshTokenState {
  userRefreshToken: string | null;
}
interface GameSessionState {
  sessionId: string | null;
}

export interface RootState {
  user: UserState;
  gameSession: GameSessionState;
  ongoingGame: gameState;
  liveGame: LiveGameState;
  accessToken: AccessTokenState;
  refreshToken: RefreshTokenState;
}
