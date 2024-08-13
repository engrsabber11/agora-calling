import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { useState } from "react";
// import "./styles.css";

// Define types for state
interface IAgoraState {
  client: IAgoraRTCClient | null;
  uid: string | number; // Updated to number
  localAudioTrack: ILocalAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
}

export default function AgoraVoice() {
  const [state, setState] = useState<IAgoraState>({
    client: null,
    uid: "",
    localAudioTrack: null,
    localVideoTrack: null,
  });

  const join = async () => {
    const channelName = "abc";

    // Create Agora client instance
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

    // Join the channel
    const uid = await client.join(
      "0179c680e0844994b6d3890e39a019ae",
      channelName,
      null
    );

    // Create local audio and video tracks
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    // Publish local tracks
    await client.publish([localAudioTrack, localVideoTrack]);

    // Play local video track
    localVideoTrack.play("local_stream");

    // Handle remote user published
    client.on(
      "user-published",
      async (user: IAgoraRTCRemoteUser, mediaType: "audio") => {
        await client.subscribe(user, mediaType);

        // Handle remote audio track
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
          remoteAudioTrack.play(); // This will play the remote audio
        }

        // Handle remote video track
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
          remoteVideoTrack.play("remote_stream"); // This will play the remote video
        }
      }
    );

    // Update state
    setState({ client, uid, localAudioTrack, localVideoTrack });
  };

  return (
    <div className="App">
      <button onClick={join}>JOIN CALL</button>
      <div id="local_stream" style={{ width: "320px", height: "240px" }}></div>
      <div id="remote_stream" style={{ width: "320px", height: "240px" }}></div>
    </div>
  );
}
