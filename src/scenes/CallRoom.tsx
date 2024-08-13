// src/components/CallRoom.tsx
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AppID = "YOUR_APP_ID"; // Replace with your Agora App ID

const CallRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null);

  useEffect(() => {
    const initAgora = async () => {
      if (!roomId) return;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
      setClient(client);

      client.on(
        "user-published",
        async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
          await client.subscribe(user, mediaType);

          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
            remoteAudioTrack.play();
          }

          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
            remoteVideoTrack.play("remote_stream");
          }
        }
      );

      client.on("user-unpublished", (user: IAgoraRTCRemoteUser) => {
        // Handle user leaving the call (e.g., stop remote video)
      });

      await client.join(AppID, roomId, null);
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      await client.publish([audioTrack, videoTrack]);
      videoTrack.play("local_stream");
    };

    initAgora();

    return () => {
      client?.leave();
      localAudioTrack?.close();
      localVideoTrack?.close();
    };
  }, [roomId]);

  return (
    <div>
      <div id="local_stream" style={{ width: "320px", height: "240px" }}></div>
      <div id="remote_stream" style={{ width: "320px", height: "240px" }}></div>
    </div>
  );
};

export default CallRoom;
