export default function BlogPageSkeleton() {
    return (
        <article className="w-200 mx-auto p-6 mb-6 rounded-3xl shadow-md animate-pulse">
        {/* Title placeholder */}
        <div className="h-8 w-3/4 bg-gray-500 rounded mb-2"></div>

        {/* Date placeholder */}
        <div className="h-4 w-1/8 bg-gray-400 rounded mb-10"></div>

        {/* Description placeholder */}
        <div className="space-y-2">
            <div className="h-3 w-full bg-gray-500 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-500 rounded"></div>
            <div className="h-3 w-4/6 bg-gray-500 rounded"></div>
            <div className="h-3 w-3/6 bg-gray-500 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-500 rounded"></div>
            <div className="h-3 w-4/6 bg-gray-500 rounded"></div>
            <div className="h-3 w-3/6 bg-gray-500 rounded"></div>
        </div>
        </article>
    );
}