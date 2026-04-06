import React, { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAction, clearAuthFlagsAction } from "../../redux/UserAuthActions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const dispatch = useDispatch();
  const { loading, error, user, registerSuccess } = useSelector((s) => s.userAuth || {});
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    is_customer: true,
    address: "",
    city: "",
    profile_photo: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v);
    });
    dispatch(registerUserAction(fd));
  };
  useEffect(() => {
    if (registerSuccess) {
      toast.success("Registered successfully");
      navigate("/login");
      dispatch(clearAuthFlagsAction());
    }
  }, [registerSuccess, navigate, dispatch]);
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
              return "Registration failed";
            })();
      toast.error(msg);
      dispatch(clearAuthFlagsAction());
    }
  }, [loading, error, dispatch]);

  return (
    <div className="auth-register-wrapper">
      <div className="auth-register-card">
        <h2 className="auth-register-title">Create Account</h2>

        <form className="auth-register-form" onSubmit={handleSubmit}>
          <div className="auth-register-grid">
            <div className="auth-register-grid-item">
              <Input
                label="Username"
                name="username"
                required
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div className="auth-register-grid-item">
              <Input
                label="Email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="auth-register-grid-item">
              <Input
                label="Phone"
                name="phone"
                type="tel"
                pattern="[0-9]{10}"
                required
                placeholder="Enter 10-digit phone"
                title="Phone number must be 10 digits"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="auth-register-grid-item">
              <Input
                label="Password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Enter password (min 6 chars)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="auth-register-grid-item">
              <Input
                label="City"
                name="city"
                required
                placeholder="Enter your city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="auth-register-grid-item">
              <div className="auth-register-file-group">
                <label className="auth-register-file-label">Profile Photo</label>
                <input
                  className="auth-register-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      profile_photo: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            </div>

            <div className="auth-register-grid-item span-2">
              <div className="auth-register-textarea-group">
                <label className="auth-register-textarea-label">Address</label>
                <textarea
                  className="auth-register-textarea"
                  name="address"
                  rows={3}
                  placeholder="Enter your address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

      

          <Button
            type="submit"
            className="auth-register-primary-btn"
            disabled={loading}
          >
            Register
          </Button>
        </form>

        <div className="auth-register-links">
          <Link
            className="auth-register-link-left"
            to="/login"
          >
            Already have an account?
          </Link>

          <Link
            className="auth-register-link-right"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        {/* <div className="auth-register-divider">OR</div> */}

        {/* <button type="button" className="auth-register-google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          Sign up with Google
        </button> */}
      </div>
    </div>
  );
};

export default Register;
