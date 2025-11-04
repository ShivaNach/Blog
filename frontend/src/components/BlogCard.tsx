import Link from "next/link";

type BlogCardProps = {
  title: string;
  date: string;
  description: string;
  isNew: boolean;
  slug: string;
  adminView: boolean;
};

function truncateText(text: string, maxLength: number) {
  const words: string[] = text.split(" ");
  if (words.length <= maxLength) return text;
  return words.slice(0, maxLength).join(" ") + "...";
}

export default function BlogCard({
  slug,
  title,
  date,
  description,
  isNew,
  adminView,
}: BlogCardProps) {
  const pathname = adminView ? `/admin/blog/${slug}` : `/blog/${slug}`;

  return (
    <Link href={pathname} className="no-underline">
      <article
        className="
          flex flex-col justify-between h-full
          p-6 rounded-3xl shadow-md
          bg-[#002652] hover:bg-[#00326b]
          transition-colors
        "
      >
        {/* Title + NEW badge */}
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center min-h-[3rem]">
            <span className="group-hover:underline line-clamp-2">{title}</span>
            {isNew && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-rose-500 rounded-full">
                NEW
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-400 mb-3">{date}</p>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm flex-grow line-clamp-3">
          {truncateText(description, 20)}
        </p>
      </article>
    </Link>
  );
}
