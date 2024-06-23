import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { AudioType } from "../../types";
import DeleteAudio from "./DeleteAudio";
import EditAudio from "./EditAudio";
import AudioCard from "../common/AudioCard";

const Audios: React.FC = () => {
  const [audios, setAudios] = useState<AudioType[]>([]);

  useEffect(() => {
    getAudios();
  }, []);

  const getAudios = async () => {
    try {
      const response = await axios.get("/api/all-audios", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAudios(response.data);
      }
    } catch (error) {
      console.error("Error fetching audios:", error);
    }
  };

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <h2>All Audios</h2>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%" }}>
        {audios.map((audio) => (
          <Box
            key={audio.audioId}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}>
            <AudioCard audio={audio} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <EditAudio audioDetails={audio} callAudios={getAudios} />
              <DeleteAudio audioId={audio.audioId} getAudios={getAudios} />
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Audios;
