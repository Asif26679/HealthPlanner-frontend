import {  HashRouter  as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./pages/About";
import CreateDiet from "./pages/CreateDiet";
import ProtectedRoute from "./ProtectedRoute";
import Footer from "./components/Footer";
import Workout from "./pages/Workout";
import Plans from "./pages/Plans";
import Chatbot from "./components/Chatbot"; // <-- import Chatbot
import { ChatProvider } from "./context/ChatContext";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <ChatProvider>
      <Router>
        {/* Navbar stays on top */}
        <Navbar />

        {/* Main Page Content */}
        <div className="flex flex-col min-h-screen relative">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/create-diet" element={<CreateDiet />} />
              <Route path="/workouts" element={<Workout />} />
              <Route path="/plans" element={<Plans />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile></Profile>
                </ProtectedRoute>
              }
              />
            </Routes>
          </main>

          {/* Footer always sticks at bottom */}
          <Footer />

          {/* Chatbot always visible on every page */}
          <Chatbot />
        </div>
      </Router>
      </ChatProvider>
    </>
  );
}

export default App;
