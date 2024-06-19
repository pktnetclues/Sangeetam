import React, { useEffect, useState } from "react";
import { AudioType } from "../../types";
import GetAudios from "../common/GetAudios";
import { Box } from "@mui/material";
import AudioCard from "../common/AudioCard";

const AllAudios = () => {
  const [audios, setAudios] = useState<AudioType[]>([]);
  useEffect(() => {
    const CallAPI = async () => {
      const getAudios: AudioType[] = await GetAudios();
      setAudios(getAudios);
    };
    CallAPI();
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
          <AudioCard audio={audio} key={audio.audioId} />
        ))}
      </Box>
    </div>
  );
};

export default AllAudios;
