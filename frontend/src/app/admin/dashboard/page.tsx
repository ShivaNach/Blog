"use client";

import { useRouter } from "next/navigation";
import { useAdminInAuthCheck } from "@/hooks/useAdminInAuthCheck";
import HomePage from "@/app/page";

export default function Dashboard() {
  const router = useRouter();
  const { setLoading, checkingAuth, loading, adminUsername } = useAdminInAuthCheck();
  
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
    <a  href="/admin/dashboard/create" className="p-4 text-4xl font-semibold bg-gradient-to-r from-blue-500 to-green-600 rounded-4xl hover:from-green-600 hover:to-blue-500 hover:rotate-1 transition">Create New Blog</a>
    <h1 className="text-5xl">VIEW BLOGS</h1>
    <HomePage adminView={true} />
    </div>
  );
}
