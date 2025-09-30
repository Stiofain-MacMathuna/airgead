import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;

    setError("");
    setSuccess(""); 
    setIsLoggingIn(true);

    try {
      if (isRegister) {
        await axios.post("/api/auth/register", { username, password });
        
        setSuccess("Registration successful! Please log in."); 
        
        setIsRegister(false);
        setUsername("");
        setPassword("");
      } else {
        const res = await axios.post("/api/auth/login", { username, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isRegister ? "Registration failed. Please try again." : "Invalid username or password.")
      );
    } finally {
      setIsLoggingIn(false);
    }
  }, [username, password, isRegister, isLoggingIn, navigate]);

  return (
    <div className="flex justify-center items-center h-screen w-screen overflow-hidden bg-teal-50">
      <div className="p-8 w-full max-w-sm bg-white rounded-xl shadow-2xl transition duration-300">
        
        <div className="text-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600 mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10v6a2 2 0 002 2v-4a2 2 0 00-2-2H4zm12 8V6h2a2 2 0 012 2v4a2 2 0 01-2 2h-2z" clipRule="evenodd" />
          </svg>
          <h1 className="text-3xl font-extrabold text-gray-800">
            {isRegister ? "Create Account" : "Secure Banking App"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 h-8">
            {isRegister 
                ? "Deposit and withdrawal demo." 
                : "A portfolio demo showcasing Spring Boot, JWT, and Azure deployment."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoggingIn}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-150"
              aria-label="Username"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoggingIn}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-150"
              aria-label="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-150 shadow-md ${
                isLoggingIn
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 hover:shadow-lg"
              }`}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isRegister ? "Registering..." : "Logging In..."}
                </div>
              ) : (
                isRegister ? "Register" : "Login"
              )}
            </button>
          </div>
        </form>

        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm transition duration-300">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition duration-300">
            {error}
          </div>
        )}

        <div className="text-center mt-5">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(""); 
              setSuccess("");         
              setUsername("");
              setPassword("");
            }}
            disabled={isLoggingIn}
            className="text-sm font-medium text-teal-600 hover:text-teal-800 transition duration-150 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isRegister
              ? "Already have an account? Log In"
              : "No account? Register here"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;