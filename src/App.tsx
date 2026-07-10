import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import StartPage from "./pages/StartPage";
import NotificationsPage from "./pages/NotificationsPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RoomCreatePage from "./pages/room/RoomCreatePage";
import RoomEntryPage from "./pages/room/RoomEntryPage";
import RoomJoinPage from "./pages/room/RoomJoinPage";
import ChoreCatalogBottomSheet from "./components/chore/ChoreCatalogBottomSheet";
import ChoreAddPage from "./pages/ChoreAddPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/room-entry" element={<RoomEntryPage />} />
      <Route path="/room/create" element={<RoomCreatePage />} />
      <Route path="/room/join" element={<RoomJoinPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/chore-catalog" element={<ChoreCatalogBottomSheet />} />
      <Route path="/add-chore" element={<ChoreAddPage />} />
    </Routes>
  );
}

export default App;
