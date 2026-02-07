import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../Assets/feedback-bg.png";

const API_URL = import.meta.env.VITE_API_URL;

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH FROM BACKEND ----------------
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/feedback/public`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setFeedbacks(data);
        }
      } catch (err) {
        console.error("Failed to load feedbacks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/13"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-[131px]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-4xl font-extrabold text-gray-800">
            💬 User Feedbacks
          </h2>
          <Link
            to="/feedback-form"
            className="bg-[#DB2A7B] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-[#c21f6a] transition transform hover:scale-105"
          >
            Write a Feedback ✍️
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading feedbacks…</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">
            No feedbacks yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {feedbacks.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      {item.name}
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${item.status === "replied"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : item.status === "reviewed"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  {item.message}
                </p>

                {item.adminReply && (
                  <p className="mt-4 text-sm bg-gray-50 p-3 rounded">
                    <b>Admin Reply:</b> {item.adminReply}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/feedback-form"
            className="inline-flex items-center gap-2 text-white bg-[#02192F] px-8 py-3 rounded-lg font-semibold hover:bg-[#032a4f] transition shadow-md"
          >
            Share Your Experience ➜
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;
