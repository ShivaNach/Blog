"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username: string;
  role: string;
  exp: number; // expiry timestamp in seconds
}

export default function Dashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true); // new state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/admin");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime || decoded.role !== "admin") {
        // token expired or not admin
        localStorage.removeItem("token");
        router.replace("/admin");
        return;
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      router.replace("/admin");
      return;
    }

    // Token is valid
    setCheckingAuth(false);
  }, [router]);

  function handleSignOut() {
    localStorage.removeItem("token");
    router.replace("/admin");
  }

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-white text-xl">Setting things up...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-2xl font-semibold mb-6">Congrats, you are logged in!</p>
      <button
        onClick={handleSignOut}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
