import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { useDispatch } from "react-redux";
import { adminLogin } from "../../../redux/actions/AdminLoginAction";

export default function AdminLogin() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await dispatch(adminLogin(username, password));

  // ✅ Only navigate if login was successful (token exists)
  if (result?.access) {
    navigate("/AdminDashboard");
  } else {
    alert("Invalid credentials. Please try again.");
  }
};

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>

          {/* <div className="admin-register-center">
            <span>
              Don’t have an account?{" "}
              <span
                className="admin-register-link"
                onClick={() => (window.location.href = "/AdminRegister")}
              >
                Register
              </span>
            </span>
          </div> */}

        </form>
      </div>
    </div>
  );
}