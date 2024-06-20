import Yup from "yup";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  email: Yup.string().email("invalid email").required("email is required"),
  password: Yup.string().min(6).required("password is required"),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
  password: Yup.string().min(6).required("password is required"),
});

const updatePassSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
  token: Yup.number().required("token is required"),
  password: Yup.string().min(6).required("password is required"),
});

const emailSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("email is required"),
});

const audioSchema = Yup.object().shape({
  album: Yup.string().min(5).required("album name is required"),
  singerName: Yup.string().min(2).required("singer name is required"),
  writerName: Yup.string().min(2).required("writer name is required"),
});

const videoSchema = Yup.object().shape({
  title: Yup.string().min(5).required("title is required"),
  categoryId: Yup.number().required("category id is required"),
});

const createPlaylistSchema = Yup.object().shape({
  playlistName: Yup.string()
    .max(100, "Playlist name cannot be longer than 100 characters")
    .required("Playlist name is required"),
});

const createPlaylistContentSchema = Yup.object().shape({
  playlistName: Yup.string()
    .max(100, "Playlist name cannot be longer than 100 characters")
    .required("Playlist name is required"),
  audioId: Yup.number().integer().required("Content ID is required"),
});

export {
  registerSchema,
  loginSchema,
  emailSchema,
  updatePassSchema,
  audioSchema,
  videoSchema,
  createPlaylistSchema,
  createPlaylistContentSchema,
};
