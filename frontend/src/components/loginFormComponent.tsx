"use client";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useState,useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import loginUser from "@/services/authServices/loginUser";
import { userAction } from "@/stores/reducers/userReducer";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import { refreshTokenAction } from "@/stores/reducers/refreshTokenReducer";
import { RootState } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";


const FormSchema = z.object({
  userInfo: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .trim(),

  password: z.string().min(3, {
    message: "please input a valid password",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
     const userState: any | null = useSelector(
       (state: RootState) => state.user
     );
     const accessTokenState: any | null = useSelector(
       (state: RootState) => state.accessToken
     );
     const refreshTokenState: any | null = useSelector(
       (state: RootState) => state.refreshToken
     );
     const dispatch = useDispatch();
     const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userInfo: "",
      password: "",
    },
    mode:"onChange"
  });

 const mutation = useMutation({
   mutationFn: loginUser,
   onSuccess: (data) => {
     dispatch(userAction.setUserInfo(data.user));
     dispatch(accessTokenAction.setUserAccessToken(data.accessToken));
     dispatch(refreshTokenAction.setUserRefreshToken(data.refreshToken));
     toast({
       variant: "Success",
       description: data.message,
     });
     localStorage.setItem("account", JSON.stringify(data.user));
     localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
     navigate("/");
   },
   onError: (error) => {
     try {
       const errormsg = JSON.parse(error.message);
       console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
       toast({
         variant: "destructive",
         description: `Error ${errormsg.errorCode}: ${errormsg.errorMessage}`,
       });
     } catch (parseError: any) {
       console.error("Error parsing error message:", parseError);
       toast({
         variant: "destructive",
         description: parseError,
       });
     }
   },
 });



 const onSubmit: SubmitHandler<FormData> = (data: any | null) => {
   const { userInfo, password } = data;
   mutation.mutate({ userInfo, password });

 };

  return (
    <>
      <section className="flex bg-[#ffff] dark:bg-[#030712] rounded-md flex-col justify-center items-center md:w-[350px] w-full px-4 md:px-0 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[300px] space-y-4 md:space-y-4"
          >
            <h1 className="font-bold text-xl mb-2  self-start">
              {" "}
              good seeing you again{" "}
            </h1>
            <FormField
              control={form.control}
              name="userInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="useremail or username" {...field} />
                  </FormControl>

                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative flex gap-2 items-center ">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                      />

                      <span
                        className="p-2 bg-[#ffff] dark:bg-[#030712] border rounded-lg cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff
                            className="h-[1.2rem] w-[1.2rem] scale-animation"
                            style={{ animationName: "scaleDown" }}
                          />
                        ) : (
                          <Eye
                            className="h-[1.2rem] w-[1.2rem] scale-animation"
                            style={{ animationName: "scaleUp" }}
                          />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <div className="h-2 leading-3">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormDescription>
              forgot your password ,{" "}
              <Link
                to="/forgot-password"
                className="text-[0.85rem] underline formLink "
              >
                forgot password
              </Link>
            </FormDescription>
            <Button className="w-full " type="submit">
              login
            </Button>

            <FormDescription>
              Dont have an account ,{" "}
              <Link
                to="/sign-up"
                className="text-[0.85rem] underline formLink "
              >
                signup
              </Link>
            </FormDescription>
          </form>
        </Form>
      </section>
    </>
  );
}
