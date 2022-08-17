import { Route, Routes } from "react-router-dom";
import Index from "../pages/index/index";
import Room from "../pages/room/room";
import "antd/dist/antd.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/room/:roomName" element={<Room />} />
    </Routes>
  );
};

export default App;
