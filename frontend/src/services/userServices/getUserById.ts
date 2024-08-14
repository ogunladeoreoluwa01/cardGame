import api from "../api";
import { IUser } from "@/types";

// Define an interface for the function's parameters
interface UserParams {
  userId: string|undefined;
}

// Define an interface for the API response data (customize based on your API response structure)
interface UserResponse {
  message: string;
  user:IUser;
}

// Define an interface for the error structure
interface UserError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const fetchUserById = async ({ userId }: UserParams): Promise<UserResponse> => {
  try {
    const { data } = await api.get<UserResponse>(
      `/api/user/user-by-id/${userId}`
    );
    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        } as UserError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default fetchUserById;
