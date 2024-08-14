import React from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { gold, silver } from "@/assets";
import { Button } from "@/components/ui/button"; // Import Button component
import NavBarComp from "@/components/navBarComponent";
import HeaderComp from "@/components/headerComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CardComp from "@/components/cardComp";
import ItemCardComp from "@/components/itemsCard";
import { GiFlatPawPrint, GiCrown, GiTrophy } from "react-icons/gi";
import NumberCounter from "@/components/numberCounterprop";
import { useQuery } from "@tanstack/react-query";
import fetchUserById from "@/services/userServices/getUserById";

const ItemInventoryPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location.pathname);
  const { sortParam } = useParams();
  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["user", userState.userInfo._id],
    queryFn: () =>
      fetchUserById({
        userId: userState?.userInfo?._id,
      }),
  });

  useEffect(() => {
    if (!userState.userInfo || !refreshTokenState.userRefreshToken) {
      toast({
        variant: "warning",
        description: "user needs to login",
      });
      navigate("/login");
    }
  }, [
    navigate,
    userState.userInfo,
    refreshTokenState.userRefreshToken,
    accessTokenState.userAccessToke,
  ]);

  let [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
     
        <main className="mx-2  md:mx-6 ">
          coming soon 
        </main>
    </>
  );
};

export default ItemInventoryPage;
