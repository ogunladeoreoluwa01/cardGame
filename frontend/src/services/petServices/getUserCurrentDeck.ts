import api from "../api";
import { Pet } from "../../types";

// Define an interface for the function's parameters
interface GetUserCurrentDeckParams {
  accessToken: string;
  targetUserId: string;
}

// Define an interface for the API response data (customize based on your API response structure)
interface GetUserCurrentDeckResponse {
  message: string;
  currentDeck: Pet[];
  maxDeckSize: number;
}

// Define an interface for the error structure
interface GetUserCurrentDeckError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const getUserCurrentDeck = async ({
  accessToken,
  targetUserId,

}: GetUserCurrentDeckParams): Promise<GetUserCurrentDeckResponse> => {
  try {
    const { data } = await api.get<GetUserCurrentDeckResponse>(
      `/api/demo/get-users-current-deck/${targetUserId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        } as GetUserCurrentDeckError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default getUserCurrentDeck;
