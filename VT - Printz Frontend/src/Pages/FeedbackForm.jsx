import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../Assets/feedback-bg.png";

const API_URL = import.meta.env.VITE_API_URL;

const FeedbackForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit feedback");
      }

      // success
      setFormData({ name: "", email: "", message: "" });
      alert("Feedback submitted successfully!");

      // OPTIONAL: redirect after submit
      navigate("/feedback-list");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-28 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Form Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Give Your Feedback
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email ID"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <textarea
            name="message"
            placeholder="Your Feedback"
            rows="4"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DB2A7B] text-white py-3 rounded-lg font-semibold hover:bg-[#c21f6a] transition duration-300 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
