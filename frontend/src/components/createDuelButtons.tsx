import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import createDuel from "@/services/gameServices/createADuel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import refreshAccessToken from "@/services/authServices/refreshAccessToken";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import clearAccessToken from "@/stores/actions/accessTokenAction";
import clearRefreshToken from "@/stores/actions/refreshTokenAction";
import logOut from "@/stores/actions/userAction";
import { AppDispatch } from "@/stores";
import { gameSessionAction } from "@/stores/reducers/gameSessionReducer";
import { gameAction } from "@/stores/reducers/gameReducer";
import { liveGameAction } from "@/stores/reducers/liveGameReducer";

interface CreateDuelButtonsProps {
  setGameState: React.Dispatch<React.SetStateAction<any>>;
}

const CreateDuelButtons: React.FC<CreateDuelButtonsProps> = ({
  setGameState,
}) => {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);

  const refreshTokenState = useSelector(
    (state: RootState) => state.refreshToken
  );
  const accessTokenState = useSelector((state: RootState) => state.accessToken);

useEffect(() => {
  console.log(refreshTokenState.userRefreshToken);
  console.log(accessTokenState);
}, [refreshTokenState, accessTokenState]);
  
  const refresh = async () => {
    toast({
      variant: "warning",
      description: "Refreshing access token",
    });

    try {
      const response = await refreshAccessToken(
        {refreshToken:refreshTokenState.userRefreshToken}
      );
      dispatch(accessTokenAction.setUserAccessToken(response.accessToken));
      console.log(response);
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

  const mutation = useMutation({
    mutationFn: createDuel,
    onSuccess: (data) => {
      toast({
        variant: "Success",
        description: "Duel created successfully",
      });
      setGameState(data.duel);
    },
    onError: async (error: any) => {
      try {
        const errorMessage = JSON.parse(error.message);
        console.error(
          `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`
        );

        if (errorMessage.errorCode === 440) {
          const newAccessToken = await refresh();
          mutation.mutate({
            accessToken: newAccessToken,
            isPrivate,
          });
        } else {
          toast({
            variant: "destructive",
            description: `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`,
          });
        }
      } catch (parseError: any) {
        console.error("Error parsing error message:", parseError);
        toast({
          variant: "destructive",
          description: parseError.toString(),
        });
      }
    },
  });

  const handleCreateDuel = (isPrivate: boolean) => {
    setIsPrivate(isPrivate);
    mutation.mutate({
      accessToken: accessTokenState.userAccessToken,
      isPrivate,
    });
  };

  return (
  <div className="flex flex-col gap-3 md:w-[250px]  w-[250px]">
      <Button onClick={() => handleCreateDuel(false)} className="w-full">
        Create Public Duel
      </Button>
      <Button onClick={() => handleCreateDuel(true)} className="w-full">
        Create Private Duel
      </Button>
    </div>
  );
};

export default CreateDuelButtons;
