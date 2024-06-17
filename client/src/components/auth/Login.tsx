import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";

interface IFormInput {
  email: string;
  password: string;
}

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  email: yup.string().required(errMess.message).email("Email is Invalid"),
  password: yup.string().min(6).required(errMess.message),
});

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit: SubmitHandler<IFormInput> = async (data) => {
    const userData = {
      email: data.email,
      password: data.password,
    };
    setLoading(true);
    try {
      const response = await axios.post(`/api/login`, userData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success("Logged in successfully");
        console.log(response.data);

        if (response.data.isAdmin) {
          navigate("/admin/users");
        } else {
          navigate("/user/home");
        }
      }
    } catch (error) {
      setLoading(false);
      handleError(error as AxiosError);
    }
  };

  const handleError = (error: AxiosError) => {
    let errorMessage = "An error occurred. Please try again.";
    if (error.response && error.response.status === 400) {
      errorMessage = (error.response.data as { message: string }).message;
      console.log(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      maxWidth="xs"
    >
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333" }}
        >
          Login
        </Typography>
        <form
          name="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ width: "100%" }}
        >
          <TextField
            id="email"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            id="password"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            type="password"
            {...register("password")}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{ marginBottom: "24px" }}
          />
          <Typography
            variant="body2"
            sx={{ marginBottom: "10px", color: "#666", fontWeight: 500 }}
          >
            Forgot your password?{" "}
            <Link to="/forgot-password" style={{ color: "#333" }}>
              Click here
            </Link>
          </Typography>

          {!loading ? (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              startIcon={<CircularProgress size={24} />}
              fullWidth
              sx={{
                backgroundColor: "#888",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Logging in...
            </Button>
          )}
          <Typography
            variant="body2"
            sx={{ marginTop: "16px", color: "#666", fontWeight: 500 }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#333" }}>
              Register
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
