import AgoraRTC, { IAgoraRTCClient, ILocalTrack } from "agora-rtc-sdk-ng";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const JoinMeeting: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();

  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalTrack | null>(
    null
  );
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const nagivate = useNavigate();

  useEffect(() => {
    const joinMeeting = async () => {
      try {
        if (!meetingId) return;
        const response = await axios.post(
          "http://192.168.12.83:8001/api/agora/create-room",
          {
            channelName: meetingId,
          }
        );
        const { token } = response.data;
        // Initialize Agora client and join channel
        const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });
        await agoraClient.join("YOUR_APP_ID", meetingId, token);

        // Create local audio track
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);

        // Publish local audio track
        await agoraClient.publish([audioTrack]);

        // Handle remote users
        agoraClient.on("user-published", async (user, mediaType) => {
          if (mediaType === "audio") {
            await agoraClient.subscribe(user, mediaType);
            // You can play the remote audio here if needed
            console.log(
              `Remote user ${user.uid} has published an audio track.`
            );
          }
        });

        agoraClient.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "audio") {
            console.log(
              `Remote user ${user.uid} has unpublished an audio track.`
            );
            // Handle user audio track removal if necessary
          }
        });

        setClient(agoraClient);
      } catch (error) {
        console.error("Error joining the meeting:", error);
        setError(
          "An error occurred while trying to join the meeting. Please check your permissions and try again."
        );
      }
    };

    if (meetingId) {
      joinMeeting();
    }

    // Cleanup when the component unmounts
    return () => {
      if (client) {
        client
          .leave()
          .then(() => {
            console.log("Left the channel successfully.");
          })
          .catch((err) => {
            console.error("Error leaving the channel:", err);
          });

        if (localAudioTrack) {
          localAudioTrack.stop();
          localAudioTrack.close();
        }
      }
    };
  }, [meetingId]);

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const leaveCall = () => {
    if (client) {
      client
        .leave()
        .then(() => {
          console.log("Left the channel successfully.");
          setClient(null);
          if (localAudioTrack) {
            localAudioTrack.stop();
            localAudioTrack.close();
          }
        })
        .catch((err) => {
          console.error("Error leaving the channel:", err);
        });
    }
    nagivate("/");
  };

  return (
    <div>
      <h2>Meeting ID: {meetingId}</h2>
      <div
        id="avatar"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>Avatar</span> {/* Replace this with your actual avatar icon */}
      </div>
      <button onClick={toggleAudio}>{isMuted ? "Unmute" : "Mute"}</button>
      <button onClick={leaveCall}>Leave Call</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default JoinMeeting;
