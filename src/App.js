import{React, Component} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoDashboard from "./components/TodoDashboard";
import Home from "./components/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<TodoDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

