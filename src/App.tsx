// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./routes/welcome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
