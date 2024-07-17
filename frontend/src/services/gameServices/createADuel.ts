import api from "../api";

// Define an interface for the function's parameters
interface CreateDuelParams {
  accessToken: string|any;
  isPrivate: boolean;
}

// Define an interface for the API response data (customize based on your API response structure)
interface CreateDuelResponse {
  message: string;
  duel: any | null;
}

// Define an interface for the error structure
interface CreateDuelError {
  errorCode: number;
  errorMessage: string; 
}

// Define the function with type annotations
const createDuel = async ({
  accessToken,
  isPrivate,
}: CreateDuelParams): Promise<CreateDuelResponse> => {
  try {
    const { data } = await api.post<CreateDuelResponse>(
      "/api/demo/create-duel",
      {
        isPrivate,
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
        } as CreateDuelError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default createDuel;
