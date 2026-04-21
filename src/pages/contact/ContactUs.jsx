import React, { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import { useDispatch, useSelector } from "react-redux";
import { postContactAction } from "../../redux/UserActions";
import { toast } from "react-toastify";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((s) => s.userContactSend || {});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) { toast.error("Phone number must be exactly 10 digits"); return; }
    dispatch(postContactAction(formData));
  };

  useEffect(() => {
    if (success) { toast.success(`Thank you, ${formData.name}! We have received your message.`); setFormData({ name: "", email: "", phone: "", message: "" }); }
    if (error && !loading) { toast.error(typeof error === "string" ? error : "Failed to send message"); }
  }, [success, error, loading]);

  return (
    <div className="max-w-[900px] mx-auto my-20 sm:my-20 md:my-32 lg:my-32 px-[5px] sm:px-5 md:px-[30px] lg:px-[40px] xl:px-[60px] font-[Outfit] text-[#2b2b2b]">

      <h1 className="font-[Playfair_Display] text-[24px] sm:text-[24px] md:text-[26px] lg:text-[30px] xl:text-[34px] font-bold text-center mb-[30px]">
        Contact Us
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gradient-to-br from-[rgba(255,255,255,0.96)] to-[rgba(244,249,252,0.96)]
          p-5 sm:p-5 md:p-6 lg:p-7 xl:p-8
          rounded-xl sm:rounded-2xl
          shadow-[0_18px_40px_rgba(0,0,0,0.12)]
          animate-[contactFadeUp_0.8s_ease_both]
          transition-all duration-400
          hover:-translate-y-[6px] hover:shadow-[0_26px_52px_rgba(0,0,0,0.18)]"
      >
        <Input label="Name" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        <Input label="Email" type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <Input label="Phone Number" type="tel" name="phone" placeholder="10-digit phone number" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" maxLength="10" required />

        <label className="flex flex-col font-semibold text-sm">
          Message
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-[6px] px-3 py-[10px] rounded-md border border-[#ccc] text-sm resize-vertical transition-all duration-300
              focus:outline-none focus:border-[#bfa528] focus:shadow-[0_0_0_3px_rgba(191,165,40,0.18)]"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-[160px] px-4 py-[10px] bg-[#c7d7de] hover:bg-[#bfa528] border-none rounded-md font-bold cursor-pointer text-black transition-all duration-300 hover:-translate-y-[2px]"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
