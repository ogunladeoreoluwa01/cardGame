import api from "../api";
import { Pet } from "../../types";

// Define an interface for the function's parameters
interface BuySystemListingParams {
  accessToken: string | null;
  listingNo: string | undefined;
}

// Define an interface for the API response data (customize based on your API response structure)
interface BuySystemListingResponse {
  message: string;
  listing: any;
}

// Define an interface for the error structure
interface BuySystemListingError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const BuySystemListing = async ({
  accessToken,
  listingNo,
}: BuySystemListingParams): Promise<BuySystemListingResponse> => {
  try {
    const { data } = await api.post<BuySystemListingResponse>(
      `/api/demo/buy-system-listing/`,
      { listingNo: listingNo },
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
        } as BuySystemListingError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default BuySystemListing;
