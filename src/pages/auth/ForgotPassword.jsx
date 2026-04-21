import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { passwordResetRequestAction, clearAuthFlagsAction } from "../../redux/UserAuthActions";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading, passwordResetSent, error } = useSelector((s) => s.userAuth || {});
  const [email, setEmail] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dff6ff] via-[#eaf7ff] to-[#f6fcff] font-[Outfit] overflow-hidden px-4">

      {/* CARD */}
      <div className="relative w-full max-w-[92%] sm:max-w-[380px] bg-white px-[22px] sm:px-7 pt-[34px] pb-7 rounded-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.14)] animate-[authForgotFadeUp_0.45s_ease]">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r from-[#00bcd4] to-[#0288d1] rounded-t-[18px]" />

        <h2 className="text-center mb-6 font-[Playfair_Display] text-[26px] font-bold text-[#0b3c5d]">
          Forgot Password
        </h2>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-br from-[#00bcd4] to-[#1976d2] hover:from-[#00acc1] hover:to-[#1565c0] text-white border-none rounded-lg py-3 text-[15px] font-semibold cursor-pointer w-full mt-[14px] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_18px_rgba(0,0,0,0.15)] disabled:bg-[#cfd8dc] disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            {passwordResetSent ? "Sent" : "Send Reset Link"}
          </Button>
        </form>

        {/* LINKS */}
        <div className="flex justify-start gap-[6px] text-sm mt-[14px]">
          <span className="text-black">Remembered your password?</span>
          <Link className="text-[#0288d1] font-medium no-underline hover:underline cursor-pointer" to="/login">
            Login
          </Link>
        </div>
      </div>

      <style>{`@keyframes authForgotFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
