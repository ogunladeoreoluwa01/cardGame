import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GiExitDoor } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import ClosePendingDuel from "@/services/gameServices/closePendingDuel";
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

const ClosePendingDuelButton = () => {
  const initialGameState = useSelector((state: RootState) => state.ongoingGame);

  const { toast } = useToast();
 
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

  const closeDuel = async (accessToken: string) => {
    try {
      const response = await ClosePendingDuel({
        accessToken: accessToken,
        duelId: initialGameState.gameState._id,
      });
      toast({
        variant: "Success",
        description: response.message,
      });
      dispatch(liveGameAction.resetLiveGameState());
      localStorage.removeItem("game");
      dispatch(gameAction.resetGameState());
      localStorage.removeItem("liveGame");
      dispatch(gameSessionAction.clearSessionId());
      localStorage.removeItem("gameSession");
      navigate("/");
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      if (errorMessage.errorCode === 440) {
        const newAccessToken = await refresh();
        if (newAccessToken) {
          closeDuel(newAccessToken);
        }
      } else {
        toast({
          variant: "destructive",
          description: `Error: ${errorMessage.errorMessage}`,
        });
      }
    }
  };

  return (
    <div className="w-full flex justify-end absolute md:top-8  md:right-8 top-4 right-4">
      <Button
        onClick={() => {
          closeDuel(accessTokenState.userAccessToken);
        }}
        variant="destructive"
        className="text-lg p-3"
      >
        <GiExitDoor />
      </Button>
    </div>
  );
};

export default ClosePendingDuelButton;
