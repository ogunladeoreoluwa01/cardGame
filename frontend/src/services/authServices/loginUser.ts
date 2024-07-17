import api from "../api";

// Define an interface for the function's parameters
interface LoginParams {
  userInfo: string;
  password: string;
}

// Define an interface for the API response data (customize based on your API response structure)
interface LoginResponse {
  message: string;
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
}



// Define an interface for the error structure
interface LoginError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const loginUser = async ({
  userInfo,
  password,
}: LoginParams): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>("/api/auth/login", {
      userInfo,
      password,
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        } as LoginError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default loginUser;
