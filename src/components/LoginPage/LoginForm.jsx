"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import DSForm from "../Forms/DSForm";
import DSInput from "../Forms/DSInput";
import { loginUser } from "@/services/actions/loginUser";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRouter } from "next/navigation";
import { isLoggedIn, storeUserInfo } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
// import { toast } from "sonner";

const validation = z.object({
  id: z
      .string({ required_error: "Id is Required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Must be at least 6 characters"),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const router = useRouter();
  const { updateUser } = useAuth();

  const loggedIn = isLoggedIn();
  if (loggedIn) {
    router.push("/dashboard");
  }

  const onSubmit = async (data) => {
    setLoading(true);

    const userCredentials = {
      id: data.id,
      password: data.password,
    };

    console.log("User credentials being sent:", userCredentials);

    try {
      toast.loading("Logging in...");
      const res = await loginUser(userCredentials);

      if (res?.data?.accessToken) {
        storeUserInfo(res?.data?.accessToken); // Uncomment if you use localStorage
        // Optionally update user state here
        toast.dismiss();
        toast.success(res?.message || "Logged in successfully");
        router.push("/dashboard");
      } else {
        setLoading(false);
        toast.dismiss();
        toast.error(res?.message || "Login Failed! Try Again");
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error?.message || "Something went wrong");
    }

    // const res = loginUser(userCredentials);

    // toast.promise(Promise.resolve(res), {
    //   loading: "Logging in...",
    //   success: (res) => {
    //     console.log("res", res);
    //     if (res?.data?.accessToken) {
    //       // storeUserInfo(res?.data?.accessToken);
    //       // Set user data in Redux store
    //       // if (res?.data?.user) {
    //       //   updateUser(res.data.user);
    //       // }
    //       router.refresh();
    //       router.push("/dashboard");
    //       return res?.message || "Logged in successfully";
    //     } else {
    //       setLoading(false);
    //       return res?.message || "Login Failed! Try Again";
    //     }
    //   },
    //   error: (error) => {
    //     setLoading(false);
    //     console.log(error.message);
    //     return error?.message || "Something went wrong";
    //   },
    // });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 2,
        overflow: "auto",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <CardHeader
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
            padding: 3,
          }}
          title={
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                marginBottom: 1,
                background: "linear-gradient(45deg, #fff, #f0f0f0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Digital Seba CRM
            </Typography>
          }
          subheader={
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontWeight: 400,
                letterSpacing: 0.5,
              }}
            >
              Welcome back! Please sign in to your account
            </Typography>
          }
        />
        <CardContent sx={{ padding: 4 }}>
          <DSForm
            onSubmit={onSubmit}
            resolver={zodResolver(validation)}
            defaultValues={{
              id: "DS-User-001",
              password: "securePassword@123",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Email Field */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    marginBottom: 1,
                  }}
                >
                  ID
                </Typography>
                <DSInput
                  name={"id"}
                  placeholder={"Enter your id"}
                  type="text"
                  fullWidth={true}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    marginBottom: 1,
                  }}
                >
                  Password
                </Typography>
                <DSInput
                  name={"password"}
                  type={isEyeOpen ? "text" : "password"}
                  placeholder={"Enter your password"}
                  fullWidth={true}
                 
                />
              </Box>

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: "right", marginTop: -1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot your password?
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  marginTop: 2,
                  padding: "12px 24px",
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(0, 0, 0, 0.12)",
                    color: "rgba(0, 0, 0, 0.38)",
                    transform: "none",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                    Signing in...
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>
              
            </Box>
          </DSForm>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
