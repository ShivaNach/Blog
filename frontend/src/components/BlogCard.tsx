import Link from "next/link";
type BlogCardProps = {
  title: string;
  date: string;
  description: string;
  isNew : boolean;
  slug: string;
};
function truncateText(text: string, maxLength: number) {
  const words: string[] = text.split(" ");
  if (words.length <= maxLength) return text;
  return words.slice(0, maxLength).join(" ") + "...";
}
export default function BlogCard({slug, title, date, description, isNew}: BlogCardProps) {
  return (
    <Link href={{ pathname: `/blog/${slug}` }} className="no-underline">
    <article className="w-200 group p-6 mb-6 rounded-3xl shadow-md bg-[#002652] hover:bg-[#00326b] transition-colors">
      <h2 className="text-2xl font-semibold mb-2 flex items-center ">
      <span className="group-hover:underline">{title}</span>
      {isNew && (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-rose-500 rounded-full">
        NEW
      </span>
      )}
      </h2>
      <p className="text-sm text-gray-400 mb-3">{date}</p>
      <p className="text-gray-300">{truncateText(description, 20)}</p>
    </article>
    </Link> 
  );
}
