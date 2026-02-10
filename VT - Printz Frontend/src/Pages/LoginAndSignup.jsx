import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginAndSignup() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  // Login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // Forgot Password State
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  // OTP
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // Message
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- TIMER & RESEND OTP ---------------- */
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer Effect
  useEffect(() => {
    let timer;
    if ((showOtp || forgotStep === 2) && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, showOtp, forgotStep]);

  // Reset timer when modals open
  useEffect(() => {
    if (showOtp || forgotStep === 2) {
      setTimeLeft(60);
      setCanResend(false);
    }
  }, [showOtp, forgotStep]);

  const handleResendOtp = async () => {
    const emailToResend = showOtp ? signupData.email : forgotEmail;
    if (!emailToResend) return;

    setIsLoading(true);
    if (showOtp) setSignupMessage("");
    else setForgotMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-otp`,
        { email: emailToResend }
      );
      const msg = res.data.message;
      if (showOtp) setSignupMessage(msg);
      else setForgotMessage(msg);

      // Reset Timer
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to resend OTP";
      if (showOtp) setSignupMessage(errorMsg);
      else setForgotMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupMessage("");

    if (signupData.password !== signupData.confirmPassword) {
      setSignupMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        signupData
      );

      setSignupMessage(res.data.message);
      setShowOtp(true);
      // Timer resets via useEffect
    } catch (err) {
      setSignupMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- OTP VERIFY ---------------- */
  const verifyOtp = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          email: signupData.email,
          otp,
        }
      );

      setSignupMessage(res.data.message);
      setShowOtp(false);

      // Auto-login: If backend returns token, save it and redirect
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user && res.data.user.name) {
          localStorage.setItem("userName", res.data.user.name);
        }

        // CHECK PENDING CART ITEM
        const pendingItemStr = localStorage.getItem('pendingCartItem');
        if (pendingItemStr) {
          try {
            const pendingItem = JSON.parse(pendingItemStr);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`,
              { productId: pendingItem.productId, quantity: pendingItem.quantity },
              { headers: { "auth-token": res.data.token } }
            );
            localStorage.removeItem('pendingCartItem');
            alert("Item added to cart from your previous session!");
          } catch (e) {
            console.error("Failed to add pending item", e);
          }
        }

        navigate("/");
      } else {
        // Fallback to login form if no token
        setIsLogin(true);
        // Prefill login email
        setLoginData((prev) => ({
          ...prev,
          email: signupData.email,
        }));
      }

    } catch (err) {
      setSignupMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        loginData
      );

      setLoginMessage(res.data.message);

      // 👉 OPTIONAL: save token if backend sends it
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user && res.data.user.name) {
          localStorage.setItem("userName", res.data.user.name);
        }

        // CHECK PENDING CART ITEM
        const pendingItemStr = localStorage.getItem('pendingCartItem');
        if (pendingItemStr) {
          try {
            const pendingItem = JSON.parse(pendingItemStr);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`,
              { productId: pendingItem.productId, quantity: pendingItem.quantity },
              { headers: { "auth-token": res.data.token } }
            );
            localStorage.removeItem('pendingCartItem');
            alert("Item added to cart from your previous session!");
          } catch (e) {
            console.error("Failed to add pending item", e);
          }
        }
      }

      // 👉 Redirect to Home page
      navigate("/");
    } catch (err) {
      setLoginMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- FORGOT PASSWORD ---------------- */
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email: forgotEmail }
      );
      setForgotMessage(res.data.message);
      setForgotStep(2);
      // Timer resets via useEffect
    } catch (err) {
      setForgotMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotMessage("");

    if (newPassword !== confirmNewPassword) {
      setForgotMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { email: forgotEmail, otp: resetOtp, newPassword }
      );
      setForgotMessage(res.data.message);
      alert("Password reset successfully! Please login.");
      setShowForgot(false);
      setForgotStep(1);
      setForgotEmail("");
      setResetOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setForgotMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-56">
      <div className="relative w-[900px] h-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* ... Sliding Panel ... */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 bg-[#DB2A7B] text-white flex flex-col items-center justify-center transition-transform duration-700 ease-in-out z-20 ${isLogin ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <h2 className="text-4xl font-bold mb-4">
            {isLogin ? "Hello, Friend!" : "Welcome Back!"}
          </h2>
          <p className="mb-6 text-center px-6">
            {isLogin
              ? "Sign up and start your journey with us"
              : "Login with your personal info"}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setLoginMessage("");
              setSignupMessage("");
            }}
            className="border border-white px-8 py-2 rounded-full hover:bg-white hover:text-[#DB2A7B] transition"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>

        {/* FORMS */}
        <div className="flex w-full h-full">

          {/* SIGNUP FORM */}
          <div className={`w-1/2 flex items-center justify-center transform transition-transform duration-700 ${isLogin ? "translate-x-0" : "translate-x-0"}`}>
            <form className="w-3/4" onSubmit={handleSignup}>
              {/* ... Signup fields ... */}
              <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
              <input type="text" placeholder="Name" className="w-full mb-4 px-4 py-3 border rounded-lg" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
              <input type="email" placeholder="Email" className="w-full mb-4 px-4 py-3 border rounded-lg" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
              <input type="password" placeholder="Password" className="w-full mb-4 px-4 py-3 border rounded-lg" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" className="w-full mb-4 px-4 py-3 border rounded-lg" value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} />
              <button disabled={isLoading} className="w-full bg-[#DB2A7B] text-white py-3 rounded-lg disabled:opacity-50">{isLoading ? "Signing up..." : "Sign Up"}</button>
              {signupMessage && <p className="text-center text-sm text-red-600 mt-2">{signupMessage}</p>}
            </form>
          </div>

          {/* LOGIN FORM */}
          <div className={`w-1/2 flex items-center justify-center transform transition-transform duration-700`}>
            <form className="w-3/4" onSubmit={handleLogin}>
              <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 px-4 py-3 border rounded-lg"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full mb-2 px-4 py-3 border rounded-lg"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />

              <div className="text-right mb-4">
                <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button disabled={isLoading} className="w-full bg-[#DB2A7B] text-white py-3 rounded-lg disabled:opacity-50">
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {loginMessage && (
                <p className="text-center text-sm text-red-600 mt-2">
                  {loginMessage}
                </p>
              )}
            </form>
          </div>

          {/* OTP MODAL */}
          {showOtp && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white">
              <form className="w-[360px] p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-3xl font-bold mb-4 text-green-600">
                  Verify OTP
                </h2>

                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter OTP"
                  className="w-full mb-4 px-4 py-3 border rounded-lg text-center"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <div className="mb-4">
                  {canResend ? (
                    <button type="button" onClick={handleResendOtp} className="text-blue-600 hover:underline text-sm">Resend OTP</button>
                  ) : (
                    <p className="text-sm text-gray-400">Resend OTP in {timeLeft}s</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full bg-green-600 text-white py-3 rounded-lg"
                >
                  Verify OTP
                </button>
                <div className="mt-4">
                  <button type="button" onClick={() => setShowOtp(false)} className="text-sm text-gray-500 hover:text-black">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD MODAL */}
          {showForgot && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm">
              <div className="w-[400px] p-8 bg-white rounded-2xl shadow-2xl relative border">
                <button onClick={() => { setShowForgot(false); setForgotStep(1); }} className="absolute top-4 right-4 text-gray-500 hover:text-black">✕</button>

                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotSubmit}>
                    <h2 className="text-2xl font-bold mb-4 text-center text-[#DB2A7B]">Reset Password</h2>
                    <p className="text-sm text-gray-500 mb-6 text-center">Enter your email to receive an OTP.</p>
                    <input
                      type="email"
                      required
                      placeholder="Enter Email"
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                    <button className="w-full bg-[#DB2A7B] text-white py-3 rounded-lg">Send OTP</button>
                  </form>
                ) : (
                  <form onSubmit={handleResetSubmit}>
                    <h2 className="text-2xl font-bold mb-4 text-center text-[#DB2A7B]">New Password</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">Enter OTP from email and your new password.</p>
                    <input
                      type="text"
                      required placeholder="OTP"
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                    />
                    <input
                      type="password"
                      required placeholder="New Password"
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      required placeholder="Confirm New Password"
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />

                    <div className="mb-4 text-center">
                      {canResend ? (
                        <button type="button" onClick={handleResendOtp} className="text-blue-600 hover:underline text-sm">Resend OTP</button>
                      ) : (
                        <p className="text-sm text-gray-400">Resend OTP in {timeLeft}s</p>
                      )}
                    </div>

                    <button className="w-full bg-green-600 text-white py-3 rounded-lg">Reset Password</button>
                  </form>
                )}
                {forgotMessage && <p className="text-center text-sm text-blue-600 mt-4">{forgotMessage}</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

}

export default LoginAndSignup;
