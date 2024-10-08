import { LoginForm } from "@/components/loginFormComponent";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import loginUser from "@/services/authServices/loginUser";
import { userAction } from "@/stores/reducers/userReducer";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import { refreshTokenAction } from "@/stores/reducers/refreshTokenReducer";
import { RootState } from "@/types";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
  const { toast } = useToast();

  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

   useEffect(() => {
     if (
       userState.userInfo &&
       accessTokenState.userAccessToken &&
       refreshTokenState.userRefreshToken
     ) {
       navigate("/");
       toast({
         variant: "Success",
         description: "user already logged in",
       });
     }
   }, [
     navigate,
     userState.userInfo,
     refreshTokenState.userRefreshToken,
     accessTokenState.userAccessToke,
   ]);
  return (
    <>
      <section className="w-screen h-screen flex flex-col justify-center overflow-hidden">
        <section className="relative w-full h-screen lg:w-[85vw] lg:h-[85vh] ">
          <div className="w-full h-full lg:rounded-br-[6rem] bglogin "></div>
          <div className="hidden  lg:inline-block w-[60px] h-[60px] bg-[#ffff] dark:bg-[#030712] absolute lg:bottom-20 rounded-lg lg:right-[10rem] rotate-45"></div>
          <h1 className="top-20 left-1/2 -translate-x-[50%] md:top-[25%] lg:-translate-x-[0%] text-center lg:text-right absolute  lg:top-20 lg:right-0 text-3xl lg:text-4xl w-[350px] font-bold ">
            welcome back
          </h1>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[35%] lg:-translate-x-[55%] lg:translate-y-[5%]  lg:top-10 lg:left-0 lg:p-5 flex justify-between lg:w-full">
            <div className=""></div>
            <LoginForm />
          </div>
        </section>
      </section>
    </>
  );
};

export default LoginPage;
  