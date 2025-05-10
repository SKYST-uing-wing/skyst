import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./routes/welcome";
import VoiceInput from "./routes/voice_input";
import Visualize from "./routes/visualize";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/voice_input" element={<VoiceInput />} />
        <Route path="/visualize" element={<Visualize />} />
      </Routes>
    </Router>
  );
}

export default App;
