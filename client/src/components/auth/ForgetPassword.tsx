import React, { useState, useEffect } from "react";
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
import { useLocation } from "react-router-dom";

interface IFormInput {
  email: string;
}

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  email: yup.string().required(errMess.message).email("Email is Invalid"),
});

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const InvalidToken = query.get("message");

  useEffect(() => {
    if (InvalidToken) {
      toast.error(InvalidToken);
    }
  }, [InvalidToken]);

  const handleFormSubmit: SubmitHandler<IFormInput> = async (data) => {
    const userData = {
      email: data.email,
    };

    setLoading(true);
    try {
      const response = await axios.post(`/api/reset-password`, userData);

      if (response.status === 200) {
        setLoading(false);
        toast.success("Password reset email sent successfully");
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
      handleError(error as AxiosError);
    }
  };

  const handleError = (error: AxiosError) => {
    let errorMessage = "An error occurred. Please try again.";
    if (error.response && error.response.status === 400) {
      errorMessage = (error.response.data as { error: string }).error;
      toast.error(errorMessage);
    } else if (error.message) {
      errorMessage = error.message;
      toast.error(errorMessage);
    }
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      maxWidth="xs">
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
        }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333" }}>
          Forgot Password
        </Typography>
        <form
          name="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ width: "100%" }}>
          <TextField
            id="email"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
            fullWidth
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ marginBottom: "24px" }}
          />
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
              }}>
              Send Reset Email
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              fullWidth
              startIcon={<CircularProgress size={24} />}
              sx={{
                backgroundColor: "#888",
                color: "#fff",
                fontWeight: 600,
              }}>
              Sending...
            </Button>
          )}
          <Typography
            variant="body2"
            sx={{ marginTop: "16px", color: "#666", fontWeight: 500 }}>
            Remembered your password?{" "}
            <Link to="/login" style={{ color: "#333" }}>
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default ForgetPassword;
