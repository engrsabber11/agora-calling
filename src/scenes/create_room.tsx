import axios from "axios";
import React, { useState } from "react";

const CreateRoom: React.FC = () => {
  const [roomLink, setRoomLink] = useState<string>("");

  const createRoom = async () => {
    const channelName = `room-${Math.random().toString(36).substr(2, 9)}`;
    const response = await axios.post(
      "http://192.168.12.83:8001/api/agora/create-room",
      {
        channelName,
      }
    );
    const { token } = response.data;

    setRoomLink(
      `${window.location.origin}/join?channelName=${channelName}&token=${token}`
    );
  };

  return (
    <div>
      <h1>Create a Room</h1>
      <button onClick={createRoom}>Create Room</button>
      {roomLink && (
        <div>
          <p>Send this link to invite others:</p>
          <a href={roomLink}>{roomLink}</a>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
