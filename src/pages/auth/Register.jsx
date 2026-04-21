import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAction, clearAuthFlagsAction } from "../../redux/UserAuthActions";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const inputFieldCls = "w-full px-[10px] py-[10px] text-sm border border-[#ddd] rounded-lg outline-none focus:border-[#0288d1] resize-vertical";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error, user, registerSuccess } = useSelector((s) => s.userAuth || {});
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "", email: "", phone: "", password: "",
    is_customer: true, address: "", city: "", profile_photo: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    dispatch(registerUserAction(fd));
  };

  useEffect(() => {
    if (registerSuccess) { toast.success("Registered successfully"); navigate("/login"); dispatch(clearAuthFlagsAction()); }
  }, [registerSuccess, navigate, dispatch]);

  useEffect(() => {
    if (!loading && error) {
      let msg = typeof error === "string" ? error : error?.detail || error?.message || (() => {
        if (error && typeof error === "object") {
          const k = Object.keys(error)[0]; const v = error[k];
          if (Array.isArray(v)) return v.join(", ");
          if (typeof v === "string") return v;
        }
        return "Registration failed";
      })();
      toast.error(msg);
      dispatch(clearAuthFlagsAction());
    }
  }, [loading, error, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dff6ff] via-[#eaf7ff] to-[#f6fcff] font-[Outfit] overflow-hidden py-[140px] px-4">

      {/* CARD */}
      <div className="relative w-full max-w-[92%] sm:max-w-[720px] bg-white px-[22px] sm:px-7 pt-[34px] pb-7 rounded-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.14)] animate-[authRegisterFadeUp_0.45s_ease]">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r from-[#00bcd4] to-[#0288d1] rounded-t-[18px]" />

        <h2 className="text-center mb-6 font-[Playfair_Display] text-[26px] font-bold text-[#0b3c5d]">
          Create Accounts
        </h2>

        <form onSubmit={handleSubmit}>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] sm:gap-3 mb-[14px]">

            <div className="w-full">
              <Input label="Username" name="username" required placeholder="Enter your username"
                value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>

            <div className="w-full">
              <Input label="Email" name="email" type="email" required placeholder="Enter your email"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="w-full">
              <Input label="Phone" name="phone" type="tel" pattern="[0-9]{10}" required
                placeholder="Enter 10-digit phone" title="Phone number must be 10 digits"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="w-full">
              <Input label="Password" name="password" type="password" required minLength={6}
                placeholder="Enter password (min 6 chars)"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <div className="w-full">
              <Input label="City" name="city" required placeholder="Enter your city"
                value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>

            <div className="w-full">
              <div className="my-[6px] mb-4">
                <label className="block text-sm mb-[6px]">Profile Photo</label>
                <input
                  type="file" accept="image/*"
                  className="w-full px-[8px] py-[8px] text-sm border border-[#ddd] rounded-lg bg-white outline-none"
                  onChange={(e) => setForm({ ...form, profile_photo: e.target.files?.[0] || null })}
                />
              </div>
            </div>

            {/* ADDRESS — full width */}
            <div className="col-span-1 sm:col-span-2">
              <div className="my-[10px] mb-[14px]">
                <label className="block text-sm mb-[6px]">Address</label>
                <textarea
                  name="address" rows={3} placeholder="Enter your address"
                  value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={inputFieldCls}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading}
            className="bg-gradient-to-br from-[#00bcd4] to-[#1976d2] hover:from-[#00acc1] hover:to-[#1565c0] text-white border-none rounded-lg py-3 text-[15px] font-semibold cursor-pointer w-full transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_18px_rgba(0,0,0,0.15)] disabled:bg-[#cfd8dc] disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
            Register
          </Button>
        </form>

        {/* LINKS */}
        <div className="flex justify-between text-sm mt-[14px]">
          <Link className="text-[#0288d1] font-medium no-underline hover:underline cursor-pointer" to="/login">
            Already have an account?
          </Link>
          <Link className="text-[#0288d1] font-medium no-underline hover:underline cursor-pointer" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>

      <style>{`@keyframes authRegisterFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default Register;
