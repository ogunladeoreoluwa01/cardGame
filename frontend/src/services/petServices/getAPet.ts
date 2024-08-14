import api from "../api";
import {Pet} from "../../types";

// Define an interface for the function's parameters
interface GetPetDetailsParams {
  petId: string;
}

// Define an interface for the API response data (customize based on your API response structure)
interface GetPetDetailsResponse {
  message: string;
  pet: Pet | null;
}

// Define an interface for the error structure
interface GetPetDetailsError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const getPetDetails = async ({

  petId,
}: GetPetDetailsParams): Promise<GetPetDetailsResponse> => {
  try {
    const { data } = await api.get<GetPetDetailsResponse>(
      `/api/demo/get-pet/${petId}`,
    );
    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        } as GetPetDetailsError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default getPetDetails;
