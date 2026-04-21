import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction, clearAuthFlagsAction } from "../../redux/UserAuthActions";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dff6ff] via-[#eaf7ff] to-[#f6fcff] font-[Outfit] overflow-hidden">

      {/* CARD */}
      <div className="relative w-[92%] sm:w-[380px] bg-white px-[22px] sm:px-7 pt-[34px] pb-7 rounded-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.14)] animate-[authLoginFadeUp_0.45s_ease]">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r from-[#00bcd4] to-[#0288d1] rounded-t-[18px]" />

        <h2 className="text-center mb-6 font-[Playfair_Display] text-[26px] font-bold text-[#0b3c5d] tracking-[0.4px]">
          Login
        </h2>

        <form className="flex flex-col" onSubmit={handleSubmit}>
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

          {/* LINKS ROW */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-[14px] mb-5 text-sm gap-2 sm:gap-0">
            <span>Don't have an account?</span>
            <div className="flex flex-wrap gap-[10px] sm:gap-0 sm:items-center">
              <Link className="text-[#0288d1] font-medium no-underline hover:underline sm:inline" to="/register">
                Register
              </Link>
              <span className="hidden sm:inline"> • </span>
              <Link className="text-[#0288d1] font-medium no-underline hover:underline" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-br from-[#00bcd4] to-[#1976d2] hover:from-[#00acc1] hover:to-[#1565c0] text-white border-none rounded-lg py-3 text-[15px] font-semibold cursor-pointer w-full transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_18px_rgba(0,0,0,0.15)] disabled:bg-[#cfd8dc] disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            Login
          </Button>
        </form>
      </div>

      <style>{`@keyframes authLoginFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default Login;
