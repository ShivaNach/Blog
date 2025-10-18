A modern, responsive **Next.js Blog Application** built for performance, interactivity, and a great reading experience.  
This project fetches blog posts dynamically from a **PostgreSQL** database via an **API**, supports **infinite scrolling**, and offers a polished UI with skeleton loaders and custom error handling.

---

## ✨ Features

### 🚀 Dynamic Content Loading
- Fetches blogs from an API connected to a **PostgreSQL** database.
- Displays blogs in a **card-based layout** with a clean, responsive design.
- Uses **pagination** and the **Intersection Observer API** to load more blogs as the user scrolls.

### 🆕 Intelligent Sorting
- Blogs are fetched in **chronological order (latest first)**.
- The **top 3 newest blogs** are automatically labeled with a **“NEW” badge**.

### 🧭 Seamless Navigation
- Uses **dynamic slugs** for blog routes (e.g. `/blog/my-first-post`).
- Each blog page fetches its content dynamically from the API.

### 💫 Smooth User Experience
- **Skeleton loaders** keep users engaged while content is loading.
- Includes a **custom 404 page** for missing or invalid routes.
- Graceful error handling and fallback UI.

### 🔒 Secure Configuration
- Uses a `.env` file to abstract sensitive data such as API URLs and database credentials.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend Framework** | [Next.js](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **API Communication** | Native `fetch` / Axios |
| **Dynamic Loading** | Intersection Observer API |
| **Routing** | Next.js Dynamic Routes |
| **Deployment Ready** | Vercel / Docker / Any Node environment |