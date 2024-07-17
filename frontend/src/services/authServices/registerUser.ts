import api from "../api";

// Define an interface for the function's parameters
interface SignupParams {
  username: string;
  email: string;
  password: string;
}

// Define an interface for the API response data (customize based on your API response structure)
interface SignupResponse {
  message: string;
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Define an interface for the error structure
interface SignupError {
  errorCode: number;
  errorMessage: string;
}

// Define the function with type annotations
const signupUser = async ({
  username,
  email,
  password,
}: SignupParams): Promise<SignupResponse> => {
  try {
    const { data } = await api.post<SignupResponse>("/api/auth/register", {
      username,
      email,
      password,
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        } as SignupError)
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default signupUser;
