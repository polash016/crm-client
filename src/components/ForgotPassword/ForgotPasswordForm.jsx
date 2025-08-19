"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  CardActionArea,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DSForm from "../Forms/DSForm";
import DSInput from "../Forms/DSInput";
// import useAuth from "@/hooks/useAuth";
// import useAxiosPublic from "@/hooks/useAxiosPublic";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);

  //   const { auth } = useAuth();
  //   const navigate = useNavigate();
  //   const location = useLocation();
  //   const axiosPublic = useAxiosPublic();

  //   const from = location.state?.from?.pathname || "/not-found";

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);

    try {
      const { data } = await axiosPublic.post(
        "/api/auth/employee/forgot-password",
        { email }
      );

      if (data.success) {
        toast.success(data.message);
      }
    } catch ({ response }) {
      toast.error(response?.data?.message);
    } finally {
      resetField("email");
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     if (auth) navigate(from, { replace: true });
  //   }, [auth, from, navigate]);

  return (
    <Box maxWidth={400} mx="auto" mt={8} boxShadow={3}>
      <Card>
        <CardHeader
          title="Reset your password"
          subheader={
            <Typography marginTop={1} variant="h5" color="black">
              Enter your login email to reset your password.
            </Typography>
          }
        />
        <CardContent>
          <DSForm onSubmit={handleSubmit(onSubmit)}>
            {/* <TextField
              {...register("email", { required: true })}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email && "Email is required"}
            /> */}

            <DSInput
              fullWidth={true}
              name={"email"}
              label={"Enter your email"}
            />

            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }>
                {loading ? "Sending..." : "Get reset link"}
              </Button>
            </Box>

            <Box mt={3} textAlign="center">
              <Typography variant="h6">
                Never mind!{" "}
                <Link href="/" underline="hover">
                  Take me back to login
                </Link>
              </Typography>
            </Box>
          </DSForm>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordForm;
