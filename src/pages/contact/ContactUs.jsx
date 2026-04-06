import React, { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import "./ContactUs.css";
import { useDispatch, useSelector } from "react-redux";
import { postContactAction } from "../../redux/UserActions";
import { toast } from "react-toastify";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((s) => s.userContactSend || {});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    dispatch(postContactAction(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success(`Thank you, ${formData.name}! We have received your message.`);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
    if (error && !loading) {
      toast.error(typeof error === "string" ? error : "Failed to send message");
    }
  }, [success, error, loading]);


  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="10-digit phone number"
          value={formData.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          maxLength="10"
          required
        />

        <label className="contact-label">
          Message
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="contact-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
