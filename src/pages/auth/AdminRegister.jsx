import React from "react";
// import "../Pages.css";

export default function AdminRegister() {
  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <h2>Admin</h2>

        <form>
          <label>Username</label>
          <input type="text" placeholder="Enter username" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          <label>Email</label>
          <input type="email" placeholder="Enter email" />

          <label>Phone</label>
          <input type="text" placeholder="Enter phone number" />

          <label>Role</label>
          <input type="text" placeholder="Enter role (e.g. manager)" />

          <button type="submit">Register</button>

          <div className="admin-register-center">
            <span>
              Already have an account?{" "}
              <span
                className="admin-register-link"
                onClick={() => (window.location.href = "/AdminLogin")}
              >
                Login
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
