import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RoomCreatePage from "./pages/room/RoomCreatePage";
import RoomEntryPage from "./pages/room/RoomEntryPage";
import RoomJoinPage from "./pages/room/RoomJoinPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/room-entry" element={<RoomEntryPage />} />
      <Route path="/room/create" element={<RoomCreatePage />} />
      <Route path="/room/join" element={<RoomJoinPage />} />
      <Route path="*" element={<Navigate to="/room-entry" replace />} />
    </Routes>
  );
}

export default App;
