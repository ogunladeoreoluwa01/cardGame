import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RiNotification2Fill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import clearAccessToken from "@/stores/actions/accessTokenAction";
import clearRefreshToken from "@/stores/actions/refreshTokenAction";
import logOut from "@/stores/actions/userAction";
import {ModeToggle} from "@/components/mode-toggle"
import { gameAction } from "@/stores/reducers/gameReducer";
import { liveGameAction } from "@/stores/reducers/liveGameReducer";
import { gameSessionAction } from "@/stores/reducers/gameSessionReducer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface Props {
  userState: { userInfo: any | null };
}

const HeaderComp: React.FC<Props> = ({ userState }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  

  const signOut = (): void => {
    dispatch(clearAccessToken());
    dispatch(clearRefreshToken());
    dispatch(logOut());
    dispatch(liveGameAction.resetLiveGameState());
    localStorage.removeItem("game");
    dispatch(gameAction.resetGameState());
    localStorage.removeItem("liveGame");
    dispatch(gameSessionAction.clearSessionId());
    localStorage.removeItem("gameSession");
    localStorage.removeItem("account");
    localStorage.removeItem("refreshToken");
    toast({
      variant: "warning",
      description: "User logged out",
    });
    navigate("/login"); // Navigate to the login page after signing out
  };

  const navigateDash = () => {
    navigate("/");
  };

  const navigateNotif = () => {
    navigate("/notification");
  };

  return (
    <div>
      <section className="flex gap-2 items-center  justify-between my-1 w-full">
        <h1>Logo</h1>
        <div className="flex items-center gap-2 sticky top-0">
          <ModeToggle />
          <Button
            onClick={navigateNotif}
            variant="secondary"
            className="w-10 h-10 rounded-sm p-0 text-lg"
          >
            <RiNotification2Fill />
          </Button>
          <Button
            onClick={signOut}
            variant="destructive"
            className="w-10 h-10 rounded-sm p-0 text-lg"
          >
            <IoLogOut />
          </Button>
          <Button
            onClick={navigateDash}
            variant="secondary"
            className="w-10 h-10 rounded-sm p-[0.1rem] hover:bg-primary bg-muted hover:p-[0.2rem]"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <img
                    src={userState?.userInfo?.profile?.avatar}
                    alt={userState?.userInfo?.username}
                    className="w-full h-full rounded-sm object-cover object-center "
                    fetchpriority="high"
                    loading="lazy"
                  />
                </TooltipTrigger>
                <TooltipContent className="py-1 rounded-sm z-[99999999] ">{userState?.userInfo?.username} </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HeaderComp;
