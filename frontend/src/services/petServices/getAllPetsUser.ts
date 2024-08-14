import api from "../api";
import { Pet } from "../../types";

// Define an interface for the function's parameters
interface GetAllUserPetDetailsParams {
  accessToken: string;
  userId: string;
  element?: string[]|null;
  rarity?: string;
  petClass?: string;
  petname?:string|null;
  isLvl?: string;
  petcategory?: string;
  page?: number | undefined;
  limit?: number;
}

// Define an interface for the API response data (customize based on your API response structure)
interface GetAllUserPetDetailsResponse {
  message: string;
  pets: Pet[];
  elementCounts: any;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

// Define an interface for the error structure
interface GetAllUserPetDetailsError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const getAllUserPetDetails = async ({
  accessToken,
  userId,
  element ,
  petname,
  rarity,
  petClass,
  isLvl,
  petcategory,
  page = 1,
  limit = 10,
}: GetAllUserPetDetailsParams): Promise<GetAllUserPetDetailsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (element && element.length > 0) {
      element.forEach((el) => queryParams.append("element", el));
    }
     if (petname) queryParams.append("petname", petname);
    if (rarity) queryParams.append("rarity", rarity);
    if (petClass) queryParams.append("petClass", petClass);
    if (isLvl) queryParams.append("isLvl", isLvl);
    if (petcategory) queryParams.append("petcategory", petcategory);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const { data } = await api.get<GetAllUserPetDetailsResponse>(
      `/api/demo/get-all-users-pets/${userId}?${queryParams.toString()}`,
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
        } as GetAllUserPetDetailsError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default getAllUserPetDetails;
