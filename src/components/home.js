import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/home.css";

const Home = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    
    if (token && userId) {
      navigate("/dashboard");
    }
    isMounted = false;
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://todo-backend1-2.onrender.com/api/auth/login", {
        username,
        password,
      });

      if (response.data && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.user._id);
        navigate("/dashboard");
      } else {
        console.error("User data missing in response");
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Invalid credentials");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("https://todo-backend1-2.onrender.com/api/auth/register", {
        fullName,
        username,
        email,
        password,
      });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Registration successful! Please log in.");
        setIsRegister(false);
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">A better offline to-do list app for work</h1>
      <p className="subtitle">
        We make it easier for a team or individual to plan their work by using offline to-do lists
      </p>
      <div className="login-box">
        {isForgotPassword ? (
          <>
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">Enter your email to reset your password</p>
            <input type="email" placeholder="Email" className="input-field" />
            <button className="login-button">Send Reset Link</button>
            <p className="signup-text">
              Remembered your password?{" "}
              <span className="signup-link" onClick={() => setIsForgotPassword(false)}>
                Login
              </span>
            </p>
          </>
        ) : isRegister ? (
          <>
            <h2 className="login-title">Create an Account</h2>
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="User Name"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <button className="login-button" onClick={handleRegister}>
              Register
            </button>
            <p className="signup-text">
              Already have an account?{" "}
              <span className="signup-link" onClick={() => setIsRegister(false)}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="login-title">
              To get started, <span className="bold">Login</span>
            </h2>
            <p className="login-subtitle">
              & enjoy all of our cool <span className="features">features</span> ✌️
            </p>
            <input
              type="text"
              placeholder="User Name"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="input-field password-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span className="forgot-password" onClick={() => setIsForgotPassword(true)}>
                Forgot password?
              </span>
            </div>
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            <p className="signup-text">
              Don't have an account?{" "}
              <span className="signup-link" onClick={() => setIsRegister(true)}>
                Sign Up
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
