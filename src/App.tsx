import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { ConnectForm } from "./components/ConnectForm";
import { LiveVideo } from "./components/LiveVideo";

function App() {
  const agoraClient = useRTCClient(
    AgoraRTC.createClient({
      codec: "vp8",
      mode: "rtc",
    })
  );

  const navigate = useNavigate();

  const handleConnect = (channelName: string) => {
    navigate(`/via/${channelName}`); // on form submit, navigate to new route
  };

  return (
    <Routes>
      {/* <Route path='/' element={ConnectForm} connectToVide={handleConnect } /> */}
      <Route
        path="/"
        element={<ConnectForm connectToVideo={handleConnect} />}
      />
      <Route
        path="/via/:channelName"
        element={
          <AgoraRTCProvider client={agoraClient}>
            <LiveVideo />
          </AgoraRTCProvider>
        }
      />
    </Routes>
  );
}

export default App;
