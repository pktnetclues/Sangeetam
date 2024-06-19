import axios from "axios";

const GetAudios = async () => {
  try {
    const response = await axios.get("/api/all-audios", {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching audios:", error);
  }
};

export default GetAudios;
