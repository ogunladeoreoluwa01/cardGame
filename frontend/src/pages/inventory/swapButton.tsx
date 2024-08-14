import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import {useNavigate} from "react-router-dom";
import { RootState } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import refreshAccessToken from "@/services/authServices/refreshAccessToken";
import clearAccessToken from "@/stores/actions/accessTokenAction";
import clearRefreshToken from "@/stores/actions/refreshTokenAction";
import logOut from "@/stores/actions/userAction";
import EditCurrentDeck from "@/services/petServices/editCurrentPets";
import { gameSessionAction } from "@/stores/reducers/gameSessionReducer";
import { gameAction } from "@/stores/reducers/gameReducer";
import { liveGameAction } from "@/stores/reducers/liveGameReducer";
import { GiUpCard, GiCardExchange, GiCardPlay } from "react-icons/gi";
import { AppDispatch } from "@/stores";


interface Props {
  secondaryCard: string | null | undefined;
  primaryCard: string | null | undefined;
  width: string;
}

const EditButton: React.FC<Props> = ({primaryCard,secondaryCard,width="w-[47%]"}) => {
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient()
    const navigate =useNavigate()
  const { toast } = useToast();
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

  const mutation = useMutation({
    mutationFn: EditCurrentDeck,
    onSuccess: (data) => {
      toast({
        variant: "Success",
        description: data.message,
      });

      queryClient.invalidateQueries({ queryKey: ["petInventory"] });
      queryClient.invalidateQueries({ queryKey: ["userCurrentDeck"] });
    },
    onError: async (error: any) => {
      try {
        const errorMessage = JSON.parse(error.message);
       
        if (errorMessage.errorCode === 440) {
          const newAccessToken = await refresh();
          mutation.mutate({
            accessToken: newAccessToken,
            primaryPetId: primaryCard,
            secondaryPetId: secondaryCard,
          });
        } else {
          toast({
            variant: "destructive",
            description: `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`,
          });
        }
      } catch (parseError: any) {
        
        toast({
          variant: "destructive",
          description: parseError.toString(),
        });
      }
    },
  });

  const handleCreateDuel = (primaryCard:string|null, secondaryCard:string|null) => {
    mutation.mutate({
      accessToken: accessTokenState.userAccessToken,
      primaryPetId: primaryCard,
      secondaryPetId: secondaryCard,
    });
  };
  return (
    <>
      <Button
        disabled={!primaryCard || mutation.isPending}
        onClick={() => {
          handleCreateDuel(primaryCard, secondaryCard);
        }}
        className={`${width} text-md capitalize`}
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-5 justify-center">
            {" "}
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading
          </span>
        ) : primaryCard && secondaryCard ? (
          <span className="flex items-center justify-center gap-5">
            <span className="text-lg">
              <GiCardExchange />
            </span>{" "}
            Swap Card
          </span>
        ) : primaryCard ? (
          <span className="flex items-center justify-center gap-5">
            <span className="text-lg">
              <GiUpCard />
            </span>{" "}
            Add Card
          </span>
        ) : (
          <span className="flex items-center justify-center gap-5">
            <span className="text-lg">
              <GiCardPlay />
            </span>{" "}
            Pick A Card
          </span>
        )}
      </Button>
    </>
  );
};


 
export default EditButton;