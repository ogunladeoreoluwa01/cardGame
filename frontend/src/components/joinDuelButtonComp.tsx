"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import joinDuel from "@/services/gameServices/joinADuel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import refreshAccessToken from "@/services/authServices/refreshAccessToken";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import clearAccessToken from "@/stores/actions/accessTokenAction";
import clearRefreshToken from "@/stores/actions/refreshTokenAction";
import logOut from "@/stores/actions/userAction";
import { AppDispatch } from "@/stores";
import { gameAction } from "@/stores/reducers/gameReducer";
import { liveGameAction } from "@/stores/reducers/liveGameReducer";
const FormSchema = z.object({
  pin: z
    .string()
    .optional() // Make pin field optional
    .refine((value) => !value || /^[a-zA-Z0-9]{6}$/.test(value), {
      message:
        "Your one-time password must be exactly 6 alphanumeric characters.",
    }),
});

interface JoinDuelWithKeyProps {
  setGameState: React.Dispatch<React.SetStateAction<any>>;
}

export const JoinDuelWithKey: React.FC<JoinDuelWithKeyProps> = ({
  setGameState,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const refreshTokenState = useSelector(
    (state: RootState) => state.refreshToken
  );
  const accessTokenState = useSelector((state: RootState) => state.accessToken);

  useEffect(() => {
    console.log(refreshTokenState.userRefreshToken);
    console.log(accessTokenState);
    console.log()
  }, [refreshTokenState, accessTokenState]);

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
        toast({
          variant: "warning",
          description: "User logged out",
        });
        navigate("/login");
      }
    }
  };

  const mutation = useMutation({
    mutationFn: joinDuel,
    onSuccess: (data) => {
      toast({
        variant: "Success",
        description: "Duel joined successfully",
      });
      setGameState(data.duel);
          dispatch(gameAction.setGameState(data.duel));
          localStorage.setItem("game", JSON.stringify(data.duel));
               dispatch(liveGameAction.setLiveGameState(data.duel));
               localStorage.setItem("liveGame", JSON.stringify(data.duel));
      navigate(
        `/games-page/${data.duel?._id}/duelJoinKey/${data.duel?.duelJoinKey}`
      );
    },
    onError: async (error: any) => {
      try {
        const errorMessage = JSON.parse(error.message);
        console.error(
          `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`
        );

        if (errorMessage.errorCode === 440) {
          const newAccessToken = await refresh();
          if (newAccessToken) {
            mutation.mutate({
              accessToken: newAccessToken,
              duelJoinKey: form.getValues("pin")?.toUpperCase(),
            });
          }
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    mutation.mutate({
      accessToken: accessTokenState.userAccessToken,
      duelJoinKey: data.pin,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[250px] space-y-6   "
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Join with an invite key or try your luck and find a worthy
                opponent
              </FormLabel>
              <FormControl className="mx-auto  w-[250px] h-[200px]">
                <InputOTP
                  className="mx-auto w-[250px] h-[200px] "
                  maxLength={6}
                  {...field}
                  value={field.value?.toUpperCase()} // Ensure uppercase display
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup className="mx-auto w-[250px]">
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="md:w-[250px]  w-full">
          Join a Duel
        </Button>
      </form>
    </Form>
  );
};
