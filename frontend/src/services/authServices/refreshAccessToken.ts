
import api from "../api";

// Define an interface for the function's parameters
interface RefreshTokenParams {
    refreshToken: string|null;
}

// Define an interface for the API response data (customize based on your API response structure)
interface RefreshTokenResponse {
    accessToken: string;
}

// Define an interface for the error structure
interface RefreshTokenError {
    errorCode: number;
    errorMessage: string;
}

// Define the function with type annotations
const refreshAccessToken = async ({
    refreshToken,
}: RefreshTokenParams): Promise<RefreshTokenResponse> => {
    try {
        console.log(refreshToken)
        const { data } = await api.post<RefreshTokenResponse>("/api/auth/refresh-token", {
            refreshToken,
            
        });
        return data;
    } catch (error: any) {
         console.log(refreshToken);
        if (error.response) {
            throw new Error(
                JSON.stringify({
                    errorCode: error.response.status,
                    errorMessage: error.response.data.message,
                } as RefreshTokenError)
            );
        } else {
            throw new Error(error.message);
        }
    }
};

export default refreshAccessToken;
  
