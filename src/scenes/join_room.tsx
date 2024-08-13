import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const APP_ID = "0179c680e0844994b6d3890e39a019ae";

interface LocalTracks {
  audio: IMicrophoneAudioTrack | null;
}

const JoinRoom: React.FC = () => {
  const [client] = useState<IAgoraRTCClient>(() =>
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  const [localTracks, setLocalTracks] = useState<LocalTracks>({ audio: null });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [joined, setJoined] = useState<boolean>(false);
  const location = useLocation();

  const joinRoom = async () => {
    const urlParams = new URLSearchParams(location.search);
    const channelName = urlParams.get("channelName");
    const token = urlParams.get("token");

    if (channelName && token) {
      await client.join(APP_ID, channelName, token, null);
      const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([microphoneTrack]);
      setLocalTracks({ audio: microphoneTrack });
      setJoined(true);
    }
  };

  const toggleMute = () => {
    if (localTracks.audio) {
      if (isMuted) {
        localTracks.audio.setEnabled(true);
      } else {
        localTracks.audio.setEnabled(false);
      }
      setIsMuted(!isMuted);
    }
  };

  const leaveCall = async () => {
    await client.leave();
    if (localTracks.audio) localTracks.audio.close();
    setJoined(false);
  };

  return (
    <div>
      <h1>Join a Room</h1>

      {/* {joined ? (
        <div>
          <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
          <button onClick={leaveCall}>Leave Call</button>
        </div>
      ) : (
        <p>Joining room...</p>
      )} */}
    </div>
  );
};

export default JoinRoom;
