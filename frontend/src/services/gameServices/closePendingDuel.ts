import api from "../api";

// Define an interface for the function's parameters
interface ClosePendingDuelParams {
  accessToken: string|any;
  duelId: string|any;
}

// Define an interface for the API response data (customize based on your API response structure)
interface ClosePendingDuelResponse {
  message: string;
}

// Define an interface for the error structure
interface ClosePendingDuelError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const ClosePendingDuel = async ({
  accessToken,
  duelId,
}: ClosePendingDuelParams): Promise<ClosePendingDuelResponse> => {
  try {
    const { data } = await api.delete<ClosePendingDuelResponse>(
      "/api/demo/close-pending-duel",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          duelId,
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
        } as ClosePendingDuelError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default ClosePendingDuel;
