import api from "../api";
import { Pet } from "../../types";

// Define an interface for the function's parameters
interface ViewAlistedItemParams {
  accessToken: string|null;
  listingNo: string|undefined;
}

// Define an interface for the API response data (customize based on your API response structure)
interface ViewAlistedItemResponse {
  message: string;
  listing: any;
}

// Define an interface for the error structure
interface ViewAlistedItemError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const ViewAlistedItem = async ({
    accessToken,
  listingNo,
}: ViewAlistedItemParams): Promise<ViewAlistedItemResponse> => {
  try {
    const { data } = await api.get<ViewAlistedItemResponse>(
      `/api/demo/get-a-listing/${listingNo}`,
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
        } as ViewAlistedItemError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default ViewAlistedItem;
