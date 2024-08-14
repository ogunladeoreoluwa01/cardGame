import api from "../api";

// Interface for the function parameters
interface LeaderboardParams {
  limit?: number;
  sortParam?: string;
  userId: string;
}

// Interface for the API response data
interface LeaderboardResponse {
  leaderBoard: any;
  userPosition: number;
  message: string;
}

// Interface for the error structure
interface APIError {
  errorCode: number;
  errorMessage: string;
}

// Fetch the user leaderboard based on parameters
const fetchUserLeaderboard = async ({
  limit,
  sortParam,
  userId,
}: LeaderboardParams): Promise<LeaderboardResponse> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append("limit", limit.toString());
    if (sortParam) queryParams.append("sortParam", sortParam);

    // Make API request
    const { data } = await api.get<LeaderboardResponse>(
      `/api/user/user-leader-board/${userId}?${queryParams.toString()}`
    );
    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        } as APIError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default fetchUserLeaderboard;
