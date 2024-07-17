import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import joinDuel from "@/services/gameServices/joinADuel";
import refreshAccessToken from "@/services/authServices/refreshAccessToken";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import clearAccessToken from "@/stores/actions/accessTokenAction";
import clearRefreshToken from "@/stores/actions/refreshTokenAction";
import logOut from "@/stores/actions/userAction";
import { AppDispatch } from "@/stores";
import { useToast } from "@/components/ui/use-toast";
import { gameAction } from "@/stores/reducers/gameReducer";

const JoinGameLinkPage = () => {
  const [gameState, setGameState] = useState<any>(null);
  const { toast } = useToast();
  const { duelKey } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

  const refresh = async () => {
    toast({
      variant: "warning",
      description: "Refreshing access token",
    });

    try {
      const response = await refreshAccessToken({
        refreshToken: refreshTokenState.userRefreshToken,
      });
      dispatch(accessTokenAction.setUserAccessToken(response.accessToken));
      return response.accessToken;
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err.errorMessage,
      });

      if (err.errorCode === 403) {
        dispatch(clearAccessToken());
        dispatch(clearRefreshToken());
        dispatch(logOut());
        localStorage.removeItem("account");
        localStorage.removeItem("refreshToken");
        toast({
          variant: "warning",
          description: "User logged out",
        });
        navigate("/login");
      }
    }
  };

  const fetchDuel = async (accessToken: string) => {
    try {
      const response = await joinDuel({
        accessToken: accessToken,
        duelJoinKey: duelKey,
      });
      setGameState(response.duel);
      dispatch(gameAction.setGameState(response.duel));
      localStorage.setItem("game", JSON.stringify(response.duel));
      setTimeout(() => {
        navigate(
          `/games-page/${response.duel._id}/duelJoinKey/${response.duel.duelJoinKey}`
        );
      }, 1000); // 1000 milliseconds = 3 seconds
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      if (errorMessage.errorCode === 440) {
        const newAccessToken = await refresh();
        if (newAccessToken) {
          fetchDuel(newAccessToken);
        }
      } else {
        toast({
          variant: "destructive",
          description: `Error: ${errorMessage.errorMessage}`,
        });
      }
    }
  };

  useEffect(() => {
    if (duelKey && accessTokenState.userAccessToken) {
      fetchDuel(accessTokenState.userAccessToken);
    }
  }, [duelKey, accessTokenState.userAccessToken]);

  return (
    <>
      {gameState ? (
        <div>you will be redirected to the duels page shortly</div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default JoinGameLinkPage;
