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
import { liveGameAction } from "@/stores/reducers/liveGameReducer";
import { gameSessionAction } from "@/stores/reducers/gameSessionReducer";
import NavBarComp from "@/components/navBarComponent";

const JoinGameLinkPage = () => {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isError, setIsError] = useState(false);

  const { toast } = useToast();
  const { duelKey } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const userState: any | null = useSelector((state: RootState) => state.user);
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
        dispatch(liveGameAction.resetLiveGameState());
        localStorage.removeItem("game");
        dispatch(gameAction.resetGameState());
        localStorage.removeItem("liveGame");
        dispatch(gameSessionAction.clearSessionId());
        localStorage.removeItem("gameSession");
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
      toast({
        variant: "Success",
        description: "You will be redirected to the game shortly",
      });
      setIsWaiting(false);
      dispatch(gameAction.setGameState(response.duel));
      localStorage.setItem("game", JSON.stringify(response.duel));
      dispatch(liveGameAction.setLiveGameState(response.duel));
      localStorage.setItem("liveGame", JSON.stringify(response.duel));
      setTimeout(() => {
        navigate(
          `/games-page/${response.duel._id}/duelJoinKey/${response.duel.duelJoinKey}`
        );
      }, 3000);
    } catch (error: any) {
      setIsError(true);
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
      {isError ? (
        <div>
          Oops, there seems to be an error. Try going to the duel page and using
          the join duel by code feature.
        </div>
      ) : isWaiting ? (
        <div>You will be redirected to the duels page shortly</div>
      ) : (
        <div>Loading...</div>
      )}
      <NavBarComp
        userState={userState}
        accessTokenState={accessTokenState}
        refreshTokenState={refreshTokenState}
      />
    </>
  );
};

export default JoinGameLinkPage;
