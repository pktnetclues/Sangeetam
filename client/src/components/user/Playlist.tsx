import React from "react";
import AudioPlaylist from "./AudioPlaylist";
import VideoPlaylists from "./VideoPlaylist";

const Playlist = () => {
  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <AudioPlaylist />
      <VideoPlaylists />
    </div>
  );
};

export default Playlist;
