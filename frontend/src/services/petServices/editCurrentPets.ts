import api from "../api";

// Define an interface for the function's parameters
interface EditCurrentDeckParams {
  accessToken: string|undefined;
  primaryPetId: string|null;
  secondaryPetId: string|null;
}

// Define an interface for the API response data (customize based on your API response structure)
interface EditCurrentDeckResponse {
  message: string;
}

// Define an interface for the error structure
interface EditCurrentDeckError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const EditCurrentDeck = async ({
  accessToken,
  primaryPetId,
  secondaryPetId,
}: EditCurrentDeckParams): Promise<EditCurrentDeckResponse> => {
  try {
    const { data } = await api.put<EditCurrentDeckResponse>(
      `/api/demo/edit-current-deck`,
      { primaryPetId, secondaryPetId },
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
        } as EditCurrentDeckError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default EditCurrentDeck;
