import { useState } from "react";

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
import { useNavigate, useParams } from "react-router-dom";

export const LiveVideo = () => {
  const appId = "0179c680e0844994b6d3890e39a019ae";
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const { channelName } = useParams(); //pull the channel name from the param

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token:
        "007eJxTYLjYOqvksN5xfb7Vvnc5fwspyOmxeN4/3HHGNcLfsY/52FMFBgNDc8tkMwuDVAMLExNLS5MksxRjC0uDVGPLRANDy8TUltVH0xoCGRl2qd1lYmSAQBBfgKEktbhEtyRfNzElRTc5MSeHgQEAYOQibA==",
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  // to leave the call
  const navigate = useNavigate();

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // play the remote user audio tracks
  audioTracks.forEach((track) => track.play());

  return (
    <>
      <div id="remoteVideoGrid">
        {
          // Initialize each remote stream using RemoteUser component
          remoteUsers.map((user) => (
            <div key={user.uid} className="remote-video-container">
              <RemoteUser user={user} />
            </div>
          ))
        }
      </div>
      <div id="localVideo">
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={micOn}
          playVideo={cameraOn}
          className=""
        />
        <div>
          {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
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
              id="endConnection"
              onClick={() => {
                setActiveConnection(false);
                navigate("/");
              }}
            >
              {" "}
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
