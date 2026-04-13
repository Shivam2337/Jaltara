import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    if (result?.access) {
      navigate("/AdminDashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center font-[Poppins]">
      <div className="w-[350px] bg-white px-[30px] py-[35px] rounded-[10px] shadow-[0_10px_25px_rgba(0,0,0,0.15)]">
        <h2 className="text-center mb-6 text-[#333] text-xl font-semibold">Admin Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col">

          <label className="text-sm mb-[5px] text-[#444]">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-[10px] py-[10px] mb-[15px] border border-[#ddd] rounded-md outline-none transition-colors duration-200 focus:border-[#4f46e5]"
          />

          <label className="text-sm mb-[5px] text-[#444]">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-[10px] py-[10px] mb-[15px] border border-[#ddd] rounded-md outline-none transition-colors duration-200 focus:border-[#4f46e5]"
          />

          <button
            type="submit"
            className="py-[10px] bg-[#1e293b] text-white border-none rounded-md cursor-pointer text-[15px] transition-all duration-300"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}
