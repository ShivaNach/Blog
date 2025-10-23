"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username: string;
  role: string;
  exp: number; // expiry timestamp in seconds
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // new state
  const router = useRouter();

  // Redirect if user already has a valid admin token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime && decoded.role === "admin") {
          router.replace("/admin/dashboard");
          return; // exit early
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
    setCheckingAuth(false); // done checking
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      // Store token and optional expiresIn
      localStorage.setItem("token", data.token);
      localStorage.setItem("expiry", (Date.now() + data.expiresIn * 1000).toString());

      router.push("/admin/dashboard");
    } else {
      alert("Invalid credentials");
    }

    setLoading(false);
  }

  // Show authenticating screen while checking token
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-white text-xl">Setting things up...</span>
      </div>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=visibility,visibility_off"
      />
      <div className="flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md rounded-2xl p-8 bg-[#001f42]">
          <h1 className="mb-6 text-center text-6xl font-bold text-white">Admin Login</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                required
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border p-3 pr-10 focus:border-blue-500 focus:outline-none"
              />
              <span
                role="button"
                tabIndex={0}
                onClick={() => setShowPassword(!showPassword)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setShowPassword(!showPassword)
                }
                className="material-symbols-outlined absolute right-3 cursor-pointer text-gray-300 hover:text-white select-none text-2xl leading-none flex items-center justify-center top-1/4"
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </div>

            {!loading ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Login
              </button>
            ) : (
              <div className="w-full rounded-lg bg-blue-600 py-3 flex items-center justify-center animate-pulse">
                <span className="text-white font-semibold">Loading...</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
