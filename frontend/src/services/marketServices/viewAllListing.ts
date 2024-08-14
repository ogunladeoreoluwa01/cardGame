import api from "../api";

// Define an interface for the function's parameters
interface ViewAllListingParams {
  accessToken: string;
  element?: string[] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  petClass?: string | null;
  itemname?:string|null;
  petFilter?: string | null;
  page?: number;
  limit?: number;
}

// Define an interface for the API response data (customize based on your API response structure)
interface ViewAllListingResponse {
  message: string;
  listing: any;
  pagination: {
    totalListings: number;
    totalPages: number;
    currentPage: number;
  };
}

// Define an interface for the error structure
interface ViewAllListingError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const ViewAllListing = async ({
  accessToken,
  minPrice,
  element,
  maxPrice,
  petClass,
  petFilter,
  itemname,
  page = 1,
  limit = 10,
}: ViewAllListingParams): Promise<ViewAllListingResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (element && element.length > 0) {
      element.forEach((el) => queryParams.append("element", el));
    }
    if (itemname) queryParams.append("itemname", itemname);
    if (minPrice)
      queryParams.append("minPrice", minPrice.toString());
    if (maxPrice)
      queryParams.append("maxPrice", maxPrice.toString());
    if (petClass) queryParams.append("petClass", petClass);
    if (petFilter) queryParams.append("petFilter", petFilter);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const { data } = await api.get<ViewAllListingResponse>(
      `/api/demo/view-all-listing?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error("Error in viewAllListing service:", error.response);
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        } as ViewAllListingError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default ViewAllListing;
