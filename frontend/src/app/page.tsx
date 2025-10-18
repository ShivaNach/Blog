"use client";

import { useState, useRef, useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // for "loading more"
  const [initialLoading, setInitialLoading] = useState(true); // only for first load
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false); // prevent concurrent fetches

  async function fetchPosts(pageNum: number) {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    if (pageNum === 1) setInitialLoading(true);
    else setLoading(true);

    try {
      console.log("Fetching page", pageNum);
      // simulate latency if you like: await new Promise(r => setTimeout(r, 500));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?page=${pageNum}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      console.log("API response for page", pageNum, data);

      // Expecting an array. If API returns metadata, adapt accordingly.
      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((p) => [...p, ...data]);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setInitialLoading(false);
    }
  }

  // Fetch whenever `page` changes (including initial page=1)
  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // IntersectionObserver: attach after DOM renders the sentinel.
  // We include posts.length so this effect re-runs after initial load and the sentinel exists.
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) {
      // sentinel not mounted yet; will re-run when posts.length changes
      return;
    }
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isFetchingRef.current && hasMore) {
            setPage((prev) => prev + 1);
          }
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, posts.length]); // re-run once posts are present so loaderRef exists

  // Initial skeleton UI
  if (initialLoading) {
    const skeletonCount = 6;
    return (
      <div className="grid gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      {posts.map((post, idx) => (
        <BlogCard
          key={idx}
          title={post.title}
          date={new Date(post.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          description={post.description}
          isNew={idx < 3}
          slug={post.slug}
        />
      ))}

      {/* sentinel observed by IntersectionObserver */}
      {hasMore && <div ref={loaderRef} className="h-10" />}

      {/* small loading indicator for subsequent pages */}
      {loading && !initialLoading && (
        <p className="text-center text-gray-400 py-4">Loading more...</p>
      )}
    </div>
  );
}
