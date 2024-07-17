"use client";
import {Link,useNavigate} from "react-router-dom"
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useState,useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import signupUser from "@/services/authServices/registerUser";
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

const MIN_LENGTH = 6;
const FIELD_VALIDATION = {
  TEST: {
    SPECIAL_CHAR: (value: string) =>
      /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value),
    LOWERCASE: (value: string) => /[a-z]/.test(value),
    UPPERCASE: (value: string) => /[A-Z]/.test(value),
    NUMBER: (value: string) => /.*[0-9].*/.test(value),
  },
  MSG: {
    MIN_LEN: `Password must have ${MIN_LENGTH} characters`,
    SPECIAL_CHAR: "Password must contain at least one special character",
    LOWERCASE: "Password must contain at least one lowercase letter",
    UPPERCASE: "Password must contain at least one uppercase letter",
    NUMBER: "Password must contain at least one number",
    MATCH: "Password must match",
  },
};

const FormSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .trim(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(MIN_LENGTH, {
        message: FIELD_VALIDATION.MSG.MIN_LEN,
      })
      .refine(
        FIELD_VALIDATION.TEST.SPECIAL_CHAR,
        FIELD_VALIDATION.MSG.SPECIAL_CHAR
      )
      .refine(FIELD_VALIDATION.TEST.LOWERCASE, FIELD_VALIDATION.MSG.LOWERCASE)
      .refine(FIELD_VALIDATION.TEST.UPPERCASE, FIELD_VALIDATION.MSG.UPPERCASE)
      .refine(FIELD_VALIDATION.TEST.NUMBER, FIELD_VALIDATION.MSG.NUMBER),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof FormSchema>;

export function SignupForm() {
  const { toast } = useToast();
   
   const dispatch = useDispatch();
   const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode:"onChange"
  });

 const mutation = useMutation({
   mutationFn: signupUser,
   onSuccess: (data) => {
     dispatch(userAction.setUserInfo(data.user));
     dispatch(accessTokenAction.setUserAccessToken(data.accessToken));
     dispatch(refreshTokenAction.setUserRefreshToken(data.refreshToken));
      toast({
        variant:"Success",
        description: data.message,
      });
     localStorage.setItem("account", JSON.stringify(data.user));
       localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
     navigate("/login");
   },
   onError: (error) => {
     try {
       const errormsg = JSON.parse(error.message);
       console.error(`Error ${errormsg.errorCode}: ${errormsg.errorMessage}`);
       toast({
         variant: "destructive",
         description: `Error ${errormsg.errorCode}: ${errormsg.errorMessage}`,
       });
       
     } catch (parseError:any) {
       console.error("Error parsing error message:", parseError);
       toast({
         variant: "destructive",
         description: parseError,
       });
     }
   },
 });

 
  const onSubmit: SubmitHandler<FormData> = (data:any|null) => {
      const { username, email, password } = data;
   mutation.mutate({ username, email, password });
  };

  return (
    <>
      <section className="flex bg-[#ffff] dark:bg-[#030712] rounded-md flex-col justify-center items-center md:w-[350px]  w-full px-4 md:px-0 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[300px] space-y-2 md:space-y-2"
          >
            <h1 className="font-bold text-2xl mb-2  self-start"> Register </h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
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

                      <Button
                        className="p-2 bg-[#ffff] dark:bg-[#030712]  "
                        variant="outline"
                        size="icon"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-[1.2rem] w-[1.2rem] transition-all " />
                        ) : (
                          <Eye className="h-[1.2rem] w-[1.2rem] transition-all  " />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <div className="h-3 leading-3 ">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <div className="h-2 leading-3">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button className="w-full " type="submit">
              Register
            </Button>

            <FormDescription>
              already have an account ,{" "}
              <Link to="/login" className="text-[0.85rem] underline formLink ">
                Login
              </Link>
            </FormDescription>
          </form>
        </Form>
      </section>
    </>
  );
}
