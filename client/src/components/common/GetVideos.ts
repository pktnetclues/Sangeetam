import axios from "axios";

const GetVideos = async () => {
  try {
    const response = await axios.get("/api/all-videos", {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching Videos:", error);
  }
};

export default GetVideos;
