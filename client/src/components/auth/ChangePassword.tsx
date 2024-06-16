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
import { useNavigate, useLocation } from "react-router-dom";

interface IFormInput {
  newPassword: string;
  confirmNewPassword: string;
}

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  newPassword: yup.string().min(6).required(errMess.message),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required(errMess.message),
});

const ChangePasswordAfterForgot: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const query = new URLSearchParams(location.search);
  const email = query.get("email");

  const [loading, setLoading] = useState(false);

  const handleFormSubmit: SubmitHandler<IFormInput> = async (data) => {
    const userData = {
      email: email,
      password: data.newPassword,
    };

    setLoading(true);
    try {
      const response = await axios.post(`/api/change-password`, userData);

      if (response.status === 200) {
        setLoading(false);
        toast.success("Password changed successfully");
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
          Change Password
        </Typography>
        <form
          name="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ width: "100%" }}>
          <TextField
            id="newPassword"
            label="New Password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            type="password"
            {...register("newPassword")}
            fullWidth
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            id="confirmNewPassword"
            label="Confirm New Password"
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
            type="password"
            {...register("confirmNewPassword")}
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
              Change Password
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
              Changing...
            </Button>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default ChangePasswordAfterForgot;
