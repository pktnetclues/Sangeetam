import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import AudioCard from "../common/AudioCard";

const PendingAudios: React.FC = () => {
  const [audios, setAudios] = useState<any[]>([]);

  useEffect(() => {
    const getAudios = async () => {
      try {
        const res = await axios.get("/api/pending-audios", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setAudios(res.data);
        }
      } catch (error) {
        console.error("Error fetching audios:", error);
      }
    };

    getAudios();
  }, []);

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          //   justifyContent: "center",
          width: "100%",
        }}
      >
        {audios.map((audio) => (
          <AudioCard audio={audio} />
        ))}
      </Box>
    </div>
  );
};

export default PendingAudios;
