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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  name: yup.string().required(errMess.message),
  email: yup.string().required(errMess.message).email("Email is Invalid"),
  password: yup.string().min(6).required(errMess.message),
});

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFormSubmit: SubmitHandler<IFormInput> = async (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    setLoading(true);
    try {
      const response = await axios.post(`/api/register`, userData);

      if (response.status === 200) {
        setLoading(false);
        setOpen(true);
        reset();
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
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  const handleClose = () => {
    setOpen(false);
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
          Register
        </Typography>
        <form
          name="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ width: "100%" }}>
          <TextField
            id="name"
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
            fullWidth
            variant="outlined"
            size="small"
            margin="normal"
          />
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
              Register
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
              Registering...
            </Button>
          )}
          <Typography
            variant="body2"
            sx={{ marginTop: "16px", color: "#666", fontWeight: 500 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#333" }}>
              Login
            </Link>
          </Typography>
        </form>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you for registering. Please wait for admin approval to
            activate your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
