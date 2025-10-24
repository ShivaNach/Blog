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
  const [checkingAuth, setCheckingAuth] = useState(true); 
  const [adminUsername, setAdminUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/admin");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      setAdminUsername(decoded.username);
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
    <div className="flex flex-col items-center gap-10">
      <div className="flex items-center justify-between w-full px-8">
      <h1 className="text-3xl ml-30 font-semibold text-center flex-1">
        Welcome Back {adminUsername}!
      </h1>

      <a
        onClick={handleSignOut}
        className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition ml-4"
      >
        SIGN OUT
      </a>
    </div>
    <a  href="/admin/dashboard/create" className="p-4 text-4xl font-semibold bg-gradient-to-r from-blue-500 to-green-600 rounded-4xl">Create New Blog</a>
    </div>
  );
}
