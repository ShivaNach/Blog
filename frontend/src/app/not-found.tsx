export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
            <p className="text-xl text-blue-500 mb-8">Page Not Found</p>
            <a href="/" className="text-blue-500 bg-[#001f42] p-2 rounded-xl">Go back home</a>
        </div>
    );
}
