export interface User {
  user:any|null
}

export interface IUser {
  userInfo: {
    phoneNumber?: number;
    username: string;
    playerRank:
      | "Wood"
      | "Onyx"
      | "Bronze"
      | "Silver"
      | "Gold"
      | "Ruby"
      | "Master"
      | "Amethyst";
    email: string;
    isVerified: boolean;
    oldPassword: string[];
    isAdmin: boolean;
    superAdmin: boolean;
    profile: {
      gender?: string;
      fullName: string;
      bio: string;
      avatar?: string;
      coverImage?: string;
      level: number;
      experience: number;
      xpNeededToNextLevel: number;
      Aureus: number;
      followers: String[];
      Argentum: number;
    };
    userStats: {
      achievements: String[];
      Duelpoints: number;
      DuelPointsToNextLevel: number;
      duelsWon: number;
      duelsLost: number;
    };
    inventory: Array<{
      itemId: String;
      quantity: number;
    }>;
    pets: {
      favPet?: String;
      allPets: String[];
      availablePets: String[];
      currentDeck: String[];
    };
    banned: boolean;
    banReason?: string;
    banExpiration?: Date | null;
    disable: boolean;
    disableReason?: string;
  };
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

interface PetInfo {
  _id: string;
  name: string;
  baseCost: number;
  illustration: string;
  description: string;
  lore: string;
  class: string;
  element: string[]; // Assuming elements are strings
  weaknesses: string[]; // Assuming weaknesses are strings
  strengths: string[]; // Assuming strengths are strings
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface UserProfile {
  userId: string;
  username: string;
  coverImage: string;
  previousUsers: string[]; // Assuming previousUsers is an array of strings (usernames or IDs)
}

export interface Pet {
  userProfile: UserProfile;
  _id: string;
  petInfo: PetInfo;
  experience: number;
  xpNeededToNextLevel: number;
  currentHealth: number;
  currentAttack: number;
  currentDefense: number;
  currentManaCost: number;
  level: number;
  isListed: boolean;
  listingNo: string;
  listingPrice: number;
  isSystemOwned: boolean;
  rarity: string;
  createdAt: Date;
  updatedAt: Date;
  currentCost: number;
  __v: number;
}

export interface RootState {
  user: UserState;
  gameSession: GameSessionState;
  ongoingGame: gameState;
  liveGame: LiveGameState;
  accessToken: AccessTokenState;
  refreshToken: RefreshTokenState;
}
