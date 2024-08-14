import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import BuySystemListing from "@/services/marketServices/buySystemListing";
import BuyListing from "@/services/marketServices/buyListing";
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
import { GiBuyCard } from "react-icons/gi";
import styles from "../styles/styles";


interface BuyItemProps {
  listingNo:string;
  isSystem:boolean;
}

const BuyItemButton: React.FC<BuyItemProps> = ({ listingNo,isSystem }) => {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  

  const refreshTokenState = useSelector(
    (state: RootState) => state.refreshToken
  );
  const accessTokenState = useSelector((state: RootState) => state.accessToken);

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

  const buySystem = useMutation({
    mutationFn: BuySystemListing,
    onSuccess: (data) => {
      toast({
        variant: "Success",
        description: " Purchase successful!",
      });
    },
    onError: async (error: any) => {
      try {
        const errorMessage = JSON.parse(error.message);
        console.error(
          `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`
        );

        if (errorMessage.errorCode === 440) {
          const newAccessToken = await refresh();
          buySystem.mutate({
            accessToken: newAccessToken,
            listingNo: listingNo,
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

  const buy = useMutation({
    mutationFn: BuySystemListing,
    onSuccess: (data) => {
      toast({
        variant: "Success",
        description: " Purchase successful!",
      });
    },
    onError: async (error: any) => {
      try {
        const errorMessage = JSON.parse(error.message);
        console.error(
          `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`
        );

        if (errorMessage.errorCode === 440) {
          const newAccessToken = await refresh();
          buy.mutate({
            accessToken: newAccessToken,
            listingNo: listingNo,
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


  const handleBuy = () => {
    if(isSystem){
      buySystem.mutate({
        accessToken: accessTokenState.userAccessToken,
        listingNo: listingNo,
      });
    }else{
        buy.mutate({
          accessToken: accessTokenState.userAccessToken,
          listingNo: listingNo,
        });
    }
   
  };

  return (
    <button
    disabled={buy.isPending || buySystem.isPending}
      onClick={() => {
        handleBuy;
      }}
      className="my-2 flex items-center gap-2 justify-start"
    >
      <span
        className={`flex gap-2 group  items-center  justify-center min-w-[95px] h-[30px]  p-2 rounded-[0.75rem]  ${styles.glassEffect}  min-w-[95px] `}
      >
        {buy.isPending || buySystem.isPending ? (
          <div className="font-bold group-hover:text-[#32CD32] transition-all duration-300 ease-in-out scale-90 text-sm uppercase text-white flex gap-1 items-center justify-center">
            <span className="text-[#32CD32] text-lg">
              <GiBuyCard />
            </span>
            Purchasing ...
          </div> // Use your spinner component
        ) : (
          <div className="font-bold group-hover:text-[#32CD32] transition-all duration-300 ease-in-out scale-90 text-sm uppercase text-white flex gap-1 items-center justify-center">
            <span className="text-[#32CD32] text-lg">
              <GiBuyCard />
            </span>
            See Listing
          </div>
        )}
      </span>
    </button>
  );
};

export default BuyItemButton;
