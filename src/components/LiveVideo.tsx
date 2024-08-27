import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng"; // Import Agora SDK
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const LiveVideo = () => {
  const appId = "0179c680e0844994b6d3890e39a019ae";
  const { channelName } = useParams();

  const [activeConnection, setActiveConnection] = useState(false);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [token, setToken] = useState("");
  const [localUserId, setLocalUserId] = useState(null); // State to store local user ID

  const client = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }); // Create Agora client

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const fetchToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/agora/create-room",
        {
          channelName,
        }
      );
      setToken(response.data.token);
    } catch (error) {
      console.error("Error fetching token", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const joinCall = async () => {
    await client.join(appId, channelName, token);
    setLocalUserId(client.uid); // Set the local user ID
    setActiveConnection(true);
  };

  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: token,
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const navigate = useNavigate();

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Play the remote user audio tracks
  audioTracks.forEach((track) => {
    if (track.getUserId() !== localUserId) {
      track.play();
    }
  });

  return (
    <>
      <div id="remoteVideoGrid">
        {remoteUsers.map((user) => (
          <div key={user.uid} className="remote-video-container">
            <RemoteUser user={user} />
          </div>
        ))}
      </div>
      <div id="localVideo">
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={false} // Ensure no local audio playback
          playVideo={cameraOn}
          className=""
        />
        <div id="controlsToolbar">
          <div id="mediaControls">
            <button className="btn" onClick={() => setMic((a) => !a)}>
              Mic
            </button>
            <button className="btn" onClick={() => setCamera((a) => !a)}>
              Camera
            </button>
          </div>
          <button
            id="startConnection"
            onClick={joinCall}
            disabled={activeConnection}
          >
            Join Call
          </button>
          <button
            id="endConnection"
            onClick={() => {
              setActiveConnection(false);
              navigate("/");
            }}
            disabled={!activeConnection}
          >
            Disconnect
          </button>
        </div>
      </div>
    </>
  );
};
