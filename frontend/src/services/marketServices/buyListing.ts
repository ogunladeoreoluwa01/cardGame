import api from "../api";
import { Pet } from "../../types";

// Define an interface for the function's parameters
interface BuyListingParams {
  accessToken: string | null;
  listingNo: string | undefined;
}

// Define an interface for the API response data (customize based on your API response structure)
interface BuyListingResponse {
  message: string;
  listing: any;
}

// Define an interface for the error structure
interface BuyListingError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const BuyListing = async ({
  accessToken,
  listingNo,
}: BuyListingParams): Promise<BuyListingResponse> => {
  try {
    const { data } = await api.post<BuyListingResponse>(
      `/api/demo/buy-listing/`,
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
        } as BuyListingError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default BuyListing;
