import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreateRoom from "./scenes/CreateRoom";
import JoinMeeting from "./scenes/join_meeting";
import JoinRoom from "./scenes/join_room";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<CreateRoom />} /> */}
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<JoinRoom />} />
        {/* <Route path="/room/:roomId" element={<JoinRoom />} /> */}
        <Route path="/meeting/:meetingId" element={<JoinMeeting />} />
      </Routes>
    </>
  );
}

export default App;
