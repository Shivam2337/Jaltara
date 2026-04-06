import React from "react";
// import "../Pages.css";

export default function AdminLogin() {
  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        <form>
          <label>Username</label>
          <input type="text" placeholder="Enter username" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          <button type="submit">Login</button>

          <div className="admin-register-center">
            <span>
              Don’t have an account?{" "}
              <span
                className="admin-register-link"
                onClick={() => (window.location.href = "/AdminRegister")}
              >
                Register
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
