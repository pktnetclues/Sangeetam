import React, { useEffect, useState } from "react";
import GetAudios from "../common/GetAudios";
import { AudioType } from "../../types";
import { Box, Grid, Typography } from "@mui/material";
import AudioCard from "../common/AudioCard";

const Homepage: React.FC = () => {
  const [audios, setAudios] = useState<AudioType[]>([]);
  useEffect(() => {
    const CallAPI = async () => {
      const getAudios: AudioType[] = await GetAudios();
      const latestAudios = getAudios.slice(0, 5);
      setAudios(latestAudios);
    };
    CallAPI();
  }, []);

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Box>
        <Typography variant="h4"> Latest Audios</Typography>
        <Grid container spacing={3}>
          {audios.map((audio) => (
            <AudioCard audio={audio} key={audio.audioId} />
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Homepage;
