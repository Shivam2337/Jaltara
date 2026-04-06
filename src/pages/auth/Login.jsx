import React, { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction, clearAuthFlagsAction } from "../../redux/UserAuthActions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, token, loginSuccess } = useSelector((s) => s.userAuth || {});
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUserAction(form));
  };
  useEffect(() => {
    if (loginSuccess) {
      toast.success("Logged in successfully");
      navigate("/");
      dispatch(clearAuthFlagsAction());
    }
  }, [loginSuccess, navigate, dispatch]);
  useEffect(() => {
    if (!loading && error) {
      let msg =
        typeof error === "string"
          ? error
          : error?.detail ||
            error?.message ||
            (() => {
              if (error && typeof error === "object") {
                const k = Object.keys(error)[0];
                const v = error[k];
                if (Array.isArray(v)) return v.join(", ");
                if (typeof v === "string") return v;
              }
              return "Login failed";
            })();
      toast.error(msg);
      dispatch(clearAuthFlagsAction());
    }
  }, [loading, error, dispatch]);

  return (
    <div className="auth-login-wrapper">
      <div className="auth-login-card">
        <h2 className="auth-login-title">Login</h2>

        <form className="auth-login-form" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            required
            placeholder="Enter your username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Enter password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Auth Links Row */}
          <div className="auth-login-links-row">
            <span>Don’t have an account?</span>
            <div>
              <Link className="auth-login-link" to="/register">
                Register
              </Link>
              <span> • </span>
              <Link className="auth-login-link" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="auth-login-primary-btn" disabled={loading}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
