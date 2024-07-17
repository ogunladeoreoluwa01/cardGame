import api from "../api";

// Define an interface for the function's parameters
interface JoinDuelParams {
  accessToken: string | any;
  duelJoinKey: string | any;
}

// Define an interface for the API response data (customize based on your API response structure)
interface JoinDuelResponse {
  message: string;
  duel: any | null;
}

// Define an interface for the error structure
interface JoinDuelError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const joinDuel = async ({
  accessToken,
  duelJoinKey,
}: JoinDuelParams): Promise<JoinDuelResponse> => {
  try {
    const { data } = await api.post<JoinDuelResponse>(
      "/api/demo/join-duel",
      {
        duelJoinKey,
      },
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
        } as JoinDuelError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default joinDuel;
