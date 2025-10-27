"use client";

import { useAdminInAuthCheck } from "@/hooks/useAdminInAuthCheck";
import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

type Blog = {
  title: string;
  description: string;
  content: string;
  published_at: string;
};

export default function EditBlog() {
    const { slug } = useParams<{ slug: string }>();
    const { setLoading, checkingAuth, loading } = useAdminInAuthCheck();
    const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    });
    const [message, setMessage] = useState("");
    const [blogNotFound, setBlogNotFound] = useState(false);

    // Fetch blog data to pre-fill form
    useEffect(() => {
    const fetchBlog = async () => {
        try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            setBlogNotFound(true);
            return;
        }

        const blog: Blog = await res.json();
        setFormData({
            title: blog.title,
            description: blog.description,
            content: blog.content,
        });
        } catch (error) {
        console.error("Failed to load blog:", error);
        setBlogNotFound(true);
        }
    };

    if (slug) fetchBlog();
    }, [slug]);

    // Handle field changes
    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmed) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ slug }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete blog");
            alert("Blog deleted successfully!");
            window.location.href = "/admin/dashboard"; // Redirect after deletion
        } catch (error: any) {
            alert("❌ " + error.message);
        } finally {
            setLoading(false);
        }
    };
    // Submit edited data
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const confirmed = window.confirm("Do you wish to update your blog?");
    if (!confirmed) return;

    setLoading(true);

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug, ...formData }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to update blog");

        setMessage("✅ Blog updated successfully!");
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

    if (blogNotFound) notFound();

    return (
    <>
    <a
    onClick={handleDelete}
    className="text-red-400 bg-[#2a0000] hover:bg-[#3a0000] p-3 px-6 rounded-xl font-semibold block w-fit mx-auto text-center transition-all duration-300 mb-5 cursor-pointer"
    >
    Delete Blog
    </a>


    <div className="max-w-3xl mx-auto bg-[#001733]/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[#003366]">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
        Edit Blog
        </h1>

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
            {loading ? "Updating..." : "Update Blog"}
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
    </>
    );
}
