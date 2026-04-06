import React, { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./ForgotPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { passwordResetRequestAction, clearAuthFlagsAction } from "../../redux/UserAuthActions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading, passwordResetSent } = useSelector((s) => s.userAuth || {});
  const [email, setEmail] = useState("");
  const { error } = useSelector((s) => s.userAuth || {});

  

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(passwordResetRequestAction(email));
  };
  useEffect(() => {
    if (!loading && passwordResetSent) {
      toast.success("Password reset link sent");
      dispatch(clearAuthFlagsAction());
    }
  }, [loading, passwordResetSent, dispatch]);
  useEffect(() => {
    if (!loading && error) {
      const msg = typeof error === "string" ? error : "Password reset failed";
      toast.error(msg);
      dispatch(clearAuthFlagsAction());
    }
  }, [loading, error, dispatch]);

  return (
    <div className="auth-forgot-wrapper">
      <div className="auth-forgot-card">
        <h2 className="auth-forgot-title">Forgot Password</h2>

        <form className="auth-forgot-form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="auth-forgot-primary-btn"
            disabled={loading}
          >
            {passwordResetSent ? "Sent" : "Send Reset Link"}
          </Button>
        </form>

        <div className="auth-forgot-links">
          <span className="auth-forgot-text">Remembered your password?</span>

          <Link className="auth-forgot-link" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
