"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  username: string;
  role: string;
  exp: number;
}

export default function CreateBlog() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔐 Check for admin JWT
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

    setCheckingAuth(false);
  }, [router]);

  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create blog");

      setMessage("✅ Blog created successfully!");
      setFormData({ title: "", description: "", content: "" });
    } catch (error: any) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-white text-xl">Setting things up...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-[#001733]/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[#003366]">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Create a New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-300 mb-2 text-lg">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the blog title"
            required
            className="w-full p-3 rounded-lg bg-[#001b39] border border-[#004080] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-300 mb-2 text-lg">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description about the blog"
            required
            className="w-full p-3 rounded-lg bg-[#001b39] border border-[#004080] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-300 mb-2 text-lg">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            required
            rows={10}
            className="w-full p-4 rounded-xl bg-transparent border border-[#004080] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
