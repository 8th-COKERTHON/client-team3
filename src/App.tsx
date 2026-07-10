import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ReportPage from "./pages/ReportPage";
import StartPage from "./pages/StartPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RoomCreatePage from "./pages/room/RoomCreatePage";
import RoomEntryPage from "./pages/room/RoomEntryPage";
import RoomJoinPage from "./pages/room/RoomJoinPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/room-entry" element={<RoomEntryPage />} />
      <Route path="/room/create" element={<RoomCreatePage />} />
      <Route path="/room/join" element={<RoomJoinPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
